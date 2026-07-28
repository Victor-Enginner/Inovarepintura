'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';

/* Abertura cinematográfica.
 *
 * Uma timeline, dois renderers (ADR-006): o progresso de scroll é calculado
 * uma vez; só muda quem o desenha. Desktop faz scrub de vídeo; mobile troca
 * frames empilhados.
 *
 * Sem GSAP. Isto é "mapear scroll para um número entre 0 e 1" — GSAP +
 * ScrollTrigger custariam ~50 KB gzip por 60 linhas de código, e a home já
 * está no teto do orçamento de JS.
 */

const VIDEO_SRC = '/cutscene/desktop/cutscene-1080p.mp4';
const FRAME_COUNT = 24;
const DURATION = 11.2;

const FRAMES = Array.from(
  { length: FRAME_COUNT },
  (_, i) => `/cutscene/mobile/f${String(i + 1).padStart(2, '0')}.webp`,
);

/* Mapeamento não-linear de scroll para tempo.
 *
 * Medido no master: os primeiros 1,8 s são visualmente estáticos. Com
 * mapeamento linear o visitante gastaria 16% da altura do pin sem ver nada
 * mudar e leria isso como avaria. Aqui a janela morta leva 8% do scroll e a
 * transformação (1,8–6,5 s), que é o beat que comunica o serviço, leva 47%.
 */
const KEYS: ReadonlyArray<readonly [progress: number, seconds: number]> = [
  [0.0, 0.0],
  [0.08, 1.8],
  [0.55, 6.5],
  [0.8, 9.3],
  [1.0, DURATION],
];

function progressToTime(p: number): number {
  for (let i = 1; i < KEYS.length; i++) {
    const prev = KEYS[i - 1]!;
    const curr = KEYS[i]!;
    if (p <= curr[0]) {
      const span = curr[0] - prev[0];
      const ratio = span === 0 ? 0 : (p - prev[0]) / span;
      return prev[1] + ratio * (curr[1] - prev[1]);
    }
  }
  return DURATION;
}

/* Texto sobreposto em HTML, nunca gravado na imagem — assim escala, traduz-se
 * e é lido por leitores de ecrã. Copy aprovada. */
const BEATS = [
  { at: 0.0, text: 'Antes da cor, há uma história.' },
  { at: 0.2, text: 'Preparar é onde começa o acabamento.' },
  { at: 0.42, text: 'Cada detalhe conta.' },
  { at: 0.62, text: 'A transformação torna-se visível.' },
  { at: 0.84, text: 'Inovare Pintura.' },
] as const;

/* Cada frase ocupa a fatia de scroll até à seguinte. */
const BEAT_RANGES = BEATS.map((beat, i) => ({
  text: beat.text,
  start: beat.at,
  end: BEATS[i + 1]?.at ?? 1,
}));

/* Quanto a frase cresce ao passar pela câmara. O componente original da
 * OriginKit usava 35, pensado para uma palavra curta num painel isolado; com
 * frases inteiras sobre fotografia isso é só borrão e trabalho de composição
 * a mais. 9 dá a mesma sensação de rasgo sem custar frames. */
const MAX_SCALE = 9;

/* Túnel de zoom guiado pelo scroll, não por temporizador.
 *
 * É a diferença face ao Infinite Text Passage: ali um `setTimeout` trocava as
 * palavras sozinho, o que aqui dessincronizaria o texto da imagem. A fase de
 * leitura (u entre 0,22 e 0,68) existe para a frase ficar parada e legível
 * antes de partir.
 */
function tunnelStyle(p: number, start: number, end: number): React.CSSProperties {
  const u = (p - start) / (end - start);
  if (u < -0.02 || u > 1) return { opacity: 0, visibility: 'hidden' };

  let scale: number;
  let opacity: number;

  if (u < 0.22) {
    const k = Math.max(0, u) / 0.22;
    scale = 0.35 + 0.65 * k;
    opacity = k;
  } else if (u < 0.68) {
    scale = 1;
    opacity = 1;
  } else {
    const k = (u - 0.68) / 0.32;
    scale = 1 + (MAX_SCALE - 1) * k * k; // acelera a saída
    opacity = 1 - k;
  }

  return { opacity, transform: `scale(${scale})`, willChange: 'transform, opacity' };
}

type Renderer = 'none' | 'frames' | 'video';

/* A escolha do renderer é estado do browser, não do React — por isso é lida
 * com useSyncExternalStore em vez de setState dentro de um efeito. Além de
 * evitar o problema de hidratação, reage a alterações: redimensionar a janela
 * ou ligar "reduzir movimento" no sistema troca o renderer na hora.
 *
 * Vídeo só onde compensa: ecrã largo, sem reduced motion e sem Save-Data. Em
 * tudo o resto entram os frames (940 KB contra 7,4 MB) — que é também onde o
 * seek do Safari iOS seria instável.
 */
const REDUCED = '(prefers-reduced-motion: reduce)';
const WIDE = '(min-width: 1024px)';

function subscribeToEnvironment(onChange: () => void): () => void {
  const queries = [window.matchMedia(REDUCED), window.matchMedia(WIDE)];
  for (const q of queries) q.addEventListener('change', onChange);
  return () => {
    for (const q of queries) q.removeEventListener('change', onChange);
  };
}

function readRenderer(): Renderer {
  if (window.matchMedia(REDUCED).matches) return 'none';
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
    .connection;
  const wide = window.matchMedia(WIDE).matches;
  return wide && connection?.saveData !== true ? 'video' : 'frames';
}

