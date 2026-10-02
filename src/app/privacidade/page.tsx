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

/* Política de privacidade em pt-PT (revista para o formulário em 2026-10-01).
 *
 * Regra do §9: só afirmamos o que é verificável no código. Descreve os dados
 * do formulário Netlify e os canais externos sem prometer prazos de retenção
 * que o responsável ainda não definiu. A copy não substitui revisão jurídica. */

export const metadata: Metadata = {
  title: 'Política de Privacidade | Inovare Pintura',
  description:
    'Como a Inovare Pintura trata os dados do pedido de orçamento, incluindo o processamento do formulário pela Netlify.',
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
        <Prose className="mt-4 text-text-muted">Última atualização: outubro de 2026.</Prose>

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
              Não usamos cookies de análise nem ferramentas de medição de
              audiência. O serviço de alojamento pode processar registos técnicos
              de acesso necessários à entrega e segurança do site, conforme
              descrito abaixo.
            </Prose>
            <Prose className="mt-4">
              Se preencher o formulário de pedido de orçamento, recebemos o
              nome, o telefone, o tipo de trabalho e, se a escrever, a mensagem.
              Usamos estes dados para analisar e responder ao pedido que nos
              enviou. A submissão é processada e armazenada pela Netlify, que
              presta o serviço de alojamento e gestão do formulário; se forem
              ativadas notificações, uma cópia poderá também ficar na caixa de
              correio de destino. O responsável deve limitar o acesso e conservar
              os dados apenas pelo período necessário à gestão do pedido e às
              obrigações legais aplicáveis. Pode pedir acesso, retificação ou
              eliminação através dos contactos indicados nesta página.
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
              O site não carrega publicidade nem ferramentas de marketing. O
              formulário é processado pela Netlify, fornecedor de alojamento e
              gestão de formulários, de acordo com os respetivos termos e política
              de privacidade. Os links de telefone, WhatsApp, e-mail e Instagram
              abrem serviços externos apenas quando os escolhe.
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
              Esta política será revista se mudarem os dados recolhidos, os
              fornecedores ou as finalidades do tratamento. A data de atualização
              no início da página será alterada nessa altura.
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
