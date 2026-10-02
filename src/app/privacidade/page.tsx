import type { Metadata } from 'next';
import {
  Container,
  Eyebrow,
  Heading,
  Prose,
  Section,
  VisuallyHidden,
} from '@/components/ui/primitives';
import { LinkButton } from '@/components/ui/Button';
import { contactChannels, postalAddress, site } from '@/content/site';

/* Política de privacidade em pt-PT (solicitada pelo cliente em 2026-09-30).
 *
 * Regra do §9: só afirmamos o que é verificável no código. Este site não tem
 * formulários, não instala cookies e não carrega scripts de terceiros — por
 * isso a política diz exatamente isso. Quando entrar analytics ou um
 * formulário, esta página tem de ser revista ANTES do lançamento. */

export const metadata: Metadata = {
  title: 'Política de Privacidade | Inovare Pintura',
  description:
    'Como a Inovare Pintura trata os dados de quem visita o site: sem cookies, apenas os dados do pedido de orçamento, e sem partilha com terceiros.',
  alternates: { canonical: '/privacidade' },
};

export default function PrivacyPage() {
  return (
    <Section labelledBy="privacidade-titulo" className="max-w-3xl">
      <Container>
        <Eyebrow>Informação legal</Eyebrow>
        <Heading level={1} size="3xl" id="privacidade-titulo" className="mt-4 text-navy-900">
          Política de privacidade
        </Heading>
        <Prose className="mt-4 text-text-muted">Última atualização: setembro de 2026.</Prose>

        <div className="mt-12 space-y-10">
          <section aria-labelledby="pp-responsavel">
            <Heading level={2} size="xl" id="pp-responsavel" className="text-navy-900">
              Responsável pelo tratamento
            </Heading>
            <Prose className="mt-4">
              {site.name} — {postalAddress.display}. Para qualquer questão relacionada
              com privacidade ou proteção de dados, contacte-nos pelos meios indicados
              no final desta página.
            </Prose>
          </section>

          <section aria-labelledby="pp-dados">
            <Heading level={2} size="xl" id="pp-dados" className="text-navy-900">
              Que dados recolhemos
            </Heading>
            <Prose className="mt-4">
              Navegar pelas páginas não deixa registos associados a si: não são
              instalados cookies e não são utilizadas ferramentas de medição de
              audiência.
            </Prose>
            <Prose className="mt-4">
              O único dado pessoal que nos chega através do site é o que escreve
              no formulário de pedido de orçamento: nome, telefone, tipo de
              trabalho e mensagem. Usamos esses dados apenas para responder ao
              seu pedido — por telefone ou pelo canal que indicar. O envio fica
              guardado no sistema de formulários do alojamento e na caixa de
              correio que recebe a notificação; apagamos quando o pedido estiver
              concluído ou quando pedir. Pode pedir acesso, retificação ou
              eliminação desses dados a qualquer momento pelos contactos acima.
            </Prose>
            <Prose className="mt-4">
              Como qualquer website, o alojamento pode registar dados técnicos
              necessários à entrega das páginas (como o endereço IP e o tipo de
              navegador), ao abrigo do legítimo interesse na operação do
              serviço. Estes registos servem segurança e funcionamento,
              não análise do comportamento individual.
            </Prose>
          </section>

          <section aria-labelledby="pp-contactos">
            <Heading level={2} size="xl" id="pp-contactos" className="text-navy-900">
              Contacto direto
            </Heading>
            <Prose className="mt-4">
              Os botões de telefone, WhatsApp, e-mail e Instagram abrem aplicações que
              estão sob o controlo dos respetivos fornecedores. Ao utilizar esses
              canais, o tratamento dos seus dados obedece às políticas desses
              serviços — não da Inovare Pintura. A mensagem que escreve é entre si e
              nós; o site em si não a intercepta nem a armazena.
            </Prose>
          </section>

          <section aria-labelledby="pp-terceiros">
            <Heading level={2} size="xl" id="pp-terceiros" className="text-navy-900">
              Serviços externos
            </Heading>
            <Prose className="mt-4">
              O site não carrega publicidade, não incorpora redes sociais e não
              partilha informação com empresas de marketing. As fotografias e os
              conteúdos são servidos diretamente pelo alojamento do site.
            </Prose>
          </section>

          <section aria-labelledby="pp-direitos">
            <Heading level={2} size="xl" id="pp-direitos" className="text-navy-900">
              Os seus direitos
            </Heading>
            <Prose className="mt-4">
              Ao abrigo do Regulamento Geral sobre a Proteção de Dados (RGPD), pode
              pedir informação sobre os seus dados pessoais, a sua retificação ou
              eliminação, e apresentar reclamação à Comissão Nacional de Proteção de
              Dados (CNPD). Se nos contactou por WhatsApp, e-mail ou Instagram e
              pretende que apaguemos essa conversa, basta pedir pelo mesmo canal.
            </Prose>
          </section>

          <section aria-labelledby="pp-alteracoes">
            <Heading level={2} size="xl" id="pp-alteracoes" className="text-navy-900">
              Alterações a esta política
            </Heading>
            <Prose className="mt-4">
              Se o site passar a incluir funcionalidades que envolvam dados pessoais
              — por exemplo, um formulário de pedido de orçamento ou estatísticas de
              visita — esta página será atualizada e datada antes de tal acontecer.
            </Prose>
          </section>

          <section aria-labelledby="pp-falar">
            <Heading level={2} size="xl" id="pp-falar" className="text-navy-900">
              Falar connosco
            </Heading>
            <ul className="mt-4 space-y-1">
              {contactChannels.map((channel) => {
                const isExternal = channel.href.startsWith('http');
                return (
                  <li key={channel.href}>
                    <a
                      href={channel.href}
                      data-analytics={channel.analyticsEvent}
                      {...(isExternal
                        ? { rel: 'noopener noreferrer', target: '_blank' }
                        : {})}
                      className="inline-flex min-h-11 items-center text-navy-900 underline underline-offset-4 hover:text-action"
                    >
                      {channel.label}
                      {isExternal && (
                        <VisuallyHidden>(abre em novo separador)</VisuallyHidden>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
            <div className="mt-8">
              <LinkButton href="/" variant="secondary">
                Voltar à página inicial
              </LinkButton>
            </div>
          </section>
        </div>
      </Container>
    </Section>
  );
}
