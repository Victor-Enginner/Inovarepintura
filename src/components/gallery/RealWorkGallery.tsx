'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import type { GalleryImage } from '@/content/types';

/* Galeria de trabalhos reais.
 *
 * Sem biblioteca externa: grelha CSS + <dialog> nativo. O <dialog> dá foco
 * preso, Escape e camada superior de borda — comportamento que uma lightbox
 * feita à mão costuma implementar mal.
 *
 * Em ecrã largo com rato preciso, a grelha passa a carrossel magnético
 * (barras que crescem à passagem do cursor, estilo dock do macOS). É uma
 * camada de apresentação: a marcação é a mesma nos dois modos, por isso as
 * fotografias continuam a ser <img> indexáveis, com alt, alcançáveis por
 * teclado e a abrir no mesmo diálogo.
 */

const WIDTHS = [480, 768, 1200] as const;

/* Geometria do modo magnético. As fotografias são verticais (3:4). */
const BAR_COLLAPSED_W = 96;
const BAR_HOVER_W = 230;
const BAR_COLLAPSED_H = 320;
const BAR_HOVER_H = 390;
const BAR_GAP = 14;
/** Raio de influência do cursor, em px. */
const INFLUENCE = 220;

/** "assets/gallery/01-nome.jpg" → "01-nome" */
function baseOf(src: string): string {
  return src.replace(/^.*\//, '').replace(/\.jpg$/, '');
}

function srcSet(base: string, ext: 'avif' | 'webp'): string {
  return WIDTHS.map((w) => `/gallery/${base}-${w}.${ext} ${w}w`).join(', ');
}

function Photo({
  image,
  sizes,
  eager,
}: {
  readonly image: GalleryImage;
  readonly sizes: string;
  readonly eager?: boolean;
}) {
  const base = baseOf(image.src);
  return (
    <picture>
      <source type="image/avif" srcSet={srcSet(base, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(base, 'webp')} sizes={sizes} />
      <img
        src={`/gallery/${base}-768.webp`}
        alt={image.alt}
        width={1152}
        height={1536}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="h-full w-full object-cover"
      />
    </picture>
  );
}

const STAGE_LABEL: Record<GalleryImage['stage'], string> = {
  antes: 'Antes',
  durante: 'Durante',
  resultado: 'Resultado',
};

/* O efeito magnético só faz sentido onde existe um cursor que se possa
 * aproximar. `pointer: fine` exclui ecrãs táteis — num telemóvel o hover ou
 * não existe ou fica "colado" depois do toque. Reduced motion desliga-o. */
const MAGNETIC_QUERY =
  '(hover: hover) and (pointer: fine) and (min-width: 1024px)';
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeToEnvironment(onChange: () => void): () => void {
  const queries = [
    window.matchMedia(MAGNETIC_QUERY),
    window.matchMedia(REDUCED_QUERY),
  ];
  for (const q of queries) q.addEventListener('change', onChange);
  return () => {
    for (const q of queries) q.removeEventListener('change', onChange);
  };
}

function readMagnetic(): boolean {
  return (
    window.matchMedia(MAGNETIC_QUERY).matches &&
    !window.matchMedia(REDUCED_QUERY).matches
  );
}

/* No servidor: grelha. É o modo acessível por omissão, e evita que a página
 * chegue ao cliente com uma fila de barras que o JS ainda não sabe medir. */
const serverMagnetic = () => false;

export function RealWorkGallery({
  images,
  filters,
}: {
  readonly images: readonly GalleryImage[];
  readonly filters: readonly { readonly id: string; readonly label: string }[];
}) {
  const [active, setActive] = useState('todos');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const magnetic = useSyncExternalStore(
    subscribeToEnvironment,
    readMagnetic,
    serverMagnetic,
  );

  const visible =
    active === 'todos' ? images : images.filter((i) => i.category === active);

  /* Animação fora do React.
   *
   * O componente original da OriginKit fazia setState a cada frame — um
   * re-render de toda a lista por frame. Aqui o efeito é dono dos seus
   * listeners e escreve direto no style dos elementos; o React não
   * re-renderiza enquanto o cursor se move.
   */
  useEffect(() => {
    if (!magnetic) return;
    const list = listRef.current;
    if (!list) return;

    const bars = Array.from(list.querySelectorAll<HTMLLIElement>('li'));
    if (bars.length === 0) return;

    const targets = bars.map(() => 0);
    const current = bars.map(() => 0);
    let raf: number | null = null;

    const paint = () => {
      let moving = false;
      for (let i = 0; i < bars.length; i++) {
        const diff = (targets[i] ?? 0) - (current[i] ?? 0);
        if (Math.abs(diff) > 0.001) {
          current[i] = (current[i] ?? 0) + diff * 0.2;
          moving = true;
        } else {
          current[i] = targets[i] ?? 0;
        }
        const f = current[i] ?? 0;
        const bar = bars[i];
        if (bar) {
          bar.style.width = `${BAR_COLLAPSED_W + (BAR_HOVER_W - BAR_COLLAPSED_W) * f}px`;
          bar.style.height = `${BAR_COLLAPSED_H + (BAR_HOVER_H - BAR_COLLAPSED_H) * f}px`;
        }
      }
      raf = moving ? requestAnimationFrame(paint) : null;
    };

    const start = () => {
      if (raf === null) raf = requestAnimationFrame(paint);
    };

    const onMove = (event: PointerEvent) => {
      const rect = list.getBoundingClientRect();
      const x = event.clientX - rect.left;

      /* Os centros são calculados sobre o layout colapsado, não sobre a
       * largura animada de cada barra. Se dependessem do tamanho atual, o
       * crescimento deslocaria os centros e o pico perseguir-se-ia a si
       * próprio — o resultado é tremido. */
      const totalBase = bars.length * BAR_COLLAPSED_W + (bars.length - 1) * BAR_GAP;
      const startX = (rect.width - totalBase) / 2;

      for (let i = 0; i < bars.length; i++) {
        const center = startX + i * (BAR_COLLAPSED_W + BAR_GAP) + BAR_COLLAPSED_W / 2;
        const f = Math.max(0, 1 - Math.abs(x - center) / INFLUENCE);
        targets[i] = f * f * (3 - 2 * f); // smoothstep
      }
      start();
    };

    const relax = () => {
      targets.fill(0);
      start();
    };

    /* O foco por teclado também magnetiza a barra: sem isto, quem navega com
     * Tab não teria qualquer indicação de posição na fila. */
    const onFocusIn = (event: FocusEvent) => {
      const li = (event.target as HTMLElement).closest('li');
      const index = li ? bars.indexOf(li as HTMLLIElement) : -1;
      if (index < 0) return;
      for (let i = 0; i < targets.length; i++) targets[i] = i === index ? 1 : 0;
      start();
    };

    list.addEventListener('pointermove', onMove);
    list.addEventListener('pointerleave', relax);
    list.addEventListener('focusin', onFocusIn);
    list.addEventListener('focusout', relax);

    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
      list.removeEventListener('pointermove', onMove);
      list.removeEventListener('pointerleave', relax);
      list.removeEventListener('focusin', onFocusIn);
      list.removeEventListener('focusout', relax);
      /* Limpa as medidas inline: ao trocar de filtro ou de modo os elementos
       * são outros e herdariam larguras de itens que já não existem. */
      for (const bar of bars) {
        bar.style.width = '';
        bar.style.height = '';
      }
    };
  }, [magnetic, visible.length]);

  const open = useCallback((index: number) => {
    setOpenIndex(index);
    dialogRef.current?.showModal();
  }, []);

  const close = useCallback(() => {
    dialogRef.current?.close();
    setOpenIndex(null);
  }, []);

  const step = useCallback(
    (delta: number) => {
      setOpenIndex((idx) => {
        if (idx === null) return idx;
        const next = idx + delta;
        return next < 0 || next >= visible.length ? idx : next;
      });
    },
    [visible.length],
  );

  /* Setas navegam entre fotos. Escape e o foco preso já vêm do <dialog>. */
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };
    const onClose = () => setOpenIndex(null);

    dialog.addEventListener('keydown', onKey);
    dialog.addEventListener('close', onClose);
    return () => {
      dialog.removeEventListener('keydown', onKey);
      dialog.removeEventListener('close', onClose);
    };
  }, [step]);

  const currentImage = openIndex === null ? null : visible[openIndex];

  return (
    <div>
      {/* Cada filtro é um botão com aria-pressed: o estado é anunciado, não
       * transmitido apenas pela cor (§14). */}
      <div role="group" aria-label="Filtrar trabalhos" className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const isActive = filter.id === active;
          return (
            <button
              key={filter.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActive(filter.id)}
              className={`inline-flex min-h-11 items-center rounded-pill border px-5 text-sm font-semibold transition-colors ${
                isActive
                  ? 'border-navy-900 bg-navy-900 text-white'
                  : 'border-border bg-transparent text-navy-900 hover:border-navy-900'
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* Contagem anunciada a leitores de ecrã ao mudar de filtro. */}
      <p aria-live="polite" className="mt-4 text-sm text-text-muted">
        {visible.length} {visible.length === 1 ? 'trabalho' : 'trabalhos'}
      </p>

      <ul
        ref={listRef}
        className={
          magnetic
            ? 'mt-8 flex items-center justify-center overflow-visible'
            : 'mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3'
        }
        style={magnetic ? { gap: BAR_GAP } : undefined}
      >
        {visible.map((image, index) => (
          <li
            key={image.id}
            className={magnetic ? 'shrink-0 overflow-hidden rounded-md' : undefined}
            style={
              magnetic
                ? { width: BAR_COLLAPSED_W, height: BAR_COLLAPSED_H }
                : undefined
            }
          >
            <button
              type="button"
              onClick={() => open(index)}
              data-analytics="gallery_open"
              className={
                magnetic
                  ? 'block h-full w-full text-start'
                  : 'group block w-full overflow-hidden rounded-md bg-surface-200 text-start'
              }
            >
              <span
                className={
                  magnetic
                    ? 'block h-full w-full overflow-hidden'
                    : 'block aspect-[3/4] overflow-hidden'
                }
              >
                <Photo
                  image={image}
                  eager={index < 3}
                  sizes={
                    magnetic
                      ? '230px'
                      : '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 380px'
                  }
                />
              </span>

              {/* As legendas só aparecem na grelha. No modo magnético as
               * barras são estreitas e o texto ficaria ilegível — o título
               * continua disponível no diálogo e no alt da imagem. */}
              {!magnetic && (
                <span className="block p-3">
                  <span className="block text-sm font-semibold text-navy-900">
                    {image.title}
                  </span>
                  <span className="mt-1 block text-xs uppercase tracking-(--tracking-label) text-text-muted">
                    {STAGE_LABEL[image.stage]}
                  </span>
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label="Fotografia ampliada"
        className="on-dark m-auto max-h-[92vh] w-[min(96vw,900px)] rounded-lg bg-navy-900 p-0 text-mineral-50 backdrop:bg-black/80"
      >
        {currentImage && (
          <div className="flex max-h-[92vh] flex-col">
            <div className="flex items-center justify-between gap-4 p-4">
              <p className="text-sm font-semibold">{currentImage.title}</p>
              <button
                type="button"
                onClick={close}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-mineral-50/40 px-4 text-sm font-semibold hover:bg-mineral-50/10"
              >
                Fechar
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element -- derivados já gerados no build (ADR-004); next/image otimizaria duas vezes */}
              <img
                src={`/gallery/${baseOf(currentImage.src)}-1200.webp`}
                alt={currentImage.alt}
                className="mx-auto h-full max-h-[70vh] w-auto object-contain"
              />
            </div>

            <div className="flex items-center justify-between gap-4 p-4">
              <button
                type="button"
                onClick={() => step(-1)}
                disabled={openIndex === 0}
                className="inline-flex min-h-11 items-center rounded-md border border-mineral-50/40 px-4 text-sm font-semibold disabled:opacity-40 hover:bg-mineral-50/10"
              >
                Anterior
              </button>
              <p className="text-xs text-mineral-50/70">
                {STAGE_LABEL[currentImage.stage]} · {openIndex! + 1} de {visible.length}
              </p>
              <button
                type="button"
                onClick={() => step(1)}
                disabled={openIndex === visible.length - 1}
                className="inline-flex min-h-11 items-center rounded-md border border-mineral-50/40 px-4 text-sm font-semibold disabled:opacity-40 hover:bg-mineral-50/10"
              >
                Seguinte
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
