import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** Largura máxima e goteiras consistentes. Uma só definição de grelha. */
export function Container({
  as: Tag = 'div',
  className,
  children,
}: {
  readonly as?: ElementType;
  readonly className?: string;
  readonly children: ReactNode;
}) {
  return (
    <Tag className={cn('mx-auto w-full max-w-(--container-max) px-(--spacing-gutter)', className)}>
      {children}
    </Tag>
  );
}

/** Bloco de página com respiro vertical.
 *
 * Recebe `id` para as âncoras de navegação (§13 pede âncoras úteis para
 * serviços) e `aria-labelledby` para que cada secção seja uma landmark com
 * nome — sem isso, um leitor de ecrã anuncia só "region".
 */
export function Section({
  id,
  labelledBy,
  tabIndex,
  className,
  children,
}: {
  readonly id?: string;
  readonly labelledBy?: string;
  /** -1 torna a secção alvo programático de foco (usado por "saltar
   * introdução", que tem de mover o foco e não apenas a página). */
  readonly tabIndex?: number;
  readonly className?: string;
  readonly children: ReactNode;
}) {
  return (
    <section
      {...(id !== undefined ? { id } : {})}
      {...(labelledBy !== undefined ? { 'aria-labelledby': labelledBy } : {})}
      {...(tabIndex !== undefined ? { tabIndex } : {})}
      className={cn('py-(--spacing-section)', className)}
    >
      {children}
    </section>
  );
}

/** Rótulo curto em caixa alta.
 *
 * É decorativo-tipográfico, não um heading: usar `<h*>` aqui criaria saltos
 * artificiais na árvore de headings, que o §13 proíbe.
 */
export function Eyebrow({ children, className }: { readonly children: ReactNode; readonly className?: string }) {
  return (
    <p
      className={cn(
        'font-sans text-xs font-semibold uppercase tracking-(--tracking-label) text-text-muted',
        className,
      )}
    >
      {children}
    </p>
  );
}

type HeadingLevel = 1 | 2 | 3;

/** Heading com nível semântico separado do tamanho visual.
 *
 * Permite manter a hierarquia correta (h1 → h2 → h3, sem saltos) mesmo
 * quando o design pede um h2 pequeno ou um h3 grande.
 */
export function Heading({
  level,
  size,
  id,
  className,
  children,
}: {
  readonly level: HeadingLevel;
  readonly size?: 'xl' | '2xl' | '3xl' | '4xl';
  readonly id?: string;
  readonly className?: string;
  readonly children: ReactNode;
}) {
  const Tag = `h${level}` as ElementType;
  const sizes = {
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
  } as const;

  return (
    <Tag
      {...(id !== undefined ? { id } : {})}
      className={cn('font-display', sizes[size ?? '2xl'], className)}
    >
      {children}
    </Tag>
  );
}

/** Texto de corpo, limitado à largura de leitura confortável. */
export function Prose({ children, className }: { readonly children: ReactNode; readonly className?: string }) {
  return <p className={cn('max-w-(--measure) text-lg text-text-muted', className)}>{children}</p>;
}

/** Visível para leitores de ecrã, invisível no ecrã.
 *
 * Usa a técnica de clip em vez de `display:none` ou `visibility:hidden`, que
 * removeriam o conteúdo da árvore de acessibilidade.
 */
export function VisuallyHidden({
  as: Tag = 'span',
  children,
  ...rest
}: { readonly as?: ElementType; readonly children: ReactNode } & HTMLAttributes<HTMLElement>) {
  return (
    <Tag
      className="absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0"
      style={{ clip: 'rect(0 0 0 0)', clipPath: 'inset(50%)', margin: '-1px' }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
