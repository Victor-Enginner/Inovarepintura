import Image from 'next/image';
import { LinkButton } from '@/components/ui/Button';
import {
  Container,
  Eyebrow,
  Heading,
  Prose,
  Section,
} from '@/components/ui/primitives';
import {
  confirmedServiceArea,
  phone,
  processSteps,
  services,
} from '@/content/site';

/* A ordem das secções segue o CLAUDE.md §5. CinematicIntro e PaintReveal
 * entram na Sprint 2 (ADR-006); RealWorkGallery e FeaturedBeforeAfter na
 * Sprint 4. As âncoras da navegação já resolvem para destinos reais. */

function PrimaryHero() {
  return (
    <Section className="pt-12">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <Eyebrow>Pintura, reparação e remodelação em Olhão</Eyebrow>
          <Heading level={1} size="4xl" className="mt-4 text-navy-900">
            Transformamos espaços. Protegemos o que é seu.
          </Heading>
          <Prose className="mt-6">
            Pintura interior e exterior, reparações, pladur, canalização,
            remodelação e isolamento térmico — com preparação rigorosa, acabamento
            cuidado e acompanhamento próximo.
          </Prose>

          <div className="mt-8 flex flex-wrap gap-4">
            {/* O CTA de orçamento aponta para o telefone: é o único canal
             * confirmado (CLIENT-01/02 ainda abertos). */}
            <LinkButton href={phone.href} data-analytics="cta_quote_click">
              Pedir orçamento
            </LinkButton>
            <LinkButton href="#trabalhos" variant="secondary">
              Ver trabalhos
            </LinkButton>
          </div>

          {/* Microprova da copy aprovada — factual, sem números inventados. */}
          <p className="mt-8 text-sm text-text-muted">
            Trabalho real · Contacto direto · Soluções para interior e exterior
          </p>
        </div>

        {/* Imagem gerada, usada como fundo editorial (§11). Não é
         * apresentada como obra executada e nunca entra em "Trabalhos". */}
        <Image
          src="/cutscene/poster/resultado-1280.webp"
          alt="Fachada de moradia com acabamento em ocre e molduras claras, sob luz mediterrânica."
          width={1280}
          height={720}
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="rounded-lg shadow-md"
        />
      </Container>
    </Section>
  );
}

function ProofStrip() {
  /* docs/03: provas factuais, sem números não confirmados. */
  const proofs = [
    'Fotografias de trabalhos reais',
    'Interiores e exteriores',
    'Contacto direto com quem executa',
    `Atuação em ${confirmedServiceArea.join(', ')}`,
  ];

  return (
    <div className="border-y border-border bg-surface-200/40">
      <Container>
        <ul className="grid gap-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {proofs.map((proof) => (
            <li key={proof} className="text-sm font-medium text-navy-900">
              {proof}
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}

function Services() {
  return (
    <Section id="servicos" labelledBy="servicos-titulo">
      <Container>
        <Heading level={2} size="3xl" id="servicos-titulo" className="text-navy-900">
          Antes da cor, vem o cuidado.
        </Heading>
        <Prose className="mt-6">
          Um bom resultado começa na avaliação da superfície, na proteção do espaço
          e na preparação certa. Tratamos cada etapa para que o acabamento seja
          bonito, uniforme e duradouro.
        </Prose>

        <ul className="mt-12 grid gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <li key={service.id} id={`servico-${service.id}`}>
              <Heading level={3} size="xl" className="text-navy-900">
                {service.name}
              </Heading>
              <p className="mt-3 text-text-muted">{service.description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

function Process() {
  return (
    <Section id="processo" labelledBy="processo-titulo" className="bg-surface-200/40">
      <Container>
        <Heading level={2} size="3xl" id="processo-titulo" className="text-navy-900">
          Cada superfície pede um processo.
        </Heading>

        {/* Lista ordenada: a sequência é a informação. Compreensível sem
         * ícones nem animação (critério de aceite S3-T02). */}
        <ol className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {processSteps.map((step, index) => (
            <li key={step.title}>
              <span
                aria-hidden="true"
                className="font-display text-3xl text-copper-700"
              >
                {index + 1}
              </span>
              <Heading level={3} size="xl" className="mt-2 text-navy-900">
                {step.title}
              </Heading>
              <p className="mt-2 text-sm text-text-muted">{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

function GalleryPlaceholder() {
  /* Âncora real para a navegação. A galeria com filtros e lightbox é a
   * Sprint 4 (ADR-003); o conteúdo abaixo não afirma nada que não seja certo. */
  return (
    <Section id="trabalhos" labelledBy="trabalhos-titulo">
      <Container>
        <Eyebrow>Portefólio</Eyebrow>
        <Heading level={2} size="3xl" id="trabalhos-titulo" className="mt-4 text-navy-900">
          Trabalho real. Resultado visível.
        </Heading>
        <Prose className="mt-6">
          Exteriores, interiores, coberturas e remodelações executados pela Inovare
          Pintura.
        </Prose>
      </Container>
    </Section>
  );
}

function ServiceArea() {
  return (
    <Section labelledBy="area-titulo" className="bg-surface-200/40">
      <Container>
        <Heading level={2} size="2xl" id="area-titulo" className="text-navy-900">
          Onde trabalhamos
        </Heading>
        {/* Só localidades confirmadas (§9, CLIENT-06). */}
        <Prose className="mt-4">
          Com base em {confirmedServiceArea.join(', ')}, no Algarve. Fale connosco
          para confirmarmos a deslocação ao seu local.
        </Prose>
      </Container>
    </Section>
  );
}

function FinalCta() {
  return (
    <Section labelledBy="cta-titulo">
      <Container>
        <Heading level={2} size="3xl" id="cta-titulo" className="text-navy-900">
          A sua casa merece um acabamento à altura.
        </Heading>
        <Prose className="mt-6">
          Fale diretamente com a Inovare Pintura, explique o trabalho e combine a
          melhor forma de o avaliarmos.
        </Prose>
        <div className="mt-8 flex flex-wrap gap-4">
          <LinkButton href={phone.href} data-analytics="cta_quote_click">
            Pedir orçamento
          </LinkButton>
          <LinkButton href={phone.href} variant="secondary" data-analytics={phone.analyticsEvent}>
            Ligar: {phone.label}
          </LinkButton>
        </div>
      </Container>
    </Section>
  );
}

export default function HomePage() {
  return (
    <>
      <PrimaryHero />
      <ProofStrip />
      <Services />
      <Process />
      <GalleryPlaceholder />
      <ServiceArea />
      <FinalCta />
    </>
  );
}
