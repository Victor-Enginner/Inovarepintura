import { phone } from '@/content/site';

/** Barra de contacto fixa no telemóvel.
 *
 * A maior parte do tráfego de uma empresa de pinturas chega por telemóvel, e
 * o visitante decide contactar a meio da galeria — não no fim da página. Sem
 * isto, quem se convence ao ver as fotos tem de rolar até ao rodapé.
 *
 * Só telefone: é o único canal confirmado. O WhatsApp entra aqui assim que o
 * cliente validar que o número o recebe (CLIENT-02).
 *
 * Escondida em ecrãs largos, onde o cabeçalho já está sempre à vista.
 */
export function StickyContact() {
  return (
    <div className="sticky bottom-0 z-(--z-sticky) border-t border-border bg-mineral-50/95 p-3 backdrop-blur lg:hidden">
      <a
        href={phone.href}
        data-analytics="cta_quote_click"
        className="flex min-h-12 items-center justify-center rounded-md bg-action px-5 text-base font-semibold text-white no-underline"
      >
        Pedir orçamento · {phone.label}
      </a>
    </div>
  );
}
