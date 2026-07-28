import { phone, whatsapp } from '@/content/site';
import { VisuallyHidden } from '@/components/ui/primitives';

/** Barra de contacto fixa no telemóvel.
 *
 * A maior parte do tráfego de uma empresa de pinturas chega por telemóvel, e
 * o visitante decide contactar a meio da galeria — não no fim da página. Sem
 * isto, quem se convence ao ver as fotos tem de rolar até ao rodapé.
 *
 * Telefone e WhatsApp, os dois canais de resposta mais rápida, confirmados
 * pelo cliente (CLIENT-01/02 resolvidos em 2026-07-28).
 *
 * Escondida em ecrãs largos, onde o cabeçalho já está sempre à vista.
 */
export function StickyContact() {
  return (
    <div className="sticky bottom-0 z-(--z-sticky) flex gap-2 border-t border-border bg-mineral-50/95 p-3 backdrop-blur lg:hidden">
      <a
        href={phone.href}
        data-analytics={phone.analyticsEvent}
        className="flex min-h-12 flex-1 items-center justify-center rounded-md bg-action px-4 text-base font-semibold text-white no-underline"
      >
        Ligar
      </a>
      <a
        href={whatsapp.href}
        data-analytics={whatsapp.analyticsEvent}
        rel="noopener noreferrer"
        target="_blank"
        className="flex min-h-12 flex-1 items-center justify-center rounded-md bg-navy-900 px-4 text-base font-semibold text-white no-underline"
      >
        WhatsApp
        <VisuallyHidden>(abre em novo separador)</VisuallyHidden>
      </a>
    </div>
  );
}
