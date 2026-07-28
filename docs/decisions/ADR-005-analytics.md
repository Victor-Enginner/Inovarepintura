# ADR-005 — Analytics e eventos

## Estado

Proposto

## Contexto

`CLAUDE.md` §16 define uma lista fixa de eventos mínimos e proíbe enviar
PII (telefone, e-mail, mensagem). Ainda não há ferramenta de analytics nem
conta/proprietário definidos pelo cliente (ver `docs/13`, secção Analytics).

## Critérios

- privacidade/consentimento;
- desempenho (third party carregado após idle/consentimento, §15);
- manutenção;
- custo.

## Opções

### Opção A — Camada de abstração própria (`lib/analytics.ts`) + provider a definir

Define os 9 eventos mínimos (`cta_quote_click`, `phone_click`,
`whatsapp_click`, `email_click`, `instagram_click`, `gallery_open`,
`before_after_interaction`, `intro_skip`, `intro_complete`) contra uma
interface própria, independente do provider. O provider real (GA4, Plausible,
etc.) só é ligado quando o cliente confirmar ferramenta/conta/consentimento.

### Opção B — Instalar já um SDK de terceiro (ex. GA4) por defeito

Antecipa a decisão do cliente e cria dependência/consentimento antes de haver
conta ou aprovação — conflita com o stop condition do `CLAUDE.md` §19
("a solução exigir... conta externa não disponibilizada").

## Decisão

Opção A. Implementar a interface e os 9 eventos com um provider "no-op"/log
local até o cliente confirmar a ferramenta (ver `docs/13-OPEN-QUESTIONS`,
secção Analytics, ainda sem resposta). Nenhum evento envia PII.

## Consequências

- positivas: desenvolvimento não bloqueia por falta de conta; troca de
  provider não exige tocar nos componentes que disparam eventos;
- negativas: sem dados reais de analytics até a decisão do cliente;
- mitigação: `PROJECT_STATUS.md` mantém isto como bloqueio explícito;
- fallback: log local em desenvolvimento.

## Evidência

`CLAUDE.md` §16, §19; `docs/13-OPEN-QUESTIONS-CLIENT-VALIDATION.md` (secção
Analytics, todos os itens por confirmar).