/* No servidor e no primeiro render: 'none'. Só o poster, nunca ecrã vazio. */
const serverRenderer = (): Renderer => 'none';

export function CinematicIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const seekTarget = useRef(0);
  const rafId = useRef<number | null>(null);

  const renderer = useSyncExternalStore(
    subscribeToEnvironment,
    readRenderer,
    serverRenderer,
  );
  const [progress, setProgress] = useState(0);

  /* Progresso do scroll sobre a secção. Um listener passivo alimenta um rAF;
   * o trabalho por evento é uma leitura de rect e uma divisão. */
  useEffect(() => {
    if (renderer === 'none') return;

    let ticking = false;

    const measure = () => {
      ticking = false;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewport = stickyRef.current?.offsetHeight ?? window.innerHeight;
      const scrollable = rect.height - viewport;
      if (scrollable <= 0) return;
      const p = Math.min(1, Math.max(0, -rect.top / scrollable));
      setProgress(p);
      seekTarget.current = progressToTime(p);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [renderer]);

  /* Scrub do vídeo.
   *
   * `currentTime` é atribuído dentro de um rAF e só quando o alvo mudou o
   * suficiente — atribuir a cada evento de scroll faz o decoder engasgar. O
   * limiar é metade do intervalo de keyframes (0,2 s), por isso cada seek cai
   * praticamente sempre num keyframe. */
  useEffect(() => {
    if (renderer !== 'video') return;

    const loop = () => {
      const video = videoRef.current;
      if (video && video.readyState >= 1) {
        const target = seekTarget.current;
        if (Math.abs(video.currentTime - target) > 0.1) {
          video.currentTime = target;
        }
      }
      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);
    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [renderer]);

  const skip = useCallback(() => {
    /* A âncora já leva a página ao hero sozinha; isto só acrescenta o foco,
     * para quem navega por teclado não ficar preso na introdução. */
    const hero = document.getElementById('hero');
    /* Move o foco, não só a página: sem isto o teclado continuaria dentro da
     * introdução depois de a saltar. */
    hero?.focus({ preventScroll: true });
  }, []);

  const activeFrame = Math.min(
    FRAME_COUNT - 1,
    Math.round((progressToTime(progress) / DURATION) * (FRAME_COUNT - 1)),
  );

  return (
    <section
      ref={sectionRef}
      aria-label="Apresentação: a transformação de uma fachada"
      className="relative h-[260svh] motion-reduce:h-[100svh] lg:h-[400svh] lg:motion-reduce:h-[100svh]"
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-[100svh] overflow-hidden bg-navy-900"
      >
        {/* Poster: visível sempre por baixo, para nunca haver ecrã vazio
         * enquanto o vídeo ou os frames carregam. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/cutscene/poster/inicial-1280.webp"
          alt="Fachada de moradia antes do trabalho de pintura exterior."
          className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
          fetchPriority="high"
        />

        {/* Com reduced motion não há narrativa: mostra-se o resultado. A troca
         * é feita por media query para funcionar sem JavaScript. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/cutscene/poster/resultado-1280.webp"
          alt="Fachada de moradia com acabamento em ocre e molduras claras."
          className="absolute inset-0 hidden h-full w-full object-cover motion-reduce:block"
        />

        {renderer === 'video' && (
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            poster="/cutscene/poster/inicial-1280.webp"
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {renderer === 'frames' &&
          FRAMES.map((src, i) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={src}
              src={src}
              alt=""
              aria-hidden="true"
              loading="eager"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ opacity: i === activeFrame ? 1 : 0 }}
            />
          ))}

        {/* Escurece o topo e o fundo o suficiente para o texto branco passar
         * contraste sobre o céu claro, sem toldar a fachada ao centro. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-navy-900/55 via-transparent to-navy-900/45"
        />

        {/* O texto vive no céu, no terço superior: é a zona limpa em todos os
         * frames, e deixa a fachada — que é o assunto — desobstruída. */}
        <div className="absolute inset-x-0 top-[22%] flex justify-center px-(--spacing-gutter)">
          {renderer === 'none' ? (
            /* Reduced motion: frase final, parada e legível. */
            <p className="max-w-3xl text-center font-display text-2xl text-mineral-50 lg:text-4xl">
              {BEATS[4].text}
            </p>
          ) : (
            <div className="relative w-full max-w-3xl">
              {BEAT_RANGES.map((beat) => (
                <p
                  key={beat.text}
                  style={tunnelStyle(progress, beat.start, beat.end)}
                  className="absolute inset-x-0 top-0 text-center font-display text-2xl text-mineral-50 drop-shadow-[0_2px_12px_rgba(6,35,74,0.65)] lg:text-4xl"
                >
                  {beat.text}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Sempre presente: em reduced motion a secção é um ecrã só e a
         * âncora continua a ser a saída natural para o conteúdo. */}
        <div className="on-dark absolute right-(--spacing-gutter) top-6 flex items-center gap-4">
            <div
              className="hidden h-1 w-24 overflow-hidden rounded-pill bg-mineral-50/30 sm:block"
              role="presentation"
            >
              <div
                className="h-full bg-teal-500"
                style={{ transform: `scaleX(${progress})`, transformOrigin: 'left' }}
              />
            </div>
            <a
              href="#hero"
              onClick={skip}
              data-analytics="intro_skip"
              className="inline-flex min-h-11 items-center rounded-md border border-mineral-50/40 px-4 text-sm font-semibold text-mineral-50 no-underline hover:bg-mineral-50/10"
            >
              Saltar introdução
            </a>
        </div>
      </div>
    </section>
  );
}
