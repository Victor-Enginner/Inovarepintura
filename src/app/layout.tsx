import type { Metadata } from 'next';
import { Fraunces, Manrope } from 'next/font/google';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { site } from '@/content/site';
import { StickyContact } from '@/components/layout/StickyContact';
import { AnalyticsListener } from '@/lib/analytics';
import { localBusinessJsonLd } from '@/lib/structured-data';
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
    url: '/',
    siteName: site.name,
    title: 'Inovare Pintura | Pintura e Remodelação em Olhão',
    description:
      'Pintura interior e exterior, reparações, pladur, canalização, ' +
      'remodelação e isolamento térmico em Olhão.',
    /* Fotografia real de um trabalho executado — é esta a imagem que
     * representa a empresa quando alguém partilha o link no WhatsApp, que é
     * o canal principal deste negócio. Sem ela aparece um retângulo cinzento. */
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Moradia com fachada clara após acabamento exterior, em Olhão.',
      },
    ],
  },
  twitter: { card: 'summary_large_image' },
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
        <StickyContact />
        <SiteFooter />
        <AnalyticsListener />
        <script
          type="application/ld+json"
          // Conteúdo próprio e estático, construído a partir de dados
          // confirmados — não há input de utilizador para sanitizar.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd(siteUrl)),
          }}
        />
      </body>
    </html>
  );
}
