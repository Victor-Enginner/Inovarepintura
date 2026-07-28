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

- Framework: nenhum ainda — greenfield. Regra aplicável: Next.js App Router.
- Package manager: npm (Node v24.18.0 / npm 11.16.0 disponíveis no ambiente;
  pnpm 11.15.0 também disponível mas não escolhido, para bater certo com os
  comandos já documentados em `docs/05-TECHNICAL-ARCHITECTURE.md`).
- Runtime: Node v24.18.0.
- Styling: Tailwind CSS (a instalar).
- Motion: GSAP + ScrollTrigger para a cutscene; sem outra lib de motion até
  haver justificação.
- Testing: a definir na Sprint 1 (S1-T01).
- Deploy: Netlify (preparado; sem conta/credenciais fornecidas ainda).

## Sprint ativo

- Sprint: 0 — Descoberta e baseline
- Objetivo: compreender o pacote, organizar o repositório e produzir o
  diagnóstico/plano antes de qualquer código de produção.
- Estado: DONE — pronto para gate de entrada na Sprint 1

## Tarefas

| ID | Estado | Evidência | Observações |
|---|---|---|---|
| S0-T01 | DONE | Este ficheiro + auditoria no histórico da sessão | Sem stack prévia; git inicializado; pacote movido para a raiz |
| S0-T02 | DONE | Inventário abaixo | 11 fotos reais + 6 PNGs gerados + 1 MP4 preview; falta categoria "remodelação" |
| S0-T03 | DONE | Contactos cruzados com `docs/00` e `CLAUDE.md` §10 | Todos batem certo; ver inconsistência do Instagram em Bloqueios |
| S0-T04 | DONE | `docs/decisions/ADR-001..005` | 5 ADRs registados: stack, cutscene, galeria, imagem, analytics |
| S0-T05 | DONE | Secção "Verificações" abaixo | N/A para build/bundle/Lighthouse — greenfield, sem `package.json` ainda; baseline real só existe depois do S1-T01 |

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
| ADR-002 | Cutscene por camadas de imagem (não scroll-scrub de vídeo) | Proposto |
| ADR-003 | Galeria: CSS Grid + dialog acessível construído no projeto (fallback definitivo do `CLAUDE.md` §8) até auditoria de libs externas | Proposto |
| ADR-004 | Pipeline de imagem: AVIF/WebP + JPEG fallback, larguras 480–1920 | Proposto |
| ADR-005 | Analytics: eventos mínimos do `CLAUDE.md` §16, sem PII, carregado após consentimento/idle | Proposto |

## Verificações

| Comando/teste | Resultado | Data |
|---|---|---|
| `git --version` | 2.55.0 | 2026-07-28 |
| `node -v` | v24.18.0 | 2026-07-28 |
| `npm -v` | 11.16.0 | 2026-07-28 |

## Métricas

| Métrica | Baseline | Atual | Meta |
|---|---:|---:|---:|
| LCP | — (sem app ainda) | — | ≤ 2,5 s |
| CLS | — | — | ≤ 0,10 |
| INP | — | — | ≤ 200 ms |
| JS inicial home (gzip) | — | — | ≤ 180 KB |

## Bloqueios

- Categoria "remodelação" sem fotos reais — filtro de galeria da Sprint 4 não
  pode ficar 100% fiel ao `CLAUDE.md` §12 sem decisão do cliente (nova foto ou
  ajuste do filtro).
- Inconsistência de dados: `docs/13-OPEN-QUESTIONS-CLIENT-VALIDATION.md` lista
  o Instagram como por confirmar, mas `data/project-data.json` tem
  `instagramNeedsConfirmation: false`. Até validação explícita do cliente,
  tratar como **não confirmado** (lado mais seguro) e corrigir o JSON.

## Questões do cliente

- Ver `docs/13-OPEN-QUESTIONS-CLIENT-VALIDATION.md`.
- Issues abertas nesta sessão: `docs/decisions/CLIENT-ISSUES.md`.

## Próxima ação

- Terminar S0-T04 (ADRs) e S0-T05 (baseline formal), depois arrancar a
  Sprint 1 (S1-T01: scaffold Next.js + TypeScript strict + Tailwind + lint/
  format/test).
