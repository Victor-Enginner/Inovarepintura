#!/usr/bin/env bash
# Gera os derivados da cutscene a partir do master em source-assets/.
#
# O master NÃO é versionado (ver ADR-006 e .gitignore). Esta receita é a
# fonte de verdade reproduzível: quem tiver o master consegue regenerar
# byte-a-byte os assets que o site serve.
#
# Uso:  ./scripts/build-cutscene-assets.sh
# Requer: ffmpeg com libx264 e libwebp.

set -euo pipefail

SRC="source-assets/inovare-cutscene-v2-scroll-web.mp4"
OUT="assets/cutscene"

[ -f "$SRC" ] || { echo "ERRO: master ausente em $SRC (não é versionado)"; exit 1; }

mkdir -p "$OUT/desktop" "$OUT/mobile" "$OUT/poster"

# ── Desktop: vídeo com scrub ────────────────────────────────────────────
# g=6/keyint_min=6 a 30fps => keyframe a cada 0.2s, preservando a
# densidade do master (o que torna o seek preciso).
# CRF 29 escolhido por medição: SSIM 0.9748 a 7.4 MB; CRF 27 só ganha
# 0.006 de SSIM e custa +1.8 MB.
echo "→ desktop 1080p CRF29 (scrub)"
ffmpeg -v error -y -i "$SRC" \
  -c:v libx264 -profile:v high -crf 29 -preset slow \
  -g 6 -keyint_min 6 -sc_threshold 0 \
  -pix_fmt yuv420p -an -movflags +faststart \
  "$OUT/desktop/cutscene-1080p.mp4"

# ── Mobile: sequência de frames em WebP ─────────────────────────────────
# 24 frames uniformes (~2.14 fps) a 720px. Sem seek, sem decode de vídeo:
# o canvas desenha o frame correspondente ao progresso de scroll.
echo "→ mobile: 24 frames WebP 720px"
rm -f "$OUT/mobile"/f*.webp
ffmpeg -v error -y -i "$SRC" \
  -vf "fps=24/11.2,scale=720:-2" -c:v libwebp -quality 76 \
  "$OUT/mobile/f%02d.webp"

# ── Posters ─────────────────────────────────────────────────────────────
# t=0.0  → primeiro frame; candidato a LCP, mostrado antes de qualquer
#          motion e enquanto o vídeo/frames carregam (nunca ecrã vazio).
# t=9.0  → resultado ocre limpo, ANTES do splash. É este que aparece com
#          prefers-reduced-motion: o splash é um dispositivo de transição,
#          não o resultado do trabalho.
echo "→ posters (t=0.0 inicial, t=9.0 resultado)"
for spec in "0.0:inicial" "9.0:resultado"; do
  t="${spec%%:*}"; name="${spec##*:}"
  for w in 768 1280 1920; do
    # A 1920 o JPEG passa dos 250 KB de orçamento LCP (§15) com q=4;
    # q=5 mantém-no abaixo sem diferença visível a essa dimensão.
    [ "$w" -ge 1920 ] && jq=5 || jq=4
    ffmpeg -v error -y -ss "$t" -i "$SRC" -frames:v 1 \
      -vf "scale=$w:-2" -c:v libwebp -quality 82 \
      "$OUT/poster/${name}-${w}.webp"
    ffmpeg -v error -y -ss "$t" -i "$SRC" -frames:v 1 \
      -vf "scale=$w:-2" -q:v $jq \
      "$OUT/poster/${name}-${w}.jpg"
  done
done

echo
echo "── Resultado ──"
du -sh "$OUT"/desktop "$OUT"/mobile "$OUT"/poster
