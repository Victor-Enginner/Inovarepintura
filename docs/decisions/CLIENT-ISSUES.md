# Issues do cliente — geradas no Gate A / Sprint 0

Complementa `docs/13-OPEN-QUESTIONS-CLIENT-VALIDATION.md`. Cada item bloqueia
apenas a área indicada, não o projeto inteiro. Nenhum destes dados pode ser
apresentado em produção como facto confirmado até fechar aqui.

## CLIENT-01 — E-mail de contacto

- Confirmar se `renovarepintura192619@gmail.com` está correto.
- Bloqueia: Sprint 5 (`S5-T02`), Gate D.
- **RESOLVIDO em 2026-07-28:** cliente confirmou o e-mail.
  `emailNeedsConfirmation: false` em `data/project-data.json`.

## CLIENT-02 — WhatsApp

- Confirmar se `+351 913 411 051` recebe WhatsApp.
- Bloqueia: Sprint 5 (`S5-T01`, `S5-T03`), Gate D.
- **RESOLVIDO em 2026-07-28:** cliente confirmou que o número recebe WhatsApp.
  `whatsappNeedsConfirmation: false`. WhatsApp adicionado à barra fixa do
  telemóvel (`StickyContact`) e ao CTA final.

## CLIENT-03 — Instagram

- Confirmar handle/URL `@inovarepintura`.
- **RESOLVIDO em 2026-07-28:** o handle real é `@inovarepinturaa` (duplo 'a' —
  o `@inovarepintura` estava ocupado). JSON corrigido:
  `instagramHandle: "@inovarepinturaa"`,
  `instagramUrl: "https://instagram.com/inovarepinturaa"`,
  `instagramNeedsConfirmation: false`.

## CLIENT-04 — Consentimento de imagem de trabalhador

- `assets/gallery/05-edificio-trabalho-em-altura.jpg` mostra uma pessoa
  identificável.
- Confirmar consentimento antes de publicar.
- Bloqueia: Sprint 4 (`S4-T01`), Gate D.

## CLIENT-05 — Pares antes/depois

- Confirmar que os seguintes pares são da mesma obra:
  - `terraco-01` (real-007 antes / real-006 depois);
  - `interior-01` (real-009 durante / real-008 depois);
  - `moradia-ocre-01` (real-010 durante / real-011 resultado).
- Bloqueia: Sprint 4 (`S4-T06`).

## CLIENT-06 — Área de serviço

- Confirmar se o atendimento vai além de Olhão (ex.: restante Algarve).
- Bloqueia: Sprint 5 (`S5-T04`).

## CLIENT-07 — Categoria "remodelação" sem fotos reais

- O filtro de galeria exigido (`CLAUDE.md` §12) inclui "Remodelação", mas
  nenhuma das 11 fotos reais está classificada assim (categorias presentes:
  exteriores, coberturas, interiores).
- Opções a decidir com o cliente: (a) fornecer fotos reais de remodelação;
  (b) lançar a v1 sem essa categoria visível até haver fotos; (c) reclassificar
  alguma foto existente, se genuinamente aplicável.
- Bloqueia: Sprint 4 (`S4-T04`).

## CLIENT-08 — Domínio final

- Confirmar domínio de produção antes de fixar `canonical`/Open Graph/
  `sitemap.xml`.
- Bloqueia: Sprint 6, Sprint 8.

## CLIENT-09 — Google Business Profile

- Confirmar existência, propriedade e categoria do perfil.
- Bloqueia: Sprint 6 (`S6-T05`), Sprint 8 (`S8-T04`).

## CLIENT-10 — Analytics

- Confirmar ferramenta, proprietário da conta e consentimento/cookies
  necessários (ver ADR-005).
- Bloqueia: Sprint 5 (`S5-T05`).
