import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { staticMeta } from '@/lib/metadata';
import { zenMaru, zenKaku } from '@/lib/fonts';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { LinkButton } from '@/components/ui/button';

export const metadata: Metadata = staticMeta({
  title: 'オトナビとは？',
  path: '/about',
});

export default function AboutPage() {
  return (
    <div className="bg-light-1 text-dark-5 -mt-20">
      <Header />

      <main className={zenKaku.className}>
        {/* Hero */}
        <section className="relative flex h-146 flex-col items-start gap-6 overflow-hidden bg-[url('/background-sp@2x.png')] bg-cover bg-center px-8 pt-36">
          <Image
            src="/logo-white.svg"
            alt="オトナビ"
            width={106}
            height={32}
            className="drop-shadow-lg"
          />

          <h1
            className={`text-light-1 mx-1 text-3xl leading-[1.8] font-light tracking-widest drop-shadow-lg ${zenMaru.className}`}
          >
            小さな非日常は、
            <br />
            いつもの帰り道に。
          </h1>
          <p
            className={`text-md text-light-3 mx-1 leading-[1.5] tracking-widest drop-shadow-lg ${zenMaru.className}`}
          >
            クラブもミュージックバーも
            <br />
            夜の音楽がもっと身近になるサイト
          </p>

          <span className="text-light-3 after:bg-light-3 after:animate-scroll-dot absolute bottom-14 left-1/2 -translate-x-1/2 text-center text-sm drop-shadow-lg after:absolute after:-bottom-4 after:left-1/2 after:block after:h-1 after:w-1 after:rounded-full after:content-['']">
            オトナビを知る
          </span>
        </section>

        {/* Concept */}
        <section className="mx-auto flex max-w-md flex-col gap-10 px-4 py-10 text-left">
          <div className="flex flex-col gap-8">
            <span className="text-xs leading-[1.5] tracking-widest">Concept</span>
            <h2 className="text-3xl leading-[1.5] font-bold tracking-widest">
              夜の音楽体験を
              <br />
              もっと身近に
            </h2>
          </div>

          <div className="flex flex-col gap-4 py-2">
            <div className="relative aspect-[3/4] w-full">
              <Image src="/concept1@2x.jpg" alt="" fill className="object-cover" />
            </div>
            <div className="relative aspect-[3/4] w-full">
              <Image src="/concept2@2x.jpg" alt="" fill className="object-cover" />
            </div>
          </div>

          <div className="flex flex-col gap-8 px-2">
            <p className="leading-[2.0]">
              「クラブってなんか怖い」
              <br />
              「バーって敷居が高そう」
            </p>

            <p className="leading-[2.0]">
              だけど本当はちょっとだけ憧れてる。
              <br />
              そんなあなたが初めて踏み出す一歩を
              <br />
              オトナビがそっとナビゲートします。
            </p>

            <p className="leading-[2.0]">夜の音楽体験が、日常に変わる瞬間へ。</p>
          </div>

          <LinkButton href="/" priority="secondary" label="音箱を探す" leftIcon={Search} />
        </section>

        {/* How to use */}
        <div className="justify-bottom relative h-22" aria-hidden="true">
          <svg
            className="absolute -bottom-px left-0 w-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 390 40"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M195 0C263.263 0 328.862 11.401 390 32.4004V40H0V32.4004C61.1378 11.4009 126.737 0 195 0Z"
              fill="#E8ECF1"
            />
          </svg>
        </div>

        <section className="bg-light-2 flex flex-col gap-10 px-4 py-10 text-left">
          <div className="flex flex-col gap-8">
            <span className="text-xs leading-[1.5] tracking-widest">How to use</span>
            <h2 className="text-2xl leading-[1.5] font-bold tracking-widest">
              はじめての使い方ガイド
            </h2>
          </div>

          <ol className="flex flex-col gap-8">
            {/* 01 */}
            <li className="flex items-start gap-4">
              <div className="bg-dark-2 text-light-1 flex w-8 flex-col items-center gap-2 rounded py-4">
                <div className="font-semibold">01</div>
                <div className="font-bold tracking-[.5em] [writing-mode:vertical-rl]">さがす</div>
              </div>

              <div className="flex flex-1 flex-col gap-2 py-1">
                <div className="font-bold">🔍 相性のいいお店を探そう</div>
                <p className="text-justify text-sm leading-[1.8]">
                  人それぞれ状況や好みが異なるように、お店も音楽ジャンルや店内の雰囲気はそれぞれです。自分と相性のいいお店を見つけるために、エリアやこだわり条件で絞り込んで検索してみましょう。
                </p>
              </div>
            </li>

            {/* 02 */}
            <li className="flex items-start gap-4">
              <div className="bg-dark-2 text-light-1 flex w-8 flex-col items-center gap-2 rounded py-4">
                <div className="font-semibold">02</div>
                <div className="font-bold tracking-[.5em] [writing-mode:vertical-rl]">チェック</div>
              </div>

              <div className="flex flex-1 flex-col gap-2 py-1">
                <div className="font-bold">🍸 お店の特徴をつかもう</div>
                <p className="text-justify text-sm leading-[1.8]">
                  気になるお店を見つけたら店舗ページをのぞいてみよう。場所や営業時間はもちろん、お店ならではの特徴やイベントの傾向などがわかります。公式SNSから雰囲気をチェックして、自分がそこで過ごす姿をイメージするとワクワクが広がります！
                </p>
              </div>
            </li>

            {/* 03 */}
            <li className="flex items-start gap-4">
              <div className="bg-dark-2 text-light-1 flex w-8 flex-col items-center gap-2 rounded py-4">
                <div className="font-semibold">03</div>
                <div className="font-bold tracking-[.5em] [writing-mode:vertical-rl]">来店</div>
              </div>

              <div className="flex flex-1 flex-col gap-2 py-1">
                <div className="font-bold">🔊 自分なりの楽しみ方を見つけよう</div>
                <p className="text-justify text-sm leading-[1.8]">
                  行ってみたいお店が決まったらいざ夜の街へ！音楽に身をゆだねるもよし、バーカウンターでゆったり過ごすもよし。友達と一緒でも、一人でふらっとでも、気軽に自分なりの楽しみ方を見つけてみてください。
                </p>
              </div>
            </li>
          </ol>
        </section>

        <div className="bg-dark-5 justify-bottom relative h-22 scale-y-[-1]" aria-hidden="true">
          <svg
            className="absolute -bottom-px left-0 w-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 390 40"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M195 0C263.263 0 328.862 11.401 390 32.4004V40H0V32.4004C61.1378 11.4009 126.737 0 195 0Z"
              fill="#E8ECF1"
            />
          </svg>
        </div>
      </main>

      <Footer />
    </div>
  );
}
