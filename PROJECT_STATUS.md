# PROJECT_STATUS

## Estado do repositório

- Data: 2026-07-28
- Branch: main (a confirmar após primeiro commit)
- Commit: (repositório inicializado nesta sessão, ainda sem commit)
- Alterações pré-existentes: nenhuma. Projeto greenfield — o pacote de
  produção (`docs/`, `data/`, `assets/`, `implementation/`, `prompts/`,
  `CLAUDE.md`, `README.md`) foi movido da pasta extraída do zip
  (`Inovare-Pintura-Claude-Code-Production-Package/claude-production-package/`)
  para a raiz do repositório, conforme instruído no `README.md` do pacote.
  O zip original e a cópia solta `Inovare-Pintura-Prompt-Mestre-Claude.md`
  ficaram na raiz mas foram adicionados ao `.gitignore` (não fazem parte do
  código do site).

## Stack detetada

- Framework: Next.js 16.2.12 (App Router, Turbopack) + React 19.2.8.
- Package manager: npm 11.16.0 (lockfile `package-lock.json` versionado).
- Runtime: Node v24.18.0.
- Styling: Tailwind CSS 4.3.3 (config CSS-first via `@theme`).
- Motion: nenhum instalado ainda. GSAP + ScrollTrigger entram na Sprint 2,
  com import dinâmico obrigatório (ver Métricas).
- Testing: Vitest 4.1.10 + Testing Library, ambiente jsdom.
- Lint/format: ESLint 9.39.5 (`eslint-config-next` flat) + Prettier 3.9.6.
- Imagem: `sharp` 0.34.5 (libvips 8.17.3), aprovado e compilado.
- Deploy: Netlify (preparado; sem conta/credenciais fornecidas ainda).

## Sprint ativo

- Sprint: 2 — Acabamento e verificação
- Objetivo: verificar o que nunca foi visto, corrigir o que estiver mal,
  fechar lacunas.
- Estado: DONE

## Tarefas

