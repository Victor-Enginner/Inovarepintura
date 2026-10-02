# 07 — Assets do hero scrolltelling

Medições feitas a partir dos cinco masters PNG em `assets/generated/hero-scroll/`
(1672×941, verificados por `SHA256SUMS.txt` do pacote de origem, 29/29 OK).

## Integridade

Os cinco PNG e o MP4 do pacote são os mesmos ficheiros que vieram do cliente —
SHA-256 conferido um a um. Nada foi regenerado, nada foialterado.

## Dimensões e recorte

A imagem é 16:9 (1,777). Com `object-fit: cover`, o eixo vertical só é
recortado em ecrãs **mais largos** que 16:9. Nos viewports de validação:

| Viewport | Razão | Recorte vertical | Recorte horizontal |
|---|---|---|---|
| 1920×1080 | 1,778 | 1 px | nenhum |
| 2560×1440 | 1,778 | 1 px | nenhum |
| 3840×2160 | 1,778 | 1 px | nenhum |
| 1440×900 | 1,600 | nenhum | 10% da largura |
| 390×844 | 0,462 | nenhum | **74% da largura** |
| 430×932 | 0,461 | nenhum | **74% da largura** |

Daí as duas decisões de `object-position`:

- **50% 60%** em ecrãs largos. É o ajuste pedido, com efeito real apenas
  acima de 16:9.
- **32% 60%** em ecrãs de formato ≤ 1:1. Aqui o corte é lateral e é severo.
  Medido no master: a fachada ocupa 0–35% da largura e a marca gravada no
  frame 1 está em 24–50%. A janela por omissão (37–63%) levava as duas fora
  de quadro; a 32% a janela cobre 22–48% e traz as duas inteiras.

O push-in de 1,025× tem `transform-origin: 50% 100%`. Centrado, cortava
1,25% da base da casa — onde estão as pinceladas.

## Qualidade do WebP

PSNR medido contra o master reduzido à mesma largura (decodificação WebP contra
PNG). Referência: 30 dB já é pouco visível em fotografia.

| Largura | q82 | q86 | q90 | q94 | q96 |
|---|---|---|---|---|---|
| 1672 px | 316 KB / 33,5 dB | 367 KB / 34,2 dB | **450 KB / 34,9 dB** | 551 KB / 35,5 dB | 605 KB / 35,6 dB |
| 1280 px | 215 KB / 31,9 dB | 249 KB / 32,5 dB | 292 KB / 32,9 dB | 362 KB / 33,4 dB | 392 KB / 33,5 dB |
| 960 px | 136 KB / 30,5 dB | 156 KB / 30,9 dB | 187 KB / 31,3 dB | 226 KB / 31,6 dB | 253 KB / 31,8 dB |

**Escolha: q90.** De q90 para q96 paga-se +34% de peso por +0,7 dB. O joelho da
curva é onde o peso deixa de comprar diferença visível.

## AVIF descartado

O pacote trazia AVIF de 14,8 MB contra 2,87 MB de WebP — cerca de 5× mais
pesado, por efeito de codificação. Não se usa AVIF em produção.

## ficheiros gerados

`scripts/build-hero-assets.mjs` produz 4 variantes por frame:

| Variante | Largura | frame-01 | Serve |
|---|---|---|---|
| `-960` | 960 | 187 KB | ecrãs pequenos, entra no LCP |
| `-mobile` | 1280 | 292 KB | telemóveis DPR 2 |
| `-1440` | 1440 | 353 KB | telemóveis DPR 3 (430×932 × 3 = 1290) |
| (sem sufixo) | 1672 | 450 KB | desktop |

Total dos 20 WebP: 5,6 MB. Por visita carregam-se **um** ficheiro no LCP e, no
máximo, mais três à medida que o scroll avança — nunca os cinco de uma vez.

## Gargalo conhecido

Os masters têm 1672 px. Em 2560×1440 o browser amplia 1,53× e em 3840×2160
2,30×. A §15 pede imagem LCP ≤ 250 KB; o frame 1 nativo fica nos 450 KB, e o
candidato de 960 px (187 KB) entra no LCP em ecrãs estreitos. Baixar os 450 KB
exigiria comprimir abaixo de q90 e perder o detalhe que a §11 manda preservar.
A saída certa é reexportar os masters a partir da origem com 2560 px ou mais.