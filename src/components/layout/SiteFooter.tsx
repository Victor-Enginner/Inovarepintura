import { Container, Heading, VisuallyHidden } from '@/components/ui/primitives';
import {
  contactChannels,
  postalAddress,
  services,
  site,
  confirmedServiceArea,
} from '@/content/site';
import type { ContactChannel } from '@/content/types';

/** Um canal no footer.
 *
 * Todos os canais estão confirmados desde 2026-07-28 (CLIENT-01/02/03
 * resolvidos). O mecanismo de marcação "por confirmar" mantém-se: se um dado
 * novo voltar a `needsConfirmation: true`, o marcador aparece em desenvolvimento
 * para ninguém o ler como facto validado durante a revisão.
 */
function ChannelLink({ channel }: { readonly channel: ContactChannel }) {
  const isExternal = channel.href.startsWith('http');
  const showFlag = channel.needsConfirmation && process.env.NODE_ENV !== 'production';

  return (
    <li>
      <a
        href={channel.href}
        data-analytics={channel.analyticsEvent}
        {...(isExternal ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
        className="inline-flex min-h-11 items-center text-mineral-50 underline underline-offset-4 hover:text-teal-500"
      >
        {channel.label}
        {isExternal && <VisuallyHidden>(abre em novo separador)</VisuallyHidden>}
      </a>
      {showFlag && (
        <span
          className="ms-2 rounded-sm bg-copper-700 px-2 py-0.5 text-xs text-white"
          title="Dado por validar pelo cliente — ver docs/decisions/CLIENT-ISSUES.md"
        >
          por confirmar
        </span>
      )}
    </li>
  );
}

export function SiteFooter() {
  return (
    <footer id="contactos" className="on-dark bg-navy-900 py-(--spacing-section) text-mineral-50">
      <Container>
        <VisuallyHidden as="h2">Contactos e informação da empresa</VisuallyHidden>

        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <Heading level={3} size="xl" className="text-mineral-50">
              {site.name}
            </Heading>
            {/* NAP — tem de ser idêntico ao Google Business Profile (§13). */}
            <address className="mt-4 not-italic text-mineral-50/80">
              {postalAddress.streetAddress}
              <br />
              {postalAddress.postalCode} {postalAddress.addressLocality}
              <br />
              {postalAddress.addressRegion}, Portugal
            </address>
          </div>

          <div>
            <h3 className="font-sans text-xs font-semibold uppercase tracking-(--tracking-label) text-mineral-50/70">
              Serviços
            </h3>
            <ul className="mt-4 space-y-1 text-mineral-50/80">
              {services.map((service) => (
                <li key={service.id}>{service.name}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-xs font-semibold uppercase tracking-(--tracking-label) text-mineral-50/70">
              Contacto
            </h3>
            <ul className="mt-4 space-y-1">
              {contactChannels.map((channel) => (
                <ChannelLink key={channel.href} channel={channel} />
              ))}
            </ul>
            {/* Só localidades confirmadas — o §9 proíbe anunciar cobertura
             * não validada (CLIENT-06). */}
            <p className="mt-4 text-sm text-mineral-50/70">
              Área de atuação: {confirmedServiceArea.join(', ')}
            </p>
          </div>
        </div>

        <p className="mt-12 border-t border-mineral-50/20 pt-6 text-sm text-mineral-50/60">
          © {new Date().getFullYear()} {site.name}
        </p>
      </Container>
    </footer>
  );
}
