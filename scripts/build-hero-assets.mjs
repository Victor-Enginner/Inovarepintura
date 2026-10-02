/* Gera os derivados web dos 5 frames mestres do hero scrolltelling.
 *
 * Os PNGs originais ficam em assets/generated/hero-scroll/ e nunca são
 * servidos: são 3,2–3,5 MB cada e não são necessários em runtime.
 *
 * Regras que este script impõe (CLAUDE.md §11/§15 e o briefing do cliente):
 *   - sem upscale. O master tem 1672px; 1672 é o teto, mesmo em ecrãs 4K.
 *     Um derivado maior seria pixels inventados.
 *   - sem JPEG. Fotografia de entardecer com gradientes largos banding em
 *     JPEG; WebP com subsampling inteligente não tem esse problema.
 *   - sem AVIF. Os AVIF que vieram no pacote Pesavam ~5x mais que o WebP.
 *   - peso. q90 foi medido como o joelho da curva: 34,9 dB PSNR contra o
 *     master, 26% mais leve que q96. Medições em docs/07-HERO-ASSETS.md.
 *
 * Uso: node scripts/build-hero-assets.mjs
 */

import { copyFile, mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'assets/generated/hero-scroll';
const OUT = 'public/hero/inovare';

/* LARGURAS = candidatos de srcset, do mais baixo ao mais alto.
 * 1672 é a largura nativa do master. 960 é o candidato baixo: num viewport
 * de 390px com DPR 2,5 o browser pede ~975px, e é este ficheiro que entra
 * no LCP em vez dos 450KB do desktop.
 * 1440 existe por causa dos telemóveis com DPR 3: 430x932 x 3 = 1290px, que
 * sem este degrau saltava diretamente para os 1672px e carregava 100KB
 * a mais do que o ecrã consegue mostrar. */
const VARIANTS = [
  { suffix: '-960', width: 960 },
  { suffix: '-mobile', width: 1280 },
  { suffix: '-1440', width: 1440 },
  { suffix: '', width: 1672 },
];

const QUALITY = 90;

const FRAMES = [
  { file: '01-hero-branding.png', id: 'frame-01' },
  { file: '02-preparation.png', id: 'frame-02' },
  { file: '03-paint-start.png', id: 'frame-03' },
  { file: '04-paint-advanced.png', id: 'frame-04' },
  { file: '05-finished-house.png', id: 'frame-05' },
];

await mkdir(OUT, { recursive: true });

const available = new Set(await readdir(SRC));
const manifest = [];

for (const { file, id } of FRAMES) {
  if (!available.has(file)) {
    throw new Error(`Master em falta: ${path.join(SRC, file)}`);
  }

  const source = path.join(SRC, file);
  const meta = await sharp(source).metadata();
  const native = meta.width ?? 0;

  if (!native) throw new Error(`Largura ilegível em ${source}`);

  const variants = [];

  for (const { suffix, width } of VARIANTS) {
    /* Sem upscale: qualquer largura acima do master é recusada, não esticada. */
    const target = Math.min(width, native);
    const name = `${id}${suffix}.webp`;

    await sharp(source)
      .resize({ width: target, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 6, smartSubsample: true })
      .toFile(path.join(OUT, name));

    variants.push({ src: `/hero/inovare/${name}`, width: target });
  }

  manifest.push({ id, master: path.join(SRC, file), native, variants });
}

/* MP4: só é usado como fallback sem JavaScript (§6). Vai para public para
 * poder ser streaming; 9,2 MB fora do caminho crítico. */
const video = 'inovare-hero-fallback-1080p.mp4';
await copyFile(path.join(SRC, video), path.join(OUT, video));

await writeFile(
  path.join(OUT, 'manifest.json'),
  `${JSON.stringify({ quality: QUALITY, frames: manifest, video: `/hero/inovare/${video}` }, null, 2)}\n`,
);

console.log(
  `${FRAMES.length} frames x ${VARIANTS.length} variantes WebP (q${QUALITY}) + fallback de vídeo`,
);