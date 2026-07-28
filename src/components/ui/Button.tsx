import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost';

/* Altura mínima de 44px (min-h-11): alvo touch confortável exigido pelo
 * CLAUDE.md §14 e pela WCAG 2.2 SC 2.5.8. */
const base =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 ' +
  'font-sans text-base font-semibold no-underline ' +
  'transition-colors duration-(--duration-fast) ease-(--ease-out-soft) ' +
  'disabled:cursor-not-allowed disabled:opacity-55';

/* As cores vêm dos papéis semânticos dos tokens. `action` é teal-700, a
 * variante que passa AA com texto branco (5.02) — a teal-500 não passa. */
const variants: Record<Variant, string> = {
  primary: 'bg-action text-white hover:bg-navy-900',
  secondary: 'border-2 border-navy-900 bg-transparent text-navy-900 hover:bg-navy-900 hover:text-white',
  ghost: 'bg-transparent px-2 text-navy-900 underline underline-offset-4 hover:text-action',
};

interface CommonProps {
  readonly variant?: Variant;
  readonly children: ReactNode;
  readonly className?: string;
}

type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>;

export function Button({
  variant = 'primary',
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}

type LinkButtonProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'> & {
    readonly href: string;
  };

/** Botão que navega.
 *
 * Continua a ser um `<a>` — um link tem de ser um link para funcionar com
 * "abrir em novo separador", leitores de ecrã e sem JavaScript (§14).
 * `rel` é preenchido automaticamente em destinos externos (docs/05).
 */
export function LinkButton({
  variant = 'primary',
  className,
  children,
  href,
  target,
  rel,
  ...rest
}: LinkButtonProps) {
  const isExternal = /^https?:/.test(href);
  const safeRel = rel ?? (isExternal ? 'noopener noreferrer' : undefined);

  return (
    <a
      href={href}
      className={cn(base, variants[variant], className)}
      {...(target !== undefined ? { target } : {})}
      {...(safeRel !== undefined ? { rel: safeRel } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}
