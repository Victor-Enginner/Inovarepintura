/* Gera derivados web das fotografias reais.
 *
 * Os originais ficam em assets/gallery/ e nunca são servidos: têm EXIF
 * (potencialmente GPS da casa do cliente) e pesam mais do que é preciso.
 *
 * Uso: node scripts/build-gallery-assets.mjs
 */

import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'assets/gallery';
const OUT = 'public/gallery';
const WIDTHS = [480, 768, 1200];

await mkdir(OUT, { recursive: true });

const files = (await readdir(SRC)).filter((f) => f.endsWith('.jpg')).sort();
const manifest = [];

for (const file of files) {
  const base = path.basename(file, '.jpg');
  const image = sharp(path.join(SRC, file));
  const meta = await image.metadata();

  for (const width of WIDTHS) {
    // Nunca aumentar: o original tem 1152px de largura, por isso o derivado
    // de 1200 fica no tamanho real em vez de esticar.
    const target = Math.min(width, meta.width ?? width);

    await image
      .clone()
      .resize({ width: target, withoutEnlargement: true })
      // Sem .withMetadata(): o sharp descarta EXIF por omissão, o que é
      // exatamente o que queremos (GPS, modelo do telemóvel, data).
      .avif({ quality: 55 })
      .toFile(path.join(OUT, `${base}-${width}.avif`));

    await image
      .clone()
      .resize({ width: target, withoutEnlargement: true })
      .webp({ quality: 76 })
      .toFile(path.join(OUT, `${base}-${width}.webp`));
  }

  manifest.push({
    base,
    width: meta.width ?? null,
    height: meta.height ?? null,
  });
}

await writeFile(
  path.join(OUT, 'manifest.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

console.log(`${files.length} fotografias → ${WIDTHS.length * 2} derivados cada`);
