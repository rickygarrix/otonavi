"use client"

import Footer from "@/components/ui/Footer"
import HomeButton from "@/components/ui/HomeButton"

export default function TokushoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ===== 上部：ホームに戻る ===== */}
      <div className="px-6 pt-6">
        <HomeButton />
      </div>

      {/* ===== 本文 ===== */}
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-12 text-slate-800">
          <h1 className="text-2xl font-bold mb-6">
            特定商取引法に基づく表記
          </h1>

          <div className="space-y-6 leading-relaxed text-[15px]">
            <section>
              <h2 className="font-semibold mb-2">事業者名</h2>
              <p>Otonavi（オトナビ）</p>
            </section>

            <section>
              <h2 className="font-semibold mb-2">運営責任者</h2>
              <p>西本 浩章</p>
            </section>

            <section>
              <h2 className="font-semibold mb-2">所在地</h2>
              <p>
                （サービス開始前につき省略／
                サブスクリプション開始後に正式掲載）
              </p>
            </section>

            <section>
              <h2 className="font-semibold mb-2">お問い合わせ先</h2>
              <p>Email：support@otonavi.jp</p>
              <p>お問い合わせフォーム：準備中</p>
            </section>

            <section>
              <h2 className="font-semibold mb-2">販売価格</h2>
              <p>
                各サービスページに記載します。
                サブスクリプション（月額課金）を提供する場合、
                適宜その料金を表示します。
              </p>
            </section>

            <section>
              <h2 className="font-semibold mb-2">
                商品代金以外の必要料金
              </h2>
              <p>
                インターネット接続にかかる通信料は
                利用者負担となります。
              </p>
            </section>

            <section>
              <h2 className="font-semibold mb-2">お支払い方法</h2>
              <p>クレジットカード決済（Stripe）</p>
            </section>

            <section>
              <h2 className="font-semibold mb-2">
                返品・キャンセル
              </h2>
              <p>
                デジタルコンテンツの特性上、
                購入後の返金には応じられません。
                サブスクリプションを解約した場合でも、
                支払い済みの料金は返金できません。
              </p>
            </section>

            <section>
              <h2 className="font-semibold mb-2">提供時期</h2>
              <p>決済完了後ただちにサービスを利用できます。</p>
            </section>

            <section>
              <h2 className="font-semibold mb-2">動作環境</h2>
              <p>
                スマートフォン / PC のブラウザ
                （Chrome / Safari / Edge）
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* ===== フッター ===== */}
      <Footer />
    </div>
  )
}