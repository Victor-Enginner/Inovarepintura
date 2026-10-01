/** Galeria real, derivada de `data/assets.json` (S1-T04).
 *
 * Invariante central do CLAUDE.md §11: só entra aqui o que tem
 * `provenance: 'real'`. As imagens de `assets/generated/` — incluindo os
 * frames da cutscene do ADR-006 — são atmosfera, não prova de trabalho, e
 * estão barradas em runtime pelo parser abaixo.
 */

import assetsData from '../../data/assets.json';
import type { GalleryCategory, GalleryImage, GalleryStage } from './types';

const CATEGORIES: ReadonlySet<string> = new Set([
  'exteriores',
  'interiores',
  'coberturas',
  'remodelacao',
]);

const STAGES: ReadonlySet<string> = new Set(['antes', 'durante', 'resultado']);

/** Valida uma entrada do JSON em vez de confiar nela.
 *
 * O JSON não é tipado à nascença: uma categoria mal escrita passaria
 * despercebida e a imagem desapareceria silenciosamente de todos os filtros.
 * Aqui, falha alto e cedo — no arranque do build, não em produção.
 */
function parseImage(raw: (typeof assetsData.gallery)[number]): GalleryImage | null {
  if (raw.provenance !== 'real') return null;

  if (!CATEGORIES.has(raw.category)) {
    throw new Error(`Galeria: categoria inválida "${raw.category}" em ${raw.id}`);
  }
  if (!STAGES.has(raw.stage)) {
    throw new Error(`Galeria: estágio inválido "${raw.stage}" em ${raw.id}`);
  }

  return Object.freeze({
    id: raw.id,
    src: raw.src,
    category: raw.category as GalleryCategory,
    stage: raw.stage as GalleryStage,
    title: raw.title,
    alt: raw.alt,
    provenance: 'real' as const,
    pairId: 'pairId' in raw ? raw.pairId : undefined,
    pairConfirmedAt: 'pairConfirmedAt' in raw ? raw.pairConfirmedAt : undefined,
    personVisible: 'personVisible' in raw ? raw.personVisible : undefined,
    consentConfirmedAt:
      'consentConfirmedAt' in raw ? raw.consentConfirmedAt : undefined,
  });
}

/** Todas as fotografias reais do dataset, incluindo as ainda não publicáveis. */
export const galleryImages: readonly GalleryImage[] = assetsData.gallery
  .map(parseImage)
  .filter((image): image is GalleryImage => image !== null);

/** As que podem efetivamente ser mostradas ao público.
 *
 * Regra do §11/docs/09: fotografia com pessoa identificável só publica com
 * consentimento confirmado (`consentConfirmedAt`). Fotos sem pessoas não
 * precisam do campo — publicam normalmente. `real-005` foi liberado em
 * 2026-09-30 (CLIENT-04); se entrar outra foto de pessoa sem consentimento,
 * fica barrada aqui em vez de fugir para produção. É esta a lista que a UI
 * consome — a de cima serve para inventário e testes.
 */
export const publishableImages: readonly GalleryImage[] = galleryImages.filter(
  (image) =>
    image.personVisible !== true || image.consentConfirmedAt !== undefined,
);

/** Filtros exigidos pelo §12, na ordem da copy aprovada (docs/04). */
export const galleryFilters = [
  { id: 'todos', label: 'Todos' },
  { id: 'exteriores', label: 'Exteriores' },
  { id: 'interiores', label: 'Interiores' },
  { id: 'coberturas', label: 'Coberturas' },
  { id: 'remodelacao', label: 'Remodelação' },
] as const;

export type GalleryFilterId = (typeof galleryFilters)[number]['id'];

/** Categorias com pelo menos uma foto publicável.
 *
 * CLIENT-07: "remodelacao" está nos filtros exigidos mas não tem fotos. Um
 * filtro que devolve sempre zero resultados é um beco sem saída, por isso a
 * UI usa isto para decidir o que mostrar. */
export const populatedCategories: ReadonlySet<GalleryCategory> = new Set(
  publishableImages.map((image) => image.category),
);

export function imagesByCategory(filter: GalleryFilterId): readonly GalleryImage[] {
  return filter === 'todos'
    ? publishableImages
    : publishableImages.filter((image) => image.category === filter);
}

/** Pares antes/depois da mesma obra.
 *
 * Devolve apenas os pares completos e publicáveis. O rótulo "antes/depois"
 * só pode ser usado depois de CLIENT-05 confirmar que cada par é a mesma
 * intervenção — `pairNeedsConfirmation` marca os que ainda não estão. */
export function pairedImages(): ReadonlyMap<string, readonly GalleryImage[]> {
  const pairs = new Map<string, GalleryImage[]>();
  for (const image of publishableImages) {
    if (image.pairId === undefined) continue;
    const group = pairs.get(image.pairId) ?? [];
    group.push(image);
    pairs.set(image.pairId, group);
  }
  return pairs;
}

/** Pares que ainda esperam confirmação do cliente (CLIENT-05).
 *
 * Resolvido em 2026-09-30 — os três pares existentes foram confirmados.
 * A função mantém-se como salvaguarda: um par novo sem `pairConfirmedAt`
 * aparece aqui e impede qualquer slider "antes/depois" prematuro. */
export function pairsAwaitingConfirmation(): readonly string[] {
  const awaiting = new Set<string>();
  for (const image of publishableImages) {
    if (image.pairId !== undefined && image.pairConfirmedAt === undefined) {
      awaiting.add(image.pairId);
    }
  }
  return [...awaiting];
}
