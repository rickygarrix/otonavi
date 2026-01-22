import Image from "next/image"
import Link from "next/link"
import { Search } from "lucide-react"
import { staticMeta } from '@/lib/metadata'
import { zenMaru, zenKaku } from '@/lib/fonts'
import Header from "@/components/ui/Header"
import Footer from "@/components/ui/Footer"

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

          <h1 className={`mx-1 text-3xl text-light-1 font-light leading-[1.8] tracking-widest drop-shadow-lg ${zenMaru.className}`}>小さな非日常は、<br />いつもの帰り道に。</h1>
          <p className={`mx-1 text-md leading-[1.5] text-light-3 tracking-widest drop-shadow-lg ${zenMaru.className}`}>クラブもミュージックバーも<br />夜の音楽がもっと身近になるサイト</p>

          <span className="absolute bottom-14 left-1/2 text-light-3 -translate-x-1/2 text-center text-sm drop-shadow-lg after:left-1/2 after:bg-light-3 after:content-[''] after:absolute after:-bottom-4 after:block after:w-1 after:h-1 after:rounded-full after:animate-scroll-dot">
            オトナビを知る
          </span>
        </section>

        {/* Concept */}
        <section className="mx-auto max-w-md px-4 py-10 text-left flex flex-col gap-10">
          <div className="flex flex-col gap-8">
            <span className="text-xs leading-[1.5] tracking-widest">Concept</span>
            <h2 className="text-3xl font-bold leading-[1.5] tracking-widest">夜の音楽体験を<br />もっと身近に</h2>
          </div>

          <div className="py-2 flex flex-col gap-4">
            <div className="relative w-full aspect-[3/4]">
              <Image
                src="/concept1@2x.jpg"
                alt=""
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-full aspect-[3/4]">
              <Image
                src="/concept2@2x.jpg"
                alt=""
                fill
                className="object-cover"
              />
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

            <p className="leading-[2.0]">
              夜の音楽体験が、日常に変わる瞬間へ。
            </p>
          </div>

          <Link
            href="/"
            className={`from-dark-3 border-dark-4 to-dark-2 text-light-1 shadow-dark-3/50 flex h-12 items-center justify-center gap-2 rounded-lg border bg-linear-to-t text-sm shadow-xs transition active:scale-102 active:shadow-md`}
          >
            <Search className="h-4 w-4" strokeWidth={1.2} />
            店舗を探す
          </Link>
        </section>

        {/* How to use */}
        <section className="self-stretch bg-Brand-Light-1">
          <div className="mx-auto flex w-full max-w-[600px] flex-col items-center gap-10 bg-Brand-Light-2 px-4 py-10">
            <div className="flex w-full flex-col items-start gap-8">
              <div className="text-xs font-normal leading-4 tracking-wide text-Brand-Dark-5 font-['Tsukimi_Rounded']">
                How to use
              </div>

              <h2 className="text-2xl font-bold leading-9 tracking-widest text-Brand-Dark-5 font-['Zen_Kaku_Gothic_New']">
                はじめての使い方ガイド
              </h2>
            </div>

            <div className="flex w-full flex-col items-start gap-8">
              {/* 01 */}
              <div className="flex w-full items-start gap-4">
                <div className="flex w-8 flex-col items-center gap-2 rounded bg-Brand-Dark-2 py-4">
                  <div className="text-base font-semibold leading-6 text-Brand-Light-1 font-['Tsukimi_Rounded']">
                    01
                  </div>
                  <div className="text-center text-base font-bold leading-6 tracking-wider text-Brand-Light-1 font-['Zen_Kaku_Gothic_New']">
                    さ
                    <br />
                    が
                    <br />
                    す
                  </div>
                </div>

                <div className="flex flex-1 flex-col items-start gap-2">
                  <div className="text-base font-bold leading-8 text-Brand-Dark-5 font-['Zen_Kaku_Gothic_New']">
                    🔍 相性のいいお店を探そう
                  </div>
                  <p className="text-sm font-normal leading-6 text-Brand-Dark-5 font-['Zen_Kaku_Gothic_New']">
                    人それぞれ状況や好みが異なるように、お店も音楽ジャンルや店内の雰囲気はそれぞれです。
                    自分と相性のいいお店を見つけるために、エリアやジャンルで絞り込んで検索してみましょう。
                  </p>
                </div>
              </div>

              {/* 02 */}
              <div className="flex w-full items-start gap-4">
                <div className="flex w-8 flex-col items-center gap-2 rounded bg-Brand-Dark-2 py-4">
                  <div className="text-base font-semibold leading-6 text-Brand-Light-1 font-['Tsukimi_Rounded']">
                    02
                  </div>
                  <div className="text-center text-base font-bold leading-6 tracking-wider text-Brand-Light-1 font-['Zen_Kaku_Gothic_New']">
                    チ
                    <br />
                    ェ
                    <br />
                    ッ
                    <br />
                    ク
                  </div>
                </div>

                <div className="flex flex-1 flex-col items-start gap-2">
                  <div className="text-base font-bold leading-8 text-Brand-Dark-5 font-['Zen_Kaku_Gothic_New']">
                    🍸 お店の特徴をつかもう
                  </div>
                  <p className="text-sm font-normal leading-6 text-Brand-Dark-5 font-['Zen_Kaku_Gothic_New']">
                    気になるお店を見つけたら店舗ページをのぞいてみよう。
                    場所や営業時間はもちろん、音楽ジャンルやお店ならではの特徴がわかります。
                    写真や口コミから雰囲気を想像して、自分がそこで過ごす姿をイメージするとワクワクが広がります！
                  </p>
                </div>
              </div>

              {/* 03 */}
              <div className="flex w-full items-start gap-4">
                <div className="flex w-8 flex-col items-center gap-2 rounded bg-Brand-Dark-2 py-4">
                  <div className="text-base font-semibold leading-6 text-Brand-Light-1 font-['Tsukimi_Rounded']">
                    03
                  </div>
                  <div className="text-center text-base font-bold leading-6 tracking-wider text-Brand-Light-1 font-['Zen_Kaku_Gothic_New']">
                    来
                    <br />
                    店
                  </div>
                </div>

                <div className="flex flex-1 flex-col items-start gap-2">
                  <div className="text-base font-bold leading-8 text-Brand-Dark-5 font-['Zen_Kaku_Gothic_New']">
                    🔊 自分なりの楽しみ方を見つけよう
                  </div>
                  <p className="text-sm font-normal leading-6 text-Brand-Dark-5 font-['Zen_Kaku_Gothic_New']">
                    行ってみたいお店が決まったらいざ夜の街へ！
                    音楽に身をゆだねるもよし、バーカウンターでゆったり過ごすもよし。
                    友達と一緒でも、一人でふらっとでも、気軽に「自分なりの楽しみ方」を見つけてみてください。
                  </p>
                </div>
              </div>

              {/* 04 */}
              <div className="flex w-full items-start gap-4">
                <div className="flex w-8 flex-col items-center gap-2 rounded bg-Brand-Dark-2 py-4">
                  <div className="text-base font-semibold leading-6 text-Brand-Light-1 font-['Tsukimi_Rounded']">
                    04
                  </div>
                  <div className="text-center text-base font-bold leading-6 tracking-wider text-Brand-Light-1 font-['Zen_Kaku_Gothic_New']">
                    投
                    <br />
                    稿
                  </div>
                </div>

                <div className="flex flex-1 flex-col items-start gap-2">
                  <div className="text-base font-bold leading-8 text-Brand-Dark-5 font-['Zen_Kaku_Gothic_New']">
                    💬 体験をシェアして記録しよう
                  </div>
                  <p className="text-sm font-normal leading-6 text-Brand-Dark-5 font-['Zen_Kaku_Gothic_New']">
                    遊んだあとはその体験をシェアしよう。
                    お店の雰囲気や良かったポイントを投稿すると、これから行く人の参考になりますし、
                    自分自身の夜遊び記録にもなります。
                    小さなひとことでもOK。積み重ねていくことで、あなただけの音楽ライフログができあがっていきます。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* YouTube */}
        <section className="self-stretch bg-dark-5 px-6 py-20 text-light-3">
          <div className="mx-auto flex w-full max-w-[600px] flex-col items-center gap-6">
            <div className="self-stretch text-left text-xl font-normal leading-8 tracking-widest text-light-3 font-['Inter']">
              オトナビ公式YouTube
            </div>

            <p className="self-stretch text-left text-sm font-normal leading-6 text-light-3 font-['Zen_Kaku_Gothic_New']">
              開発の舞台裏をぜんぶ見せます。
              <br />
              アイデアが形になっていく過程や、サービス設計のリアルな悩みと工夫を共有しながら、
              一緒にプロダクトづくりの面白さを楽しみましょう！
            </p>

            <div className="mt-4 w-full">
              <div className="inline-flex h-52 w-full items-center justify-center gap-2.5 bg-light-5">
                <div className="flex-1 text-center text-sm font-normal leading-6 text-dark-5 font-['Zen_Kaku_Gothic_New']">
                  埋め込み
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div >
  )
}