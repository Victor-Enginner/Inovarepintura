import { LinkButton } from '@/components/ui/Button';
import { Container } from '@/components/ui/primitives';
import { phone, site } from '@/content/site';

/* docs/03: Serviços, Trabalhos, Processo, Contactos + CTA. */
const navItems = [
  { href: '#servicos', label: 'Serviços' },
  { href: '#trabalhos', label: 'Trabalhos' },
  { href: '#processo', label: 'Processo' },
  { href: '#contactos', label: 'Contactos' },
] as const;

/** Cabeçalho do site.
 *
 * Sem menu hamburger: a navegação são quatro âncoras que cabem em duas
 * linhas no mobile. Um hamburger exigiria um componente client e estado só
 * para esconder quatro links — e deixaria a navegação dependente de
 * JavaScript, o que o §5 desaconselha. O CTA nunca sai do ecrã.
 */
export function SiteHeader() {
  return (
    <header className="border-b border-border bg-bg">
      <Container className="flex flex-wrap items-center gap-x-8 gap-y-3 py-4">
        <a
          href="#conteudo"
          className="font-display text-xl font-semibold text-navy-900 no-underline"
        >
          {site.name}
        </a>

        <nav aria-label="Navegação principal" className="order-3 w-full sm:order-none sm:w-auto">
          <ul className="flex flex-wrap gap-x-6 gap-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="inline-flex min-h-11 items-center text-base text-navy-900 no-underline hover:text-action hover:underline underline-offset-4"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Telefone é o único canal confirmado sem reservas — por isso é ele
         * que ocupa o CTA do cabeçalho, e não o WhatsApp (CLIENT-02). */}
        <LinkButton href={phone.href} className="ms-auto" data-analytics={phone.analyticsEvent}>
          Ligar
          <span className="hidden sm:inline">: {phone.label}</span>
        </LinkButton>
      </Container>
    </header>
  );
}
