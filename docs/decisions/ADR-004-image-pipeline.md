# ADR-004 — Pipeline de imagem

## Estado

Aceite

## Contexto

11 fotos reais em retrato (864×1536/1152×1536, 160–376 KB) e 6 PNGs gerados
em paisagem (1672×941). `CLAUDE.md` §11/§15 exigem AVIF/WebP, remoção de EXIF,
sem upscale, e imagem LCP ≤ 250 KB.

## Critérios

- desempenho (LCP, CLS);
- privacidade (remoção de EXIF);
- fidelidade (sem gerar partes inexistentes, sem alterar cor do resultado).

## Opções

### Opção A — `next/image` + derivados AVIF/WebP gerados no build

Usa o pipeline nativo do Next.js para responsive `srcset`/`sizes`, com
larguras 480/768/1024/1440/1920 conforme `docs/05`. Remoção de EXIF e geração
de thumbnails feita uma vez, no processamento dos assets, mantendo os
originais fora de `public/`.

### Opção B — CDN de imagem externo

Mais flexível a longo prazo, mas adiciona dependência de terceiro, custo e
uma nova origem para CSP — não justificado para o volume atual (17 imagens).

## Decisão

Opção A. `next/image` com derivados gerados no processamento dos assets;
originais preservados fora de `public/` (ex.: `source-assets/`); thumbnails de
galeria entre 480–800 px; lightbox limitado ao tamanho útil real.

## Consequências

- positivas: sem dependência externa, controlo total sobre orçamento de
  performance;
- negativas: build local precisa de gerar os derivados antes do deploy;
- mitigação: script de processamento documentado e versionado;
- fallback: JPEG quando AVIF/WebP não suportado.

## Evidência

`CLAUDE.md` §11, §15; `docs/05-TECHNICAL-ARCHITECTURE.md`; dimensões medidas
nesta sessão (galeria em retrato, gerados em paisagem 1672×941).
