# ADR-001 — Stack de implementação

## Estado

Aceite

## Contexto

Projeto greenfield: não existe app anterior a preservar. O `CLAUDE.md` §4
define a stack por defeito para este cenário e não há benefício mensurável em
divergir.

## Critérios

- acessibilidade;
- desempenho;
- manutenção;
- compatibilidade;
- licença;
- custo de implementação.

## Opções

### Opção A — Next.js App Router + React + TypeScript strict + Tailwind + npm

SSR/SSG nativo para SEO local e LCP baixo, ecossistema maduro, deploy direto
no Netlify, tipagem forte reduz regressões em contactos/copy. Custo: alguma
complexidade de rotas/streaming que não é necessária para um site de uma
página, mas mitigável mantendo a app simples.

### Opção B — SPA Vite + React

Build mais simples, mas exige solução extra para SEO/metadata/JSON-LD do lado
do servidor, o que conflita com o requisito de indexação local (`docs/11`).

## Decisão

Opção A. Next.js App Router, React, TypeScript em modo `strict`, Tailwind
CSS, npm como package manager (bate certo com os comandos já documentados em
`docs/05-TECHNICAL-ARCHITECTURE.md`), GSAP + ScrollTrigger só para a timeline
da cutscene, deploy Netlify.

## Consequências

- positivas: SEO/SSR nativo, tipagem forte, alinhado com `CLAUDE.md`;
- negativas: framework mais pesado que uma SPA pura;
- mitigação: orçamento de JS (§15) e code-splitting da timeline;
- fallback: nenhum — é a única stack aprovada para greenfield neste pacote.

## Evidência

`CLAUDE.md` §4; `docs/05-TECHNICAL-ARCHITECTURE.md`; versões confirmadas no
ambiente: Node v24.18.0, npm 11.16.0.