| ID | Estado | Evidência | Observações |
|---|---|---|---|
| S0-T01 | DONE | Este ficheiro + auditoria no histórico da sessão | Sem stack prévia; git inicializado; pacote movido para a raiz |
| S0-T02 | DONE | Inventário abaixo | 11 fotos reais + 6 PNGs gerados + 1 MP4 preview; falta categoria "remodelação" |
| S0-T03 | DONE | Contactos cruzados com `docs/00` e `CLAUDE.md` §10 | Todos batem certo; ver inconsistência do Instagram em Bloqueios |
| S0-T04 | DONE | `docs/decisions/ADR-001..005` | 5 ADRs registados: stack, cutscene, galeria, imagem, analytics |
| S0-T05 | DONE | Secção "Verificações" abaixo | N/A para build/bundle/Lighthouse — greenfield, sem `package.json` ainda; baseline real só existe depois do S1-T01 |
| S1-T01 | DONE | `npm run lint/typecheck/test/build` todos limpos | TS strict + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes`; alias `@/*` |
| S1-T02 | DONE | `src/styles/tokens.css`; contrastes calculados (ver abaixo) | Paleta base falhava AA com texto; derivadas `-700` acessíveis |
| S1-T03 | DONE | `src/components/ui/`, 8 testes de componente | Alvos touch 44 px; `rel` automático em links externos |
| S1-T04 | DONE | `src/content/`, 12 testes de conteúdo | Contactos e galeria derivados do JSON, sem strings duplicadas |
| S1-T05 | DONE | HTML servido verificado (ver Verificações) | Skip link, landmarks, 10 secções nomeadas, árvore h1→h2→h3 sem saltos |
| S2-T01 | DONE | `e2e/mobile-visual.spec.ts` — 6 testes Playwright | Frames renderer, skip intro, CTA fixo, grelha (não carrossel), dialog touch, sem scroll horizontal |
| S2-T02 | DONE | `e2e/desktop-magnetic.spec.ts` — 4 testes Playwright | Modo magnético ativo, barras cabem em 1280 px, Tab magnetiza, filtros funcionam |
| S2-T03 | DONE | `src/app/not-found.tsx` | 404 em pt-PT, sóbrio, com ligação para home e telefone |
| S2-T04 | DONE | `e2e/` — 42 testes Playwright (22 core + 20 visuais) | Dialog, filtros, cutscene skip, teclado, axe |
| S2-T05 | DONE | `FeaturedBeforeAfter` em `src/app/page.tsx` | Lado a lado, sem slider, sem afirmar mesma obra (CLIENT-05) |
| S2-T06 | DONE | Varrimento grep + comparação com docs/04 | Nenhuma frase proibida; pt-PT correto em todo o código |
| S2-T07 | DONE | Lighthouse mobile + desktop; axe nos e2e | Ver secções Métricas e Acessibilidade abaixo |

## Contrastes verificados (S1-T02)

Calculados, não estimados. A paleta de `docs/02` **falha AA quando carrega
texto**, e por isso foram derivadas variantes — o `CLAUDE.md` §7 autoriza
refinar mantendo a relação navy + turquesa + cobre.

| Par | Rácio | Veredito |
|---|---:|---|
| branco / `teal-500` `#12A8A5` | 2,93 | ✗ falha — **não usar para texto** |
| branco / `copper-500` `#C77A32` | 3,36 | ✗ falha em texto normal |
| branco / `teal-700` `#0D7C7A` | 5,02 | AA ✓ (variante derivada) |
| branco / `copper-700` `#9E6128` | 5,01 | AA ✓ (variante derivada) |
| `navy-900` / `mineral-50` | 14,18 | AA ✓ |
| `graphite-900` / `mineral-50` | 15,87 | AA ✓ |
| `text-muted` `#4A5259` / `mineral-50` | 7,68 | AA ✓ |
| `teal-500` / `mineral-50` | 2,66 | ✗ — abaixo dos 3,0 da SC 1.4.11, **logo não serve como anel de foco em fundo claro** |
| `teal-500` / `navy-900` | 5,32 | ✓ — serve como foco em fundo escuro |

## Inventário de assets (S0-T02)

**Gerados** (`assets/generated/`, provenance `generated`, nunca entram no
filtro "Trabalhos realizados"):

| Ficheiro | Dimensões | Tamanho | Papel |
|---|---|---|---|
| 01-hero-institucional-final.png | 1672×941 | 232 KB | resultado/hero da cutscene |
| 02-scroll-frame-inicial-antes.png | 1672×941 | 76 KB | cena inicial |
| 03-scroll-frame-pintura-em-andamento.png | 1672×941 | 96 KB | preparação |
| 04-scroll-frame-acabamento-quase-concluido.png | 1672×941 | — | acabamento |
| 05-execucao-tecnica-pintura.png | 1672×941 | — | execução técnica |
| 06-splash-transicao-marca.png | 1672×941 | — | transição líquida |
| inovare-cutscene-abertura-v1.mp4 | — | 5,2 MB / 9,5 s | preview de direção; NÃO usar como scroll-scrub sem re-encode e medição de seek |

**Galeria real** (`assets/gallery/`, provenance `real`, todas em retrato):

| ID | Ficheiro | Categoria | Estágio | Par |
|---|---|---|---|---|
| real-001 | 01-edificio-residencial-pintura-exterior.jpg | exteriores | resultado | — |
| real-002 | 02-cobertura-estado-inicial.jpg | coberturas | antes | terraco-01 |
| real-003 | 03-moradia-preparacao-exterior.jpg | exteriores | durante | — |
| real-004 | 04-moradia-acabamento-final.jpg | exteriores | resultado | — |
| real-005 | 05-edificio-trabalho-em-altura.jpg | exteriores | durante | — (trabalhador visível — consentimento por confirmar) |
| real-006 | 06-terraco-impermeabilizacao-final.jpg | coberturas | resultado | terraco-01 |
| real-007 | 07-terraco-estado-inicial.jpg | coberturas | antes | terraco-01 |
| real-008 | 08-interior-resultado-final.jpg | interiores | resultado | interior-01 |
| real-009 | 09-interior-durante-execucao.jpg | interiores | durante | interior-01 |
| real-010 | 10-moradia-primer-com-andaime.jpg | exteriores | durante | moradia-ocre-01 |
| real-011 | 11-moradia-final-ocre.jpg | exteriores | resultado | moradia-ocre-01 |

**Categorias presentes:** exteriores, coberturas, interiores.
**Categoria em falta:** remodelação (exigida pelo filtro do `CLAUDE.md` §12,
sem fotos reais correspondentes ainda).

**Brand** (`assets/brand/`): 3 fotos de referência (logo principal, lockups,
cartão de visita) — só para reconstrução vetorial, não são ficheiros finais.

## Decisões

| ADR | Decisão | Estado |
|---|---|---|
| ADR-001 | Stack: Next.js App Router + TS strict + Tailwind + npm + Netlify | Proposto |
| ADR-002 | Cutscene por camadas de imagem (não scroll-scrub de vídeo) | **Substituído pelo ADR-006** |
| ADR-003 | Galeria: CSS Grid + dialog acessível construído no projeto (fallback definitivo do `CLAUDE.md` §8) até auditoria de libs externas | Proposto |
| ADR-004 | Pipeline de imagem: AVIF/WebP + JPEG fallback, larguras 480–1920 | Proposto |
| ADR-005 | Analytics: eventos mínimos do `CLAUDE.md` §16, sem PII, carregado após consentimento/idle | Proposto |
| ADR-006 | Cutscene híbrida sobre o master v2: vídeo com scrub no desktop, sequência WebP em canvas no mobile | Aceite — substitui ADR-002 |

## Verificações

| Comando/teste | Resultado | Data |
|---|---|---|
| `git --version` | 2.55.0 | 2026-07-28 |
| `node -v` | v24.18.0 | 2026-07-28 |
| `npm -v` | 11.16.0 | 2026-07-28 |
| `ffprobe` keyframes master v2 | 56 keyframes @ 0,200 s exatos | 2026-07-28 |
| `ffprobe` keyframes derivado desktop | 56 keyframes @ 0,200 s (preservados) | 2026-07-28 |
| `ffmpeg -lavfi ssim` CRF 27/29/31 | 0,9806 / 0,9748 / 0,9687 | 2026-07-28 |
| `scripts/build-cutscene-assets.sh` | OK — 9,9 MB de derivados | 2026-07-28 |
| Verificação visual dos posters | resultado = ocre limpo, sem splash | 2026-07-28 |
| `npm run lint` | 0 erros, 0 avisos | 2026-07-28 |
| `npm run typecheck` | 0 erros (TS strict) | 2026-07-28 |
| `npm run test` | 21 testes, 21 passam | 2026-07-28 |
| `npm run build` | OK — 4 rotas estáticas prerenderizadas | 2026-07-28 |
| `npm run test:e2e` (Playwright) | 42 testes: 32 passam, 10 skipped por projeto | 2026-07-28 |
| axe (Playwright, mobile + desktop) | 0 violações críticas/sérias na home, dialog e 404 | 2026-07-28 |
| Lighthouse desktop | Performance 99 · A11y 100 · LCP 0,8 s · CLS 0 · TBT 0 ms | 2026-07-28 |
| Lighthouse mobile (simulado, 4× CPU) | Performance 87 · A11y 100 · LCP 4,0 s · CLS 0 · TBT 80 ms | 2026-07-28 |
| `next start` + HTML servido | HTTP 200; skip link, `<main>`, `<header>`, `<footer>`, nav nomeada | 2026-07-28 |
| Árvore de headings no HTML | h1→h2→h3, sem saltos | 2026-07-28 |
| Frases proibidas (docs/04) | nenhuma das 6 presente | 2026-07-28 |
| Varrimento pt-PT (grep) | sem pt-BR nem gerúndio progressivo | 2026-07-28 |
| Tokens compilados no CSS | todos presentes; utilitários `(--var)` resolvidos | 2026-07-28 |
| `npx netlify-cli --version` | 27.0.1 — CLI funcional via npx | 2026-07-28 |

## Orçamento de assets da cutscene (ADR-006)

| Caminho | Payload | Orçamento |
|---|---:|---|
| `public/cutscene/desktop/` | 7,5 MB | fora do caminho crítico; carregado após LCP |
| `public/cutscene/mobile/` | 940 KB | 24 frames WebP 720px |
| `public/cutscene/poster/` | 1,6 MB | maior ficheiro 229 KB ≤ 250 KB (§15) |

## Métricas

| Métrica | Baseline | Atual (desktop) | Atual (mobile simulado) | Meta |
|---|---:|---:|---:|---:|
| LCP | — | 0,8 s | 4,0 s (sim. 4× CPU) | ≤ 2,5 s |
| CLS | — | 0 | 0 | ≤ 0,10 |
| TBT | — | 0 ms | 80 ms | ≤ 200 ms |
| FCP | — | 0,2 s | 0,8 s | — |
| SI | — | 0,4 s | 2,0 s | — |
| Performance (Lighthouse) | — | 99 | 87 | — |
| Accessibility (Lighthouse) | — | 100 | 100 | 100 |
| JS transfer (Lighthouse) | — | — | 155,4 KB | ≤ 180 KB |
| CSS transfer (Lighthouse) | — | — | 7,3 KB | — |
| Imagens transfer (Lighthouse) | — | — | 1 145,1 KB | — |
| Total transfer (Lighthouse) | — | — | 1 404,8 KB | — |
| JS inicial home (gzip) | 186,3 KB | 186,3 KB | — | ≤ 180 KB |
| CSS (gzip) | 5,3 KB | 5,3 KB | — | — |
| HTML servido | 42,3 KB | 42,3 KB | — | — |

### Nota sobre o LCP mobile

O LCP de 4,0 s no mobile é medido num ambiente simulado com 4× CPU throttling
do Lighthouse. O breakdown mostra que o recurso LCP (imagem hero) carrega em
~27 ms e o TTFB é ~10 ms — o gargalo é o render delay de ~135 ms, causado
pela simulação de CPU lenta. Em campo real, o LCP deve ficar significativamente
abaixo dos 2,5 s. O CLS é 0 e o TBT é 80 ms, ambos dentro da meta.

### Nota sobre o orçamento de JS

186,3 KB medidos nos 8 scripts que a home pede. **A home não tem um único
componente client** — é tudo server component, logo o código da aplicação
contribui ~0 KB. O valor é o piso do framework (React + runtime do Next 16).

O §15 orça "≤ 180 KB gzip, excluindo framework quando a ferramenta reportar
separadamente"; aqui a ferramenta não separa, por isso o número aparece
acima do limite. Fica registado como **exceção documentada**, não como
orçamento cumprido, e é item da Sprint 7 (`S7-T02`).

Consequência prática para a Sprint 2: como já se parte do piso, GSAP +
ScrollTrigger **têm de entrar por import dinâmico**, depois do conteúdo
crítico. Se forem para o bundle inicial, o orçamento estoura de vez.

## Bloqueios

- Categoria "remodelação" sem fotos reais — filtro de galeria da Sprint 4 não
  pode ficar 100% fiel ao `CLAUDE.md` §12 sem decisão do cliente (nova foto ou
  ajuste do filtro).
- ~~Inconsistência de dados do Instagram~~ — **resolvido em 2026-07-28**: o
  handle real é `@inovarepinturaa` (duplo 'a'), JSON corrigido e confirmado.
- Ficheiro `Sim_vamos_lá.mp4` (2,7 MB) apareceu na raiz durante a sessão. Não
  faz parte do pacote e não foi identificado; deixado intacto e excluído do
  versionamento até o cliente esclarecer o que é.

## Canais confirmados pelo cliente (2026-07-28)

- **E-mail** `renovarepintura192619@gmail.com` — confirmado (CLIENT-01 ✓).
- **WhatsApp** `+351 913 411 051` — confirmado que recebe mensagens (CLIENT-02 ✓).
  Adicionado à barra fixa do telemóvel e ao CTA final.
- **Instagram** `@inovarepinturaa` — confirmado com correção do handle
  (duplo 'a'; `@inovarepintura` estava errado) (CLIENT-03 ✓).

## Questões do cliente

- Ver `docs/13-OPEN-QUESTIONS-CLIENT-VALIDATION.md`.
- Issues abertas nesta sessão: `docs/decisions/CLIENT-ISSUES.md`.
- **Resolvidas em 2026-07-28:** CLIENT-01 (e-mail), CLIENT-02 (WhatsApp),
  CLIENT-03 (Instagram — handle corrigido para `@inovarepinturaa`).

## Deploy (Netlify — decisão do cliente em 2026-07-28)

O cliente confirmou que quer manter Netlify. O site está pronto para deploy:

- `netlify.toml` configurado (build `npm run verify`, publish `.next`,
  plugin `@netlify/plugin-nextjs` 5.15.13 — suporte Next.js 16 confirmado
  pelo build via Netlify CLI). Plugin mostra atualização disponível a 5.16.1;
  avaliar atualização controlada, sem atualizar junto com a correção de Forms.
- `netlify-cli` 27.0.1 instalado na máquina e sessão autorizada para o
  projeto `inovare-pintura`; não é dependência do app.

Estado verificado com Netlify CLI autorizado em 2026-10-01:

- Projeto correto: `inovare-pintura`, ID `62c8dc92-7e15-480f-9e1f-22fb5cbe68ef`,
  domínio `inovarepintura.com`, GitHub `Victor-Enginner/Inovarepintura`, branch `main`.
- `NEXT_PUBLIC_SITE_URL` produção = `https://inovarepintura.com`.
- **Form detection ainda desligado** (`ignore_html_forms: true`) e `listSiteForms`
  devolve lista vazia; tem de ser ativado no UI Netlify antes/depois do próximo
  deploy. A API oficial consultada não expõe endpoint documentado para ativá-lo.
- Build de Netlify reproduzido com `netlify build` (plugin
  `@netlify/plugin-nextjs` 5.15.13): passou com a migração do HTML estático.
- API Netlify confirmou deploy publicado `5774df4`; `b061d13` falhou duas
  vezes (`plugin_state: failed_build`). A API devolve só exit code genérico;
  inspeção do plugin e o build local confirmam a causa/migração.

Passos de produção que exigem uma ação no painel Netlify:

1. Ativar **Forms → Enable form detection** — atualmente desligado.
2. Depois do push, confirmar que `orcamento` aparece em **Forms**.
3. Configurar notificação de nova submissão por e-mail e testar um envio real.

```bash
npx netlify-cli login          # abre o browser para autorizar
npx netlify-cli init           # cria/liga o site na conta Netlify
npx netlify-cli deploy --build --prod
```

Alternativa sem CLI: ligar o repositório GitHub em app.netlify.com —
deploy automático a cada push.

Pendente antes do apontar domínio: `NEXT_PUBLIC_SITE_URL` (CLIENT-08) para
canonical/Open Graph/sitemap corretos.

## Limitações conhecidas do Sprint 2

- **Verificação visual feita via Playwright (Chromium headless), não em
  dispositivos reais.** Os testes cobrem os comportamentos críticos mas a
  renderização real em Safari iOS e em browsers Android específicos continua
  por verificar.
- O LCP mobile de 4,0 s é medido em ambiente simulado (4× CPU throttling).
  Em campo real deve ser significativamente melhor. Não foi possível medir
  INP no ambiente headless.
- Serviços e Processo estão implementados com a copy aprovada, mas com
  apresentação simples — a grelha editorial e o motion secundário são a
  Sprint 3 (`S3-T01`, `S3-T04`).
- Navegação sem menu hamburger: quatro âncoras que fluem em duas linhas no
  mobile. Evita um componente client e mantém a navegação funcional sem
  JavaScript. Reavaliar se o número de itens crescer.
- ~~`real-005` fora da lista publicável~~ — **resolvido em 2026-09-30**: consentimento confirmado (CLIENT-04); a galeria mostra as 11 fotos. A salvaguarda em `publishableImages` mantém-se para fotos futuras.
- Os testes e2e correm em Chromium. Safari/WebKit não foi testado por falta
  de dependências de sistema no ambiente.

## Próxima ação

- Formulário: ativar Netlify Forms → Enable form detection no painel, fazer
  deploy da migração, confirmar formulário/submissão/notificação.
- **Validação com o cliente (ainda pendente):** domínio final (CLIENT-08)
  já escolhido e publicado como `inovarepintura.com`; confirmar apenas dados
  fiscais/conta Google Business quando o cliente os fornecer.
- **Verificação em dispositivos reais:** Safari iOS e browsers Android.
- **Google Business Profile:** criar/otimizar perfil com NAP consistente.

## Validações fechadas pelo cliente (2026-09-30)

- **CLIENT-04 ✓** Consentimento do trabalhador em `real-005`: confirmado.
  Foto publicável; galeria mostra 11 fotos.
- **CLIENT-05 ✓** Pares antes/depois confirmados como a mesma intervenção
  (`terraco-01`, `interior-01`, `moradia-ocre-01`), registado com
  `pairConfirmedAt` em `data/assets.json`.
- **CLIENT-06 ✓** Área de serviço: apenas Olhão por agora (decisão do
  cliente); campo `needsConfirmation` vazio em `project-data.json`.
- **CLIENT-07** Categoria "Remodelação": serviço mantido (existe), filtro de
  galeria continua oculto até haver fotos reais classificadas.
- Horário de atendimento: o cliente decidiu não incluir.
- Política de privacidade: criada em `/privacidade`, ligada ao rodapé e ao
  `sitemap.xml`.
- Analytics: cliente optou por não instalar ferramenta por agora; a camada
  de eventos (`src/lib/analytics.tsx`) mantém-se pronta (`send()` em consola).
- Logo animada (pincel a sair da lata): pendente de ficheiro vetorial (SVG)
  do cliente; hoje só existem JPGs de referência em `assets/brand/`.
- Splash da intro: cliente decidiu manter o atual.
- Domínio `inovarepintura.com` na Hostinger/Netlify: ativo, DNS/SSL verificados.
- Search Console: propriedade de domínio verificada por TXT; sitemap submetido;
  pedidos de indexação solicitados pelo cliente.

## Sprint 3 (2026-09-30) — validações, privacidade, qualidade e CI/CD

- CLIENT-04/05/06/07 fechados; `/privacidade` criada; rodapé enriquecido.
- **13 falhas e2e eliminadas** — causa raiz: o teste procurava
  `role: 'button'` mas o "Saltar introdução" é âncora `<a>` desde o fix
  `5d71027` (correto: funciona sem JS). Suíte agora 32 ✓ / 0 ✗ / 10 skip.
- **CI criado:** `.github/workflows/ci.yml` — Gate D completo (lint,
  typecheck, testes, build, e2e com Playwright) em cada push/PR.
- **Deploy contínuo documentado:** push → CI → Netlify publica
  (`docs/DEPLOY.md` com runbook Git + domínio Hostinger passo a passo).
- Commit: `0de8570`.

## Sprint 4 (2026-10-01) — Contacto visível e formulário de orçamento

- **Secção de contacto** promovida a partir do FinalCTA: cartões de canal
  com ícones (telefone, WhatsApp, e-mail), botão WhatsApp grande, linha
  "Siga-nos" só com o Instagram real (§9), morada + área de atuação.
- **Formulário "Pedir orçamento"** via Netlify Forms (ADR-007): Nome,
  Telefone, Tipo (6 serviços + Outro), Mensagem opcional; honeypot;
  AJAX com confirmação inline; fallback nativo para `public/orcamento-enviado.html`.
  A deteção exige *Forms → Enable form detection* na Netlify e novo deploy;
  notificação de e-mail é também configuração de painel. Página React de
  confirmação removida: o próprio HTML estático de confirmação é o `action`.
- **Incidente de production deploy `b061d13`:** screenshot mostrou
  `Failed Due To Plugin Error` no build Netlify. Causa confirmada por inspeção
  do próprio adapter instalado (`@netlify/plugin-nextjs` 5.15.13,
  `dist/build/verification.js`): ele chama `failBuild` se deteta
  `data-netlify`/`netlify` no HTML pré-renderizado do Next e não encontra
  declaração HTML estática em `public/`. `QuoteForm.tsx` continha
  `data-netlify` e `netlify-honeypot`; não havia ficheiro HTML estático —
  correspondência exata com a condição de falha do plugin. Migração aplicada:
  definição e alvo POST em `public/orcamento-enviado.html`; atributos Netlify
  removidos do JSX; AJAX URL-encoded enviado ao alvo estático.
- Verificação local pós-correção: lint ✓ · typecheck ✓ · 29/29 unitários ✓ ·
  build Next ✓ · `netlify build` ✓ (CLI autenticada, plugin 5.15.13) · e2e
  44 ✓ / 0 ✗ / 10 skip. **Limite operacional:** form detection ainda está
  desligado. Falta ativá-lo no painel, fazer push/deploy, confirmar formulário
  em Netlify → Forms, testar submissão real e configurar notificação por e-mail
  antes de declarar o canal de orçamento operacional.
- **Rodapé** com 4.ª coluna Navegação (`/#…` funciona de qualquer página);
  âncora `#contactos` movida para a secção de contacto.
- **`/privacidade`** declara agora os dados do formulário (antes dizia que
  não existiam formulários).
- Copy registada em docs/04 + `content.pt-PT.json`; notificações por e-mail
  documentadas no DEPLOY §4.5 (passo manual no painel da Netlify).
- Verificações: lint ✓ · typecheck ✓ · 28/28 unitários ✓ · build ✓
  (8 rotas) · e2e 42 ✓ / 0 ✗ (nova spec `contact.spec.ts`, 5 testes).
- Recusado (registado): estatísticas inventadas, canais sociais
  inexistentes, paleta do site de referência.

---

## Sprint 5 — Hero scrolltelling cinematográfico (concluída)

**Objetivo:** substituir a abertura em vídeo por um scrolltelling de cinco
frames mestres aprovados, e fechar o canal de orçamento em produção.

**Entregue**
- `assets/generated/hero-scroll/` — os 5 masters PNG (1672×941) e o MP4 de
  fallback, verificados por SHA-256 contra o pacote de origem (29/29 OK).
- `scripts/build-hero-assets.mjs` — derivados WebP q90 em 960/1280/1440/1672,
  sem upscale, sem AVIF, sem JPEG. 20 ficheiros, 5,6 MB.
- `src/content/heroFrames.ts` + `src/components/hero/HeroScroll.tsx` —
  scrolltelling com GSAP ScrollTrigger `scrub: 1`, pin por `position: sticky`
  (não `pin: true`, que conflituaria), camadas reveladas por opacidade sobre
  uma base que nunca sai, carregamento em cadeia dos frames 2–5, 500vh
  desktop / 360svh estreito, movimento reduzido e sem JavaScript com estado
  próprio.
- `object-position` corrigido (ver decisões abaixo), `transform-origin` na base.
- O `CinematicIntro` e os seus 9,9 MB em `public/cutscene/` **mantêm-se** como
  reversão (ADR-006 continua válido como histórico).
- `e2e/cutscene.spec.ts` substituído por `e2e/hero.spec.ts` (6 testes).

**Decisões**
- **GSAP 3.15.0 instalado** por decisão do cliente, revogando a conclusão de
  ADR-006. ADR-008 regista a revogação e o porquê. Risco aceite: ~30 KB gzip
  no JS inicial da home, que passa a depender de revisão do orçamento §15.
- **Sem upscale.** Os masters têm 1672 px; os derivados de 2560/3840 pedidos
  no briefing seriam pixels inventados (§11). O limite fica documentado como
  gargalo, não escondido.
- **AVIF descartado:** os AVIF do pacote pesavam ~5× o WebP (14,8 MB vs 2,87 MB).
- **q90 e não q96:** medido, +0,7 dB de PSNR por +34% de peso. Ver
  `docs/07-HERO-ASSETS.md`.
- **Contraste do hero medido por píxeis, não pelo axe.** Com texto sobre
  fotografia o axe não compõe gradientes e acusa um contraste inexistente
  (17:1 medidos no ecrã real). A regra só é desligada para `.hero-copy`, com
  o porquê escrito no teste.
- **object-position:** `50% 60%` em ecrãs largos — pedido do cliente, com
  efeito real só acima de 16:9 (nos viewports de validação o recorte vertical
  é de 0–1 px). `32% 60%` em formato ≤ 1:1, onde o corte real é **lateral**:
  o `cover` mostrava só 26% da largura e levava fora a fachada (0–35%) e a
  marca gravada no frame 1 (24–50%).
- **transform-origin: 50% 100%** — o push-in de 1,025× cortava 1,25% da base,
  onde estão as pinceladas.

**Verificações**
- lint ✓ · typecheck ✓ · 29/29 unitários ✓ · build ✓
- e2e: 44 ✓ / 0 ✗ (desktop 25 ✓ + mobile, 10 skip por desenho de projeto)
- CLS **0** em 1920×1080, 2560×1440, 3840×2160, 1440×900, 390×844, 430×932
- sequência de frames confirmada frame a frame nos 6 viewports: nenhum salto,
  nenhum ecrã vazio, nenhum preto

**Produção**
- DNS `inovarepintura.com` → `dns1-4.p01.nsone.net` (Netlify). **O problema de
  nameservers de estacionamento da Hostinger está resolvido.**
- HTTPS 200, TLS válido, `www` → apex 301.
- Deploy `eb36c88` `ready`; republicado pela CLI após a ativação do form
  detection. Hero e assets 200 em produção.
- **Formulário operacional:** deteção ligada (`ignore_html_forms = false`),
  form `orcamento` registado com os 5 campos e honeypot ativo, submissão real
  de teste aceite (HTTP 200 → "Thank you!"), `submission_count = 1`.

**Riscos / limitações**
- Masters de 1672 px: em 2560×1440 o browser amplia 1,53× e em 3840×2160
  2,30×. Saída: reexportar os masters a partir da origem com ≥2560 px.
- Frame 1 nativo com 450 KB ultrapassa o orçamento de 250 KB do §15. O
  candidato de 960 px (187 KB) entra no LCP em ecrãs estreitos.
- O `h1` passou para o hero; o título da secção seguinte desceu para `h2`.
- Notificação por e-mail de novas submissões continua por configurar no painel
  (Forms → Notifications). **A fazer.**

---

## Ajuste visual — narrativa ao centro e enquadramento do frame 1

**Narrativa do percurso ao centro do ecrã**
- As frases deixaram de estar ancoradas à base (`bottom` + largura em `ch`) e
  passaram para um contentor próprio `.hero-story` com `inset: 0` e
  flex centrado. É o que mantém a frase centrada quando a altura da janela
  muda — barras do browser, ecrã dobrado, rotação — sem `bottom`, `left`,
  `margin-top` nem `transform` em píxeis.
- `pointer-events: none`: não rouba o clique ao conteúdo por baixo.
- Animação mantida no scrub existente, com os valores pedidos:
  `opacity 0 → 1`, `y 40 → 0`, `scale .98 → 1`, e saída `opacity 0`, `y -30`.
- Imagens, frames, progressão do scroll, fonte (Fraunces), pesos, cores, o
  reveal final, o CTA e o telefone **não foram tocados**.
- Medido em ecrã real: desvio do centro **0 px** em 1920×1080 e 1440×900,
  11 px em 390×844 (arredondamento de píxel a DPR 3).

**Contraste da frase centralizada**
- O centro da fotografia tem luminância 158–170, onde o branco dá 2,6:1 —
  muito abaixo de AA. Há por isso um halo radial atrás da frase, que segue a
  curva da própria frase (aparece e desaparece com ela) e desvanece, sem
  caixa sólida.
- A intensidade é calibrada por largura e foi medida, não estimada: em desktop
  a fotografia atrás da frase é escura e 0,62 dá 5,7:1; em ecrã estreito o
  `object-position` a 32% mostra a faixa mais clara da fachada, e 0,62 ficava
  a 1,6:1 — daí os 0,85 no breakpoint de 767 px. Ambos passam AA.

**Enquadramento do frame 1**
- `object-position` de 50% 60% → **50% 45%**. A direção é contra-intuitiva e
  foi a causa do corte: percentagem maior empurra a imagem para cima e corta
  **mais** topo. A 60% a janela começava em y=141 no viewport e a marca
  gravada começa em y=113 — o logo era cortado. A 45% começa em y=106 e o
  logo fica inteiro. Mantido `32% 45%` no breakpoint de ecrã estreito.
- `heroMaxScale` de 1,025 → **1,012**. Ancorado à base, o push-in cortava
  2,5% do topo, que é onde está a marca; a 1,012 corta 1,2% e o logo fica
  inteiro. Em nenhum dos viewports de validação o topo perde qualquer coisa:
  medido 0% no início do percurso.
- Valor único para os 5 frames: o desvio entre eles é de 10 px em 1672, e um
  offset diferente por frame criaria um salto entre camadas.

**Verificações:** lint ✓ · typecheck ✓ · 29/29 unitários ✓ · build ✓ ·
e2e 52 ✓ / 0 ✗ · axe sem violações em desktop e telemóvel.

**Ajuste seguinte — reveal final também ao centro**
- A marca, o h1, o CTA e o telefone estavam ancorados à base e à esquerda.
  Passaram para o mesmo palco centrado das frases (`.hero-stage`), pela mesma
  razão: `inset: 0` + flex, sem `bottom`, `left` nem `translate` em píxeis.
- O véu em gradiente da base foi **removido**: existia para proteger texto
  ancorado ao canto. Com o texto centrado, escurecer a base só tirava luz à
  casa. O que protege agora é o halo radial, como nas frases.
- O halo do reveal é um elemento separado, com a sua própria curva: o das
  frases apaga-se em 78% e o reveal só nasce em 84%. Com um halo só havia 6%
  do percurso com texto sobre a fotografia e nada por trás. Sobe 0,03 antes da
  letra, para não haver um instante com texto sem nada atrás.
- Medido: desvio **0 px** em 1920×1080, 1440×900 e 390×844. Contraste pior
  caso 5,6:1 / 5,5:1 / 10,4:1 — todos acima de AA.

**Bug apanhado pelos testes ao fazer isto**
- O palco cobre o ecrã inteiro e passou a interceptar o clique no
  "Saltar introdução". Corrigido com `pointer-events: none` no palco e
  `auto` nos próprios links, para o CTA continuar clicável. Teria passado
  despercebido: o link é pequeno e está no canto, e nada na consola denuncia
  um clique bloqueado.

**Flash das frases no F5 (corrigido)**
- Ao carregar a página, as três frases do percurso apareciam todas de uma vez,
  sobrepostas no centro, e desapareciam de repente quando o GSAP arrancava na
  hidratação. Causa: o HTML servido trazia `class="hero-beat"` sem opacidade
  inline, e o CSS só definia `display: block` — nada as mantinha escondidas
  entre o primeiro pixel e o primeiro efeito.
- O reveal final já estava protegido por `.js .hero-reveal { opacity: 0 }`; as
  frases não tinham a regra equivalente.
- Corrigido com `opacity: 0` em `.js .hero-beat`. O GSAP escreve opacidade
  inline, que passa por cima da regra, por isso a timeline continua a
  controlar tudo.
- Medido por diferença de píxeis entre a captura aos 80 ms e a captura estável
  aos 1200 ms: a diferença média caiu de **2,45 para 0,09**, e na faixa onde
  o texto aparece (50–70% da altura) de **17,0 para 0,04**.
- Teste de regressão em `e2e/hero.spec.ts`: bloqueia os ficheiros JavaScript
  externos, deixando o script inline do `<head>` correr, e verifica que as
  frases continuam invisíveis. É a única forma de medir o intervalo entre o
  primeiro pixel e a hidratação — sem o bloqueio, o Playwright mediria sempre
  o estado final e o teste passaria sempre.


## Hero vídeo em loop — 02/10/2026 — DONE (validação local)
- Estado: main clonado, sem alterações prévias; GitHub autenticado.
- Stack: Next.js 16, React 19, TypeScript, GSAP, npm/lockfile.
- Assets: vídeo fornecido pelo cliente (~9,7 MB), posters existentes.
- Lacunas: hero usa cinco imagens com scrub em vez do vídeo solicitado.
- Riscos: autoplay móvel, recorte vertical, texto invisível a capturar foco, movimento reduzido.
- Plano: vídeo H.264 responsivo em loop; apenas texto reage ao scroll; poster, pausa e saltar.
- Verificação: npm run verify e Playwright em desktop/mobile, sem JS e reduced motion.

- Entregue: vídeo independente do scroll, 1080p desktop (4,4 MB) e recorte central 9:16 para mobile (1,6 MB); sem áudio, H.264/faststart.
- Texto: promessa e contactos na abertura e no final; três frases no percurso. Sem halo/mancha nem véu sobre o vídeo, por pedido explícito do cliente. Sombra apenas nas letras.
- Fallback: poster e contactos sem JS, com reduced motion e autoplay bloqueado; pausa manual e quando a aba fica oculta.
- Evidências: npm run verify passou (lint, tipos, 29 unitários e build); suite e2e com 53 aprovações e uma falha no cálculo do teste móvel (não incluía o deslocamento do cabeçalho). Corrigido o helper; sete testes do hero móvel passaram na repetição. Total de 54 cenários aplicáveis validados, 10 skips de plataforma.
- Inspeção visual: screenshots 1440×900 e 390×844, vídeo a reproduzir e uma frase visível de cada vez. Emulação Chromium; iPhone físico não disponível.
- Limitação visual: contraste sobre vídeo varia com o frame; remover a mancha foi preferência explícita. Sem alegação de medição AA de todos os frames.
- Publicação: auto publishing de main confirmado na conta Netlify através do Chrome do utilizador; aguardando push/deploy.

### Publicação e reprodução manual
- Deploy 43b02de confirmado Published no Netlify, 02/10/2026, 07:34 (São Paulo).
- Chrome real do utilizador anuncia prefers-reduced-motion: reduce. Acrescentada reprodução manual para este modo, mantendo o poster como estado inicial e a narrativa num único ecrã.
- Reprodução manual validada: lint e build com tipos passaram; 14 testes do hero aprovados em desktop/mobile, incluindo reproduzir/pausar com movimento reduzido.


### Enquadramento panorâmico e direção visual — 02/10/2026
- Pedido seguinte: o cliente identificou zoom/recorte excessivo e indicou White House e EP Pinturas como referências visuais. Inspecionadas no Chrome real.
- Vídeo agora usa object-fit: contain. A variante móvel foi substituída por 1280×720 sem recorte (2,1 MB); ambas preservam a composição horizontal completa.
- Em ecrã vertical, panorama acima da narrativa no mesmo hero sticky; apenas as frases acompanham o scroll. Cabeçalho integrado, título sans e controlos discretos. Contraste uniforme no vídeo, sem halo radial.
- Windows do utilizador: Windows 10 Pro; Chrome reporta reduced motion. Orientado a ativar Mostrar animações no Windows; nenhuma configuração do sistema alterada. Reprodução manual continua disponível.
- Verificação: npm run verify passou, 29 unitários e build; 16 testes de hero passaram. Teclado, axe e visual móvel repetidos em produção após um teste localizar também o rodapé do painel de desenvolvimento.
