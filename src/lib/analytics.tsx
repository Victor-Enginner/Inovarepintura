'use client';

import { useEffect } from 'react';

/** Camada de analytics sem provider.
 *
 * O cliente ainda não escolheu ferramenta nem dono da conta (CLIENT-10), por
 * isso não instalamos SDK nenhum: seria uma dependência de terceiro e um
 * problema de consentimento antes de haver decisão. Aqui fica só a recolha,
 * ligada por delegação de eventos — um listener para o documento inteiro, em
 * vez de um handler por botão.
 *
 * Quando houver ferramenta, troca-se o corpo de `send` e mais nada.
 *
 * Nunca envia PII: só o nome do evento. O telefone, o e-mail e o texto
 * pré-preenchido do WhatsApp ficam de fora de propósito.
 */
function send(event: string): void {
  if (process.env.NODE_ENV !== 'production') {
    console.info('[analytics]', event);
  }
}

export function AnalyticsListener() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const el = target?.closest<HTMLElement>('[data-analytics]');
      const event = el?.dataset['analytics'];
      if (event) send(event);
    };

    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return null;
}
