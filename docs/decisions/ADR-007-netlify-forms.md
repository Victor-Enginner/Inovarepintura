# ADR-007 — Formulário de orçamento via Netlify Forms

- Estado: **Aceite** (2026-10-02)
- Contexto: o cliente pediu um formulário "Solicitar Orçamento" visível,
  inspirado num site de referência. O §16 exige minimizar terceiros e o §14
  exige funcionalidade sem JavaScript.

## Decisão

Usar **Netlify Forms** (nativo do alojamento) em vez de serviço externo
(Formspree, Make, SDK próprio):

1. **Sem terceiro novo** — os dados vão do browser para a infraestrutura que
   já aloja o site; nada de scripts de tracking nem chaves de API no cliente.
2. **Funciona sem JavaScript** — o formulário é HTML puro pré-renderizado com
   `action="/orcamento-enviado"`; o AJAX é só melhoria progressiva.
3. **Anti-spam incluído** — campo honeypot, sem CAPTCHA (fricção zero).
4. **Custo** — incluído no plano da Netlify até 100 submissões/mês; muito
   acima do volume esperado de um negócio local.

## Consequências

- Campos: Nome, Telefone, Tipo de trabalho (select dos 6 serviços reais +
  "Outro"), Mensagem opcional. Nada de morada/NIF nesta fase.
- Notificações por e-mail configuram-se no painel da Netlify
  (Forms → Notifications) — passo manual documentado no `DEPLOY.md`.
- Deteção do formulário acontece no build: o markup tem de existir no HTML
  estático. Como a página é pré-renderizada, está garantido; se a secção de
  contacto passar a carregar por JavaScript, isto parte silenciosamente —
  o teste `quote-form.test.tsx` trava `data-netlify` e `form-name`.
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
