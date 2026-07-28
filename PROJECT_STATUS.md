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

- `netlify.toml` configurado (build `npm run build`, publish `.next`,
  plugin `@netlify/plugin-nextjs` v5 — suporta Next.js 13.5+, incluindo o 16).
- `netlify-cli` testado via `npx` (27.0.1). **Não** instalado como
  devDependency de propósito: conflito de peer deps com o `next`
  (`@opentelemetry/api`) e centenas de MB no lockfile. Usar sempre via `npx`.

Passos que exigem a conta do cliente (não executáveis pelo agente):

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
- `real-005` (trabalhador identificável) está no dataset mas fora da lista
  publicável, por `publicationNeedsConsent: true`. A galeria mostra 10 de 11
  fotos até CLIENT-04 ser resolvido.
- Os testes e2e correm em Chromium. Safari/WebKit não foi testado por falta
  de dependências de sistema no ambiente.

## Próxima ação

- **Deploy em Netlify (decisão do cliente: manter Netlify):** requer conta e
  autenticação do cliente — ver secção "Deploy" abaixo.
- **Validação com o cliente (ainda pendente):** consentimento do trabalhador
  em `real-005` (CLIENT-04), pares antes/depois (CLIENT-05), área de serviço
  além de Olhão (CLIENT-06), categoria "remodelação" (CLIENT-07), domínio
  final (CLIENT-08).
- **Verificação em dispositivos reais:** Safari iOS e browsers Android.
- **Google Business Profile:** criar/otimizar perfil com NAP consistente.
