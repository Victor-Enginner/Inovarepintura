import type { Metadata } from 'next';
import { Fraunces, Manrope } from 'next/font/google';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { site } from '@/content/site';
import './globals.css';

/* Duas famílias, o máximo do §7. `next/font` descarrega-as no build e
 * auto-hospeda — não há pedido a servidores de terceiros em runtime, o que
 * satisfaz o requisito de privacidade sem depender de consentimento. */
const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  axes: ['SOFT', 'WONK'],
});

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
});

/* CLIENT-08: o domínio final ainda não foi confirmado. Fica em variável de
 * ambiente para que canonical e Open Graph fiquem corretos no deploy sem
 * mais alterações de código. O canonical definitivo é bloqueio da Sprint 6. */
const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://inovarepintura.pt';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Inovare Pintura | Pintura e Remodelação em Olhão',
  description:
    'Pintura interior e exterior, reparações, pladur, canalização, remodelação ' +
    'e isolamento térmico em Olhão. Veja trabalhos reais e peça o seu orçamento.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'pt_PT',
    siteName: site.name,
    title: 'Inovare Pintura | Pintura e Remodelação em Olhão',
    description:
      'Pintura interior e exterior, reparações, pladur, canalização, ' +
      'remodelação e isolamento térmico em Olhão.',
  },
};

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="pt-PT" className={`${fraunces.variable} ${manrope.variable}`}>
      <body>
        {/* Primeiro elemento focável da página (§14). */}
        <a className="skip-link" href="#conteudo">
          Saltar para o conteúdo
        </a>
        <SiteHeader />
        <main id="conteudo">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
