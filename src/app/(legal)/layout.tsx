import type { ReactNode } from 'react';

import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />

      <main>
        <article className="text-dark-5 flex flex-col gap-4 px-6 py-10 text-sm [&_address]:leading-[1.8] [&_address]:not-italic [&_h1]:text-xl [&_h1]:leading-[1.5] [&_h1]:font-bold [&_h1]:tracking-widest [&_h2]:py-2 [&_h2]:text-lg [&_h2]:leading-[1.5] [&_h2]:font-bold [&_h2]:tracking-widest [&_li]:leading-[1.8] [&_ol]:flex [&_ol]:list-decimal [&_ol]:flex-col [&_ol]:gap-2 [&_ol]:py-2 [&_ol]:pl-5 [&_p]:py-2 [&_p]:leading-[1.8] [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:py-2 [&_ul]:pl-5">
          {children}
        </article>
      </main>

      <Footer />
    </>
  );
}
