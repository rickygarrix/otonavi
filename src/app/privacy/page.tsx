'use client';

import Footer from '@/components/ui/Footer';
import HomeButton from '@/components/ui/HomeButton';

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* ===== 上部：ホームに戻る ===== */}
      <div className="px-6 pt-6">
        <HomeButton />
      </div>

      {/* ===== 本文 ===== */}
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-12 leading-relaxed text-gray-800">
          <h1 className="mb-8 text-3xl font-bold">プライバシーポリシー</h1>

          <p className="mb-6">
            オトナビ（以下、「当サービス」といいます。）は、ユーザーの個人情報を適切に取り扱うことを重要な責務と考え、
            以下の方針に基づき個人情報の保護に努めます。
          </p>

          <h2 className="mt-10 mb-4 text-xl font-semibold">1. 取得する情報</h2>
          <ul className="mb-6 list-disc space-y-2 pl-6">
            <li>メールアドレス</li>
            <li>プロフィール情報（ニックネーム・画像など）</li>
            <li>レビュー投稿・お気に入り情報</li>
            <li>アクセスログ（IP、ブラウザ情報等）</li>
          </ul>

          <h2 className="mt-10 mb-4 text-xl font-semibold">2. 利用目的</h2>
          <ul className="mb-6 list-disc space-y-2 pl-6">
            <li>サービス提供およびユーザー管理のため</li>
            <li>不正利用の防止・安全なサービス運営のため</li>
            <li>お問い合わせ対応のため</li>
            <li>サービス改善のための分析</li>
          </ul>

          <h2 className="mt-10 mb-4 text-xl font-semibold">3. 個人情報の第三者提供</h2>
          <p className="mb-6">
            法令に基づく場合を除き、ユーザーの同意なく個人情報を第三者へ提供することはありません。
          </p>

          <h2 className="mt-10 mb-4 text-xl font-semibold">4. Cookie（クッキー）について</h2>
          <p className="mb-6">
            当サービスでは、アクセス解析やログイン状態の維持のため Cookie を利用します。
            ブラウザ設定で Cookie を拒否できますが、一部機能が利用できない場合があります。
          </p>

          <h2 className="mt-10 mb-4 text-xl font-semibold">5. プライバシーポリシーの変更</h2>
          <p className="mb-6">
            本ポリシーは、必要に応じて内容を変更することがあります。
            変更後の内容は当ページに掲載した時点で効力を生じます。
          </p>

          <h2 className="mt-10 mb-4 text-xl font-semibold">6. お問い合わせ</h2>
          <p className="mb-6">個人情報に関するご質問は、お問い合わせフォームよりご連絡ください。</p>

          <p className="mt-12 text-sm text-gray-500">制定日：2025年1月1日</p>
        </div>
      </main>

      {/* ===== フッター ===== */}
      <Footer />
    </div>
  );
}
