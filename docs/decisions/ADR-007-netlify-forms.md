# ADR-007 — Formulário de orçamento via Netlify Forms

- Estado: **Aceite** (2026-10-01)
- Contexto: o cliente pediu um formulário "Solicitar Orçamento" visível,
  inspirado num site de referência. O §16 exige minimizar terceiros e o §14
  exige funcionalidade sem JavaScript.

## Decisão

Usar **Netlify Forms** (nativo do alojamento) em vez de serviço externo
(Formspree, Make, SDK próprio):

1. **Sem terceiro novo** — os dados vão do browser para a infraestrutura que
   já aloja o site; nada de scripts de tracking nem chaves de API no cliente.
2. **Compatível com Next.js 16 + OpenNext adapter v5** — Netlify não consegue
   detetar de forma fiável um form React/Next.js pré-renderizado. Um ficheiro
   estático `public/orcamento-enviado.html` declara o nome e os campos em
   `data-netlify`, e também é o `action` e destino do POST AJAX. Sem JavaScript,
   o browser envia o form HTML normal para esse ficheiro estático.
3. **Anti-spam incluído** — campo honeypot, sem CAPTCHA (fricção zero).
4. **Custo** — depende do plano da conta: em planos atuais baseados em
   créditos, as submissões de Forms são gratuitas e ilimitadas; em planos
   antigos (legacy), podem ser cobradas por níveis/volume. Confirmar o plano
   da equipa na Netlify antes de prometer custo zero ao cliente.

## Consequências

- Campos: Nome, Telefone, Tipo de trabalho (select dos 6 serviços reais +
  "Outro"), Mensagem opcional. Nada de morada/NIF nesta fase.
- Notificações por e-mail configuram-se no painel da Netlify
  (Forms → Notifications) — passo manual documentado no `DEPLOY.md`.
- Retenção, localização e acesso às submissões dependem das condições do
  plano/Netlify e das práticas do responsável; a política não inventa prazo
  fixo. O responsável deve rever as condições de tratamento aplicáveis.
- Deteção do formulário acontece no build: `public/orcamento-enviado.html`
  inclui `<form name="orcamento" data-netlify="true">`, o honeypot e todos os
  campos. JSX em `QuoteForm.tsx` deliberadamente NÃO inclui `data-netlify` nem
  `netlify-honeypot`: o OpenNext adapter v5 aborta o build se deteta esses
  atributos em JSX sem uma definição estática. O teste lê e verifica o HTML
  estático, os campos e a action.
- Em Next.js moderno, o destino do envio também tem de ser um ficheiro
  estático — não uma rota de página armazenada na cache do Next. AJAX e POST
  nativo usam `/orcamento-enviado.html`; a resposta inline é uma melhoria
  progressiva. `URLSearchParams` codifica pares form-urlencoded, nunca JSON.
- A página `/privacidade` passa a declarar estes dados (antes dizia que não
  havia formulários).
- Quando o analytics tiver ferramenta (§16), adicionar o evento
  `quote_submit` à lista fechada — por agora, sem evento novo.

## Alternativas rejeitadas

- **Formspree / Basin**: terceiro com tracking potencial, plano gratuito
  limitado e dependência externa para a conversão principal do negócio.
- **mailto: com corpo pré-preenchido**: depende do cliente de e-mail do
  visitante; em telemóvel falha silenciosamente. Mantém-se como fallback de
  erro, não como caminho principal.
- **WhatsApp como único canal**: já existe e continua; o formulário serve
  quem prefere escrever sem abrir outra app.
