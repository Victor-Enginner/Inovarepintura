import type { SVGProps } from 'react';

/* Ícones de canal desenhados no projeto (traço 2px, cantos redondos).
 *
 * São formas geométricas simples — auscultador, envelope, balão de conversa,
 * moldura de foto, pino de mapa — não logótipos de marcas. Não há dependência
 * de biblioteca de ícones por cinco pictogramas. Sempre `aria-hidden`: o texto
 * do link descreve o destino; o ícone é decoração.
 */

function Base({ children, ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      width="1.25em"
      height="1.25em"
      {...rest}
    >
      {children}
    </svg>
  );
}

export function PhoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />
    </Base>
  );
}

export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.5L3 21l2-5.4A8.5 8.5 0 1 1 21 11.5Z" />
      <path d="M9 9.5c.5 2.5 2.5 4.5 5 5l1.5-1.5 2 1c-.5 1.5-1 2-2 1.5-3.5-1-6.5-4-7.5-7.5-.5-1 0-1.5 1.5-2l1 2L9 9.5Z" />
    </Base>
  );
}

export function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </Base>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </Base>
  );
}

export function PinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </Base>
  );
}
