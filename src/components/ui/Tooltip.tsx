'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

type Phase = 'hidden' | 'intent' | 'visible';

type TooltipState = {
    text: string;
    anchorX: number;
    anchorY: number;
};

type Props = {
    content: string;
    children: React.ReactNode;
    disabled?: boolean;

    /** defaults match your spec */
    delayMs?: number; // touch/pointer
    moveCancelPx?: number; // touch intent cancel threshold
    marginPx?: number; // screen edge margin
    zIndex?: number;
};

function getAnchorPoint(el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    return {
        anchorX: rect.left + rect.width / 2,
        // tooltip is above, so anchor at the top edge of the target
        anchorY: rect.top,
    };
}

export default function Tooltip({
    content,
    children,
    disabled = false,
    delayMs = 800,
    moveCancelPx = 40,
    marginPx = 8,
    zIndex = 10,
}: Props) {
    const [phase, setPhase] = useState<Phase>('hidden');
    const [tooltip, setTooltip] = useState<TooltipState | null>(null);

    // Bubble-only horizontal shift to keep bubble within viewport margin while arrow stays centered.
    const [bubbleShiftX, setBubbleShiftX] = useState(0);
    const bubbleRef = useRef<HTMLDivElement | null>(null);

    const pressTimer = useRef<number | null>(null);
    const hoverTimer = useRef<number | null>(null);

    const didShowRef = useRef(false);
    const startPointRef = useRef<{ x: number; y: number } | null>(null);

    const intentCancelledRef = useRef(false);

    // Helps ignore ghost hover after touch.
    const lastTouchAtRef = useRef(0);

    const visibleMoveArmedRef = useRef(false);

    const VISIBLE_HIDE_DY_PX = 16;

    // When touch scroll begins, element can get touchcancel and never receive touchend.
    const stopGlobalEndListener = useRef<(() => void) | null>(null);

    const suppressStyle = useMemo<React.CSSProperties>(
        () => ({
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none',
        }),
        [],
    );

    const clearTimers = () => {
        if (pressTimer.current) window.clearTimeout(pressTimer.current);
        if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
        pressTimer.current = null;
        hoverTimer.current = null;
    };

    const stopGlobalTouchEnd = () => {
        stopGlobalEndListener.current?.();
        stopGlobalEndListener.current = null;
    };

    const hide = () => {
        clearTimers();
        stopGlobalTouchEnd();
        didShowRef.current = false;
        startPointRef.current = null;
        visibleMoveArmedRef.current = false;
        setBubbleShiftX(0);
        setTooltip(null);
        setPhase('hidden');
        intentCancelledRef.current = false;
    };

    const startGlobalTouchEnd = () => {
        if (stopGlobalEndListener.current) return;

        const onGlobalEnd = () => {
            hide();
        };

        // passive true is fine: we only observe the end.
        window.addEventListener('touchend', onGlobalEnd, { passive: true });

        stopGlobalEndListener.current = () => {
            window.removeEventListener('touchend', onGlobalEnd);
        };
    };

    const showAt = (target: HTMLElement | null, mode: 'touch' | 'pointer' | 'keyboard') => {
        if (!target) return;

        const { anchorX, anchorY } = getAnchorPoint(target);

        didShowRef.current = true;
        setPhase('visible');
        setTooltip({ text: content, anchorX, anchorY });

        // Touch: ensure we can close on finger release even if element got touchcancel.
        if (mode === 'touch') startGlobalTouchEnd();
    };

    // Recompute bubble shift once tooltip is rendered & measurable.
    useEffect(() => {
        if (!tooltip) return;

        const raf = window.requestAnimationFrame(() => {
            const el = bubbleRef.current;
            if (!el) return;

            const rect = el.getBoundingClientRect();
            const w = rect.width;
            const vw = window.innerWidth;

            const desiredLeft = tooltip.anchorX - w / 2;
            const desiredRight = tooltip.anchorX + w / 2;

            let shift = 0;
            if (desiredLeft < marginPx) {
                shift = marginPx - desiredLeft;
            } else if (desiredRight > vw - marginPx) {
                shift = (vw - marginPx) - desiredRight; // negative
            }
            setBubbleShiftX(shift);
        });

        return () => window.cancelAnimationFrame(raf);
    }, [tooltip, marginPx]);

    // ----- タッチ操作 -----
    const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        if (disabled) return;

        lastTouchAtRef.current = Date.now();

        setPhase('intent');
        didShowRef.current = false;
        intentCancelledRef.current = false;
        clearTimers();

        const t = e.touches[0];
        startPointRef.current = t ? { x: t.clientX, y: t.clientY } : null;

        const target = e.currentTarget;

        pressTimer.current = window.setTimeout(() => {
            // only show if we’re still in intent (not cancelled)
            if (intentCancelledRef.current) return;
            showAt(target, 'touch');
        }, delayMs);
    };

    const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        const t = e.touches[0];
        if (!t) return;

        // Visible中：縦方向に16px以上動いたら閉じる（スクロール開始とみなす）
        if (didShowRef.current) {
            // Visibleになった直後の1回目のmoveで基準点をセット
            if (!visibleMoveArmedRef.current) {
                startPointRef.current = { x: t.clientX, y: t.clientY };
                visibleMoveArmedRef.current = true;
                return;
            }

            const start = startPointRef.current;
            if (!start) return;

            const dy = t.clientY - start.y;
            if (Math.abs(dy) >= VISIBLE_HIDE_DY_PX) {
                hide();
            }
            return;
        }

        // Intent中：40px以上動いたらキャンセル（今のまま）
        const start = startPointRef.current;
        if (!start) return;

        const dx = t.clientX - start.x;
        const dy = t.clientY - start.y;
        const dist2 = dx * dx + dy * dy;

        if (dist2 >= moveCancelPx * moveCancelPx) {
            intentCancelledRef.current = true;
            clearTimers();
            setPhase('hidden');
            startPointRef.current = null;
        }
    };

    const onTouchEnd = () => {
        // Always end on release.
        hide();
    };

    const onTouchCancel = () => {
        // Key point:
        // - If already visible, do NOT hide (scroll can trigger cancel).
        // - If not visible, cancel intent/timers.
        if (didShowRef.current) {
            clearTimers();
            return;
        }
        hide();
    };

    // ----- ポインター操作 -----
    const shouldIgnorePointerBecauseRecentTouch = () => Date.now() - lastTouchAtRef.current < 700;

    const onPointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
        if (disabled) return;
        if (shouldIgnorePointerBecauseRecentTouch()) return;
        if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;

        setPhase('intent');
        didShowRef.current = false;
        clearTimers();

        const target = e.currentTarget;

        hoverTimer.current = window.setTimeout(() => {
            // Only show if still hovering (we’ll cancel on leave)
            showAt(target, 'pointer');
        }, delayMs);
    };

    const onPointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
        if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
        hide();
    };

    // ----- keyboard -----
    const onFocusCapture = (e: React.FocusEvent<HTMLDivElement>) => {
        if (disabled) return;
        // Show immediately when focus enters anywhere inside.
        showAt(e.currentTarget, 'keyboard');
    };

    const onBlurCapture = () => {
        // Close when focus leaves the clickable range.
        hide();
    };

    const onKeyDownCapture = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Escape') {
            e.stopPropagation();
            hide();
        }
    };

    return (
        <>
            <div
                className="select-none touch-pan-y"
                style={suppressStyle}
                onContextMenu={(e) => e.preventDefault()}
                // touch
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onTouchCancel={onTouchCancel}
                // pointer
                onPointerEnter={onPointerEnter}
                onPointerLeave={onPointerLeave}
                // keyboard (capture so sr-only input focus is caught)
                onFocusCapture={onFocusCapture}
                onBlurCapture={onBlurCapture}
                onKeyDownCapture={onKeyDownCapture}
            >
                {children}
            </div>

            {tooltip && phase === 'visible' && (
                <div
                    className="fixed"
                    style={{
                        left: tooltip.anchorX,
                        top: tooltip.anchorY,
                        zIndex,
                        transform: 'translate(-50%, -100%)',
                        pointerEvents: 'none', // tooltip itself shouldn't steal hover/click
                    }}
                >
                    <div className="relative flex flex-col items-center" style={{ filter: 'drop-shadow(0 0 4px 0 rgba(8,22,36,0.10), 0 1px 2px 0 rgba(8, 22, 36, 0.10))' }}>
                        {/* Bubble shifts, arrow stays centered (anchor stays at Chip center) */}
                        <div
                            ref={bubbleRef}
                            className="rounded-full bg-dark-3 px-3 py-2 text-center text-xs text-white whitespace-pre"
                            style={{
                                transform: `translateX(${bubbleShiftX}px)`,
                            }}
                        >
                            {tooltip.text}
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="9" viewBox="0 0 24 9" fill="none">
                            <path d="M4.86969e-09 1.11683e-06H24C17.9998 -0.00366099 15 9 12 9C9 9 6 0 4.86969e-09 1.11683e-06Z" fill="#2F3944" />
                        </svg>
                    </div>
                </div>
            )}
        </>
    );
}