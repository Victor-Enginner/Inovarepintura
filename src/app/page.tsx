import Image from 'next/image';
import { CinematicIntro } from '@/components/cinematic/CinematicIntro';
import { RealWorkGallery } from '@/components/gallery/RealWorkGallery';
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
  email,
  phone,
  processSteps,
  services,
  whatsapp,
} from '@/content/site';
import {
  galleryFilters,
  pairedImages,
  populatedCategories,
  publishableImages,
} from '@/content/gallery';

/* A ordem das secções segue o CLAUDE.md §5. CinematicIntro e PaintReveal
 * entram na Sprint 2 (ADR-006); RealWorkGallery e FeaturedBeforeAfter na
 * Sprint 4. As âncoras da navegação já resolvem para destinos reais. */

function PrimaryHero() {
  return (
    <Section id="hero" tabIndex={-1} className="pt-12 outline-none">
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
            {/* O CTA de orçamento aponta para o telefone: canal de resposta
             * mais direta. WhatsApp está na barra fixa do telemóvel e no CTA
             * final. */}
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

function RealWork() {
  /* Só mostramos filtros que devolvem alguma coisa. "Remodelação" é exigida
   * pela especificação mas não tem fotos reais (CLIENT-07): oferecê-la daria
   * ao visitante um beco sem saída. Volta sozinha quando houver fotos. */
  const filters = galleryFilters.filter(
    (f) => f.id === 'todos' || populatedCategories.has(f.id),
  );

  return (
    <Section id="trabalhos" labelledBy="trabalhos-titulo">
      <Container>
        <Eyebrow>Portefólio</Eyebrow>
        <Heading level={2} size="3xl" id="trabalhos-titulo" className="mt-4 text-navy-900">
          Trabalho real. Resultado visível.
        </Heading>
        <Prose className="mt-6">
          Exteriores, interiores e coberturas executados pela Inovare Pintura.
        </Prose>

        <div className="mt-12">
          <RealWorkGallery images={publishableImages} filters={filters} />
        </div>
      </Container>
    </Section>
  );
}

function FeaturedBeforeAfter() {
  /* CLIENT-05: o par ainda não foi confirmado como a mesma intervenção.
   * Apresentamos lado a lado com as legendas reais de cada fotografia,
   * sem slider e sem afirmar que são a mesma obra. Quando a confirmação
   * chegar, converte-se num comparador acessível. */
  const pair = pairedImages().get('moradia-ocre-01');
  if (!pair || pair.length !== 2) return null;

  const durante = pair.find((img) => img.stage === 'durante');
  const resultado = pair.find((img) => img.stage === 'resultado');
  if (!durante || !resultado) return null;

  return (
    <Section labelledBy="caso-real-titulo" className="bg-surface-200/40">
      <Container>
        <Eyebrow>Antes, durante e depois</Eyebrow>
        <Heading level={2} size="3xl" id="caso-real-titulo" className="mt-4 text-navy-900">
          Uma fachada renovada começa muito antes da última demão.
        </Heading>
        <Prose className="mt-6">
          Preparação da superfície, trabalho em altura e acabamento em ocre com
          molduras claras. Uma transformação construída por etapas e registada
          numa obra real.
        </Prose>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <figure>
            <div className="overflow-hidden rounded-lg">
              <Image
                src={`/gallery/${durante.src.replace('assets/gallery/', '').replace('.jpg', '')}-1200.webp`}
                alt={durante.alt}
                width={1152}
                height={1536}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="h-auto w-full object-cover"
              />
            </div>
            <figcaption className="mt-3">
              <span className="block text-sm font-semibold text-navy-900">{durante.title}</span>
              <span className="mt-1 block text-xs uppercase tracking-(--tracking-label) text-text-muted">
                Durante
              </span>
            </figcaption>
          </figure>

          <figure>
            <div className="overflow-hidden rounded-lg">
              <Image
                src={`/gallery/${resultado.src.replace('assets/gallery/', '').replace('.jpg', '')}-1200.webp`}
                alt={resultado.alt}
                width={1152}
                height={1536}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="h-auto w-full object-cover"
              />
            </div>
            <figcaption className="mt-3">
              <span className="block text-sm font-semibold text-navy-900">{resultado.title}</span>
              <span className="mt-1 block text-xs uppercase tracking-(--tracking-label) text-text-muted">
                Resultado
              </span>
            </figcaption>
          </figure>
        </div>
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
          <LinkButton href={whatsapp.href} variant="secondary" data-analytics={whatsapp.analyticsEvent}>
            WhatsApp
          </LinkButton>
          <LinkButton href={email.href} variant="secondary" data-analytics={email.analyticsEvent}>
            Enviar e-mail
          </LinkButton>
        </div>
      </Container>
    </Section>
  );
}

export default function HomePage() {
  return (
    <>
      <CinematicIntro />
      <PrimaryHero />
      <ProofStrip />
      <Services />
      <Process />
      <RealWork />
      <FeaturedBeforeAfter />
      <ServiceArea />
      <FinalCta />
    </>
  );
}
