'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { GalleryImage } from '@/content/types';

/* Galeria de trabalhos reais.
 *
 * Sem biblioteca externa: grelha CSS + <dialog> nativo. O <dialog> dá foco
 * preso, Escape e camada superior de borda — comportamento que uma lightbox
 * feita à mão costuma implementar mal.
 */

const WIDTHS = [480, 768, 1200] as const;

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

  const visible =
    active === 'todos' ? images : images.filter((i) => i.category === active);

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
      setOpenIndex((current) => {
        if (current === null) return current;
        const next = current + delta;
        if (next < 0 || next >= visible.length) return current;
        return next;
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

  const current = openIndex === null ? null : visible[openIndex];

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

      <ul className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {visible.map((image, index) => (
          <li key={image.id}>
            <button
              type="button"
              onClick={() => open(index)}
              data-analytics="gallery_open"
              className="group block w-full overflow-hidden rounded-md bg-surface-200 text-start"
            >
              {/* aspect-[3/4] fixo: as fotos são todas verticais e o rácio
               * declarado evita layout shift enquanto carregam. */}
              <span className="block aspect-[3/4] overflow-hidden">
                <Photo
                  image={image}
                  eager={index < 3}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 380px"
                />
              </span>
              <span className="block p-3">
                <span className="block text-sm font-semibold text-navy-900">
                  {image.title}
                </span>
                <span className="mt-1 block text-xs uppercase tracking-(--tracking-label) text-text-muted">
                  {STAGE_LABEL[image.stage]}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label="Fotografia ampliada"
        className="on-dark m-auto max-h-[92vh] w-[min(96vw,900px)] rounded-lg bg-navy-900 p-0 text-mineral-50 backdrop:bg-black/80"
      >
        {current && (
          <div className="flex max-h-[92vh] flex-col">
            <div className="flex items-center justify-between gap-4 p-4">
              <p className="text-sm font-semibold">{current.title}</p>
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
                src={`/gallery/${baseOf(current.src)}-1200.webp`}
                alt={current.alt}
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
                {STAGE_LABEL[current.stage]} · {openIndex! + 1} de {visible.length}
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
