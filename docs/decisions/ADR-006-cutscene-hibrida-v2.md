# ADR-006 — Cutscene híbrida sobre o master v2

## Estado

Aceite — **substitui o ADR-002**

## Contexto

O ADR-002 rejeitou o scroll-scrub de vídeo porque o MP4 disponível na altura
(`inovare-cutscene-abertura-v1.mp4`, 9,5 s a 4,5 Mbps) não tinha keyframes
preparados para seek, e o `CLAUDE.md` §6 proíbe usar vídeo como scrub "sem
medir a precisão de seek e sem reencodar keyframes adequados".

Essa condição mudou. O cliente forneceu um master v2 reencodado
especificamente para scrub. Verificação feita nesta sessão:

- `inovare-cutscene-v2-scroll-web.mp4`: 1920×1080, 30 fps, H.264 High,
  11,2 s, **56 keyframes a intervalos de exatamente 0,200 s**, faststart OK;
- `inovare-cutscene-v2-scroll-master.mp4`: o mesmo a 60 fps, para arquivo.

A objeção técnica do ADR-002 deixou de se aplicar. Resta a objeção de peso: o
ficheiro veio a **17,3 Mbps / 23,2 MB**, que é bitrate de mezanino e não de
entrega.

## Critérios

- desempenho e conversão em rede móvel (é onde está o tráfego);
- acessibilidade (reduced motion, nunca bloquear conteúdo);
- robustez cross-browser (Safari iOS é o caso crítico);
- manutenção;
- fidelidade visual.

## Medições

Todas feitas nesta sessão, a partir do master v2, mantendo keyframes a 0,2 s:

| Opção | Payload | SSIM vs master |
|---|---|---|
| vídeo "web" como veio (1080p30) | 23,2 MB | — |
| vídeo 1080p CRF 25 | 11,2 MB | — |
| vídeo 1080p CRF 27 | 9,2 MB | 0,9806 |
| **vídeo 1080p CRF 29** | **7,4 MB** | **0,9748** |
| vídeo 1080p CRF 31 | 6,1 MB | 0,9687 |
| vídeo 720p CRF 26 | 5,6 MB | — |
| sequência WebP 1280px, 56 frames | 5,4 MB | — |
| sequência WebP 960px, 56 frames | 3,2 MB | — |
| **sequência WebP 720px, 24 frames** | **0,9 MB** | — |

## Opções

### Opção A — só sequência de frames

Mais leve e determinística em todo o lado, mas desperdiça a continuidade real
a 30 fps que o master v2 oferece no desktop.

### Opção B — só vídeo com scrub

Fidelidade máxima, mas impõe download de vários MB e o comportamento de
`currentTime` durante scroll no Safari iOS é historicamente instável — o pior
caso cai exatamente sobre o tráfego móvel que gera os contactos.

### Opção C — híbrido

Vídeo com scrub no desktop; sequência de frames em canvas no mobile.

## Decisão

**Opção C.** Escolhida pelo cliente após apresentação das medições.

Regra de arquitetura que torna o híbrido sustentável: **uma só timeline, dois
renderers.** O progresso de scroll (0→1) é calculado uma única vez pela
timeline; apenas a camada que o desenha muda. Não existem duas narrativas
para manter em sincronia — existe uma narrativa e duas formas de a pintar.

Derivados gerados por `scripts/build-cutscene-assets.sh`:

- desktop: `assets/cutscene/desktop/cutscene-1080p.mp4` — 7,4 MB, CRF 29,
  keyframes a 0,200 s confirmados após reencode;
- mobile: `assets/cutscene/mobile/f01..f24.webp` — 24 frames a 720px, 940 KB;
- posters: `assets/cutscene/poster/{inicial,resultado}-{768,1280,1920}.{webp,jpg}`,
  todos dentro do orçamento LCP de 250 KB (§15).

## Mapeamento scroll → tempo

Medição dos beats narrativos no master (amostragem densa, verificada
visualmente):

| Janela | Beat | % da duração |
|---|---|---|
| 0,0–1,8 s | estado inicial, quase estático | 16% |
| 1,8–6,5 s | transformação branco → ocre, progressiva | 42% |
| 6,5–9,3 s | acabamento, andaime a sair | 25% |
| 9,3–11,2 s | splash de marca | 17% |

**O mapeamento não pode ser linear.** Os primeiros ~1,6 s são visualmente
estáticos; com mapeamento linear o visitante gasta 16% da altura do pin sem
ver alteração nenhuma e interpreta isso como avaria. A timeline deve comprimir
a janela inicial e distribuir mais distância de scroll sobre a transformação
(1,8–6,5 s), que é o beat que comunica o serviço.

## Consequências

- positivas: fidelidade máxima onde a rede aguenta; mobile fica a 940 KB, mais
  leve do que qualquer variante de vídeo; sem risco de jank de seek no
  Safari iOS no caminho que mais importa para conversão;
- negativas: dois renderers para testar (desktop e mobile) em vez de um;
- mitigação: a timeline partilhada isola a diferença a uma única camada de
  desenho; o QA da Sprint 2 (`S2-T06`) tem de cobrir ambos explicitamente;
- fallback: poster `resultado-*` imediato com `prefers-reduced-motion`, rede
  lenta ou falha de carregamento. O poster de reduced motion é o **resultado
  ocre limpo (t=9,0 s), não o splash** — o splash é dispositivo de transição,
  não o resultado do trabalho.

## Proveniência

Todos estes assets são `provenance: generated`. A fachada da cutscene é
imagem gerada e **nunca** pode aparecer no filtro "Trabalhos realizados"
(`CLAUDE.md` §11).

## Evidência

`ffprobe` sobre master e derivados (56 keyframes @ 0,200 s antes e depois do
reencode); SSIM medido por `ffmpeg -lavfi ssim`; contact sheets de verificação
visual dos beats; tamanhos confirmados em `assets/cutscene/`.
