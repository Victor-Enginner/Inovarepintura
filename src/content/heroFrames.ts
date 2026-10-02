/* Estados do hero scrolltelling.
 *
 * Cinco frames do mesmo edifício, na ordem real da obra: marca, casa em
 * preparação, primeira pintura, pintura avançada, casa concluída. A ordem é
 * também o que transforma a sequência numa transformação contínua em vez de
 * uma slideshow — nada entra ou sai de cena, só o estado da fachada muda.
 *
 * Os ficheiros são derivados WebP gerados por `scripts/build-hero-assets.mjs`
 * a partir dos masters PNG em `assets/generated/hero-scroll/`. O master tem
 * 1672px de largura e é o teto: 1672 é a largura nativa, 1440 o degrau dos
 * telemóveis com DPR 3, 1280 o candidato móvel e 960 o candidato baixo que
 * entra no LCP em ecrãs pequenos. Não há variantes de 2560/3840 porque isso
 * seria upscale artificial (CLAUDE.md §11).
 *
 * `provenance: generated` — estas imagens não são trabalhos executados e por
 * isso nunca entram no filtro "Trabalhos realizados" (§11).
 */

const WIDTH_LOW = 960;
const WIDTH_MOBILE = 1280;
const WIDTH_LARGE = 1440;
const WIDTH_DESKTOP = 1672;

export type HeroFrameId = 'frame-01' | 'frame-02' | 'frame-03' | 'frame-04' | 'frame-05';

export interface HeroFrame {
  readonly id: HeroFrameId;
  /** Dimensões nativas do master, para reservar espaço e evitar CLS. */
  readonly width: number;
  readonly height: number;
  readonly sources: {
    readonly low: string;
    readonly mobile: string;
    readonly large: string;
    readonly desktop: string;
  };
  /** `srcset` para `<img>`/`<source>`: largura real do ficheiro, não em CSS. */
  readonly srcset: string;
  /** Ficheiro de origem sem `<picture>` — o maior, para o caso de fallback. */
  readonly src: string;
}

function frame(id: HeroFrameId): HeroFrame {
  const low = `/hero/inovare/${id}-960.webp`;
  const mobile = `/hero/inovare/${id}-mobile.webp`;
  const large = `/hero/inovare/${id}-1440.webp`;
  const desktop = `/hero/inovare/${id}.webp`;

  return {
    id,
    width: WIDTH_DESKTOP,
    height: 941,
    sources: { low, mobile, large, desktop },
    srcset:
      `${low} ${WIDTH_LOW}w, ${mobile} ${WIDTH_MOBILE}w, ` +
      `${large} ${WIDTH_LARGE}w, ${desktop} ${WIDTH_DESKTOP}w`,
    src: desktop,
  };
}

/** Ordem de scroll. O índice 0 é sempre a imagem base, sem JavaScript. */
export const heroFrames = [
  frame('frame-01'),
  frame('frame-02'),
  frame('frame-03'),
  frame('frame-04'),
  frame('frame-05'),
] as const satisfies readonly HeroFrame[];

/** Frame 1: cartaz de marca. O texto da marca está gravado na imagem. */
export const heroBaseAlt =
  'Fachada da moradia no estado inicial, com a marca Inovare Pintura sobreposta.';

/** Frame 5: estado final. Descrito uma vez em texto, para leitores de ecrã. */
export const heroResultAlt =
  'Fachada da mesma moradia concluída, com acabamento em ocre e molduras claras ao entardecer.';

/* Estados de scroll, em fração do percurso da secção.
 *
 * As fatias seguem o briefing do cliente. A última (0.78–1.00) é a mais longa
 * porque é onde o nome, a promessa e o contacto aparecem e precisam de tempo
 * de leitura: o reveal só termina em 0.84, deixando ~16% de scroll parado
 * sobre a casa final.
 */
export const heroBeats = [
  { text: 'Preparar é onde começa o acabamento.', start: 0.18, end: 0.38 },
  { text: 'Cada detalhe conta.', start: 0.38, end: 0.58 },
  { text: 'A transformação torna-se visível.', start: 0.58, end: 0.78 },
] as const;

/** Início de cada crossfade, em fração do percurso. */
export const heroReveals = [0.12, 0.32, 0.52, 0.72] as const;

/** Duração de cada crossfade. Sobrepõe as fatias sem nunca abrir um vazio. */
export const heroFade = 0.12;

/** Ampliação máxima do push-in contínuo.
 *
 * O valor é limitado pelo topo, não pela aesthetics. Ancorado à base da
 * imagem (ver `transform-origin` em globals.css), um scale de 1,025 cortava
 * 2,5% de cima — e a marca gravada no frame 1 está a 12% da altura. A 1,012
 * corta 1,2% e o logo fica inteiro, mantendo a sensação de que a câmara
 * avança. Acima de ~1,03 já parece zoom e o topo já não se recupera. */
export const heroMaxScale = 1.012;