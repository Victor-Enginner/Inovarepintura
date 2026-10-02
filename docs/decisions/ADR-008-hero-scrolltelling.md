# ADR-008 — Hero scrolltelling de cinco frames

## Estado

Aceite

## Contexto

A abertura do site era um `CinematicIntro` com um MP4 de 11,2 s scrubado por
scroll no desktop e 24 frames WebP no telemóvel (9,9 MB em `public/cutscene/`).
Cumpre a §6 do `CLAUDE.md`, mas é um vídeo de construção — o resultado final
não aparece com nitidez e a resolução disponível é a do MP4.

O cliente entregou cinco frames mestres da mesma casa
(`assets/generated/hero-scroll/`): marca, preparação, início de pintura,
pintura avançada e casa concluída. Mediu-se o alinhamento entre eles: desvio
máximo de 10 px em 1672 de largura. São a mesma vista em momentos diferentes,
que é o que permite ler a sequência como transformação e não como slideshow.

## Restrições que decidiram o desenho

1. **Os masters têm 1672×941.** O briefing pedia derivados de 2560 px e 3840
   px; a §11 proíbe upscale. Ficou a largura nativa como teto e o limite foi
   documentado como gargalo, não tapado com pixels inventados.
2. **GSAP foi instalado** (3.15.0) por decisão do cliente, revogando a
   conclusão de não o usar que estava em ADR-006. O `CinematicIntro` e o
   respetivo ADR-006 mantêm-se no repositório como histórico e fallback.
3. **Sem AVIF.** Os AVIF do pacote pesavam ~5× o WebP (14,8 MB contra
   2,87 MB). Ficou WebP q90, medido como o joelho da curva: 34,9 dB PSNR
   contra o master, 26% mais leve que q96.
4. **O frame 1 tem a marca gravada na imagem.** Só ele. Os frames 2–5 são
   fotografia pura. Consequências: nenhum texto em HTML por cima do frame 1,
   e o `@next/next/no-img-element` fica desligado à mão neste ficheiro.

## Opções

### Opção A — `pin: true` do ScrollTrigger

É a receita habitual. Rejeitada: o briefing também pedia `position: sticky`, e
os dois mechanismos a prender o mesmo elemento ao viewport ao mesmo tempo
produzem um espaçador a dobrar e saltos de scroll no iOS. O pin ficou a ser o
`sticky` do contentor — que funciona sem JavaScript — e o ScrollTrigger ficou
só a traduzir scroll em progresso.

### Opção B — crossfade simétrico, todas as camadas animadas

Animar opacidade a descer e a subir em todas as camadas custa o dobro do
trabalho por frame e abre uma janela em que nenhuma camada está opaca. Rejeitada.

### Opção C — revelação por camadas, base fixa

A imagem base nunca sai de baixo e cada frame entra por `opacity` de 0 a 1 por
cima. Como a camada de cima chega a opaca, o resultado visual é o de um
crossfade simétrico com metade do trabalho, e não existe um único instante em
que o ecrã fique vazio ou preto — o que era um requisito explícito.

## Decisão

Opção C, com GSAP ScrollTrigger em `scrub: 1`, `pin` desativado e um
push-in contínuo de `1 → 1.025` ancorado na base da imagem.

- **A base nunca sai.** É o elemento LCP, é o que se vê sem JavaScript e é o
  que garante a ausência de preto.
- **Os frames 2–5 não têm `src` no HTML.** Se tivessem, o browser descarregava
  os cinco antes do LCP. Quem os pede é JavaScript: o 2 no primeiro momento
  ocioso, os restantes em cadeia, e todos à frente quando o scroll se aproxima.
- **`html.js` é posta por um script inline no `<head>`.** A altura de 500vh
  (360svh em ecrã estreito) só existe com JavaScript. Sem ele, o hero é um
  ecrã estático com o nome e o contacto à vista, sem salto de layout.
- **Movimento reduzido** não corre timeline: `<source media>` no `<picture>`
  faz o browser pedir o frame 5 no parse, e nem o frame 1 nem o MP4 são
  descarregados.
- **O MP4** é só fallback sem JavaScript, dentro de `<noscript>`.
- **O véu vive no contentor do texto**, não numa camada por cima: com uma
  camada por cima não existe cor pintada atrás das letras, e o verificador de
  contraste mede contra o fundo da página. O contraste do hero passa a ser
  verificado a partir dos píxeis renderizados.

## Consequências

- positivas: transformacão contínua e não slideshow; zero preto; LCP só com
  o frame 1; CLS 0; funciona sem JavaScript e com movimento reduzido;
  5,6 MB de derivados para 20 ficheiros, dos quais se carrega 1 a 2 por visita.
- negativas: GSAP + ScrollTrigger acrescentam cerca de 30 KB gzip ao JS inicial
  da home, que passa a depender de revisão do orçamento de §15.
- mitigação: `CinematicIntro` e os seus 9,9 MB continuam no repositório, por
  isso a reversão é um commit.
- **gargalo conhecido**: em ecrãs 2560×1440 e 3840×2160 a imagem é ampliada
  1,53× e 2,30× pelo browser. Não há como evitar sem masters maiores.

## Evidência

`Inovare_Hero_Scrolltelling_Package.zip` (SHA256SUMS verificado, 29/29);
medições de PSNR e de peso em `docs/07-HERO-ASSETS.md`; CLS 0 e sequência de
frames verificadas em `e2e/hero.spec.ts`.