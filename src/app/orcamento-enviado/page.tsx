import type { Metadata } from 'next';
import { Container, Eyebrow, Heading, Prose } from '@/components/ui/primitives';
import { LinkButton } from '@/components/ui/Button';
import { phone, whatsapp } from '@/content/site';

/* Confirmação de pedido de orçamento.
 *
 * É para onde um POST nativo (sem JavaScript) cai via `action` do formulário
 * (ADR-007). Com JavaScript o utilizador vê a confirmação inline e nunca
 * chega aqui — por isso a página repete a mesma mensagem.
 *
 * Não é conteúdo indexável: noindex, e fica de fora do sitemap. */

export const metadata: Metadata = {
  title: 'Pedido enviado | Inovare Pintura',
  description: 'O seu pedido de orçamento foi recebido pela Inovare Pintura.',
  alternates: { canonical: '/orcamento-enviado' },
  robots: { index: false, follow: true },
};

export default function QuoteSentPage() {
  return (
    <Container className="flex min-h-[60vh] max-w-2xl flex-col items-center justify-center py-16 text-center">
      <Eyebrow>Pedido de orçamento</Eyebrow>
      <Heading level={1} size="3xl" className="mt-4 text-navy-900">
        Pedido recebido.
      </Heading>
      <Prose className="mt-4">
        Obrigado pelo contacto. Vamos ligar-lhe de volta assim que possível.
        Se for urgente, fale connosco já por telefone ou WhatsApp.
      </Prose>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <LinkButton href={phone.href} variant="primary">
          Ligar: {phone.label}
        </LinkButton>
        <LinkButton href={whatsapp.href} variant="secondary">
          WhatsApp
        </LinkButton>
        <LinkButton href="/" variant="ghost">
          Voltar à página inicial
        </LinkButton>
      </div>
    </Container>
  );
}
