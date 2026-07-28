/** Junta classes condicionais.
 *
 * Local de propósito: o CLAUDE.md §4 pede para não instalar uma biblioteca
 * onde uma função de cinco linhas resolve. Não faz merge de conflitos do
 * Tailwind — os componentes deste projeto não sobrepõem utilitários.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
