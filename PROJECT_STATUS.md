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

- Sprint: 1 — Fundação e design system
- Objetivo: base tipada, acessível e consistente.
- Estado: DONE — pronto para gate de entrada na Sprint 2 (cutscene, ADR-006)

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
| `npm run test` | 20 testes, 20 passam | 2026-07-28 |
| `npm run build` | OK — 2 rotas estáticas prerenderizadas | 2026-07-28 |
| `next start` + HTML servido | HTTP 200; skip link, `<main>`, `<header>`, `<footer>`, nav nomeada | 2026-07-28 |
| Árvore de headings no HTML | h1→h2→h3, sem saltos | 2026-07-28 |
| Frases proibidas (docs/04) | nenhuma das 6 presente | 2026-07-28 |
| Tokens compilados no CSS | todos presentes; utilitários `(--var)` resolvidos | 2026-07-28 |

## Orçamento de assets da cutscene (ADR-006)

| Caminho | Payload | Orçamento |
|---|---:|---|
| `public/cutscene/desktop/` | 7,5 MB | fora do caminho crítico; carregado após LCP |
| `public/cutscene/mobile/` | 940 KB | 24 frames WebP 720px |
| `public/cutscene/poster/` | 1,6 MB | maior ficheiro 229 KB ≤ 250 KB (§15) |

## Métricas

| Métrica | Baseline | Atual | Meta |
|---|---:|---:|---:|
| LCP | — (falta medir em browser) | — | ≤ 2,5 s |
| CLS | — | — | ≤ 0,10 |
| INP | — | — | ≤ 200 ms |
| JS inicial home (gzip) | 186,3 KB | 186,3 KB | ≤ 180 KB |
| CSS (gzip) | 5,3 KB | 5,3 KB | — |
| HTML servido | 42,3 KB | 42,3 KB | — |

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
- Inconsistência de dados: `docs/13-OPEN-QUESTIONS-CLIENT-VALIDATION.md` lista
  o Instagram como por confirmar, mas `data/project-data.json` tem
  `instagramNeedsConfirmation: false`. Até validação explícita do cliente,
  tratar como **não confirmado** (lado mais seguro) e corrigir o JSON.
- Ficheiro `Sim_vamos_lá.mp4` (2,7 MB) apareceu na raiz durante a sessão. Não
  faz parte do pacote e não foi identificado; deixado intacto e excluído do
  versionamento até o cliente esclarecer o que é.

## Questões do cliente

- Ver `docs/13-OPEN-QUESTIONS-CLIENT-VALIDATION.md`.
- Issues abertas nesta sessão: `docs/decisions/CLIENT-ISSUES.md`.

## Limitações conhecidas do Sprint 1

- **Sem verificação visual.** O ambiente não tem browser headless, por isso o
  layout foi validado por estrutura HTML e CSS compilado, não por renderização.
  Inspeção em mobile e desktop reais continua por fazer (ponto 4 do §17).
- Serviços e Processo estão implementados com a copy aprovada, mas com
  apresentação simples — a grelha editorial e o motion secundário são a
  Sprint 3 (`S3-T01`, `S3-T04`).
- Navegação sem menu hamburger: quatro âncoras que fluem em duas linhas no
  mobile. Evita um componente client e mantém a navegação funcional sem
  JavaScript. Reavaliar se o número de itens crescer.
- `real-005` (trabalhador identificável) está no dataset mas fora da lista
  publicável, por `publicationNeedsConsent: true`. A galeria mostra 10 de 11
  fotos até CLIENT-04 ser resolvido.

## Próxima ação

- Sprint 2 — Cutscene e hero (ADR-006): pipeline de imagens já feito, falta
  `CinematicIntro` com timeline única e dois renderers, skip acessível,
  reduced motion, `PaintReveal` e QA da introdução.
- Restrição herdada: GSAP por import dinâmico (ver nota do orçamento de JS).
