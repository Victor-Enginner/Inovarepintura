# 06 — Motion e scrollytelling

## Objetivo

Fazer o visitante sentir a transformação de uma obra real antes de revelar o
site, sem scroll-jacking, sem bloquear contacto e sem transformar a introdução
num vídeo decorativo.

## Timeline normalizada

| Progresso | Cena | Imagem | Ação |
|---:|---|---|---|
| 0.00–0.16 | Estado inicial | `02-scroll-frame-inicial-antes.png` | entrada suave e push-in |
| 0.14–0.34 | Preparação | `03-scroll-frame-pintura-em-andamento.png` | crossfade e pequeno deslocamento |
| 0.32–0.53 | Acabamento | `04-scroll-frame-acabamento-quase-concluido.png` | estabilização e aumento de luz |
| 0.51–0.70 | Execução/assinatura | `05-execucao-tecnica-pintura.png` | detalhe técnico |
| 0.68–0.84 | Resultado | `01-hero-institucional-final.png` | revelação do acabamento real |
| 0.82–0.95 | Splash | `06-splash-transicao-marca.png` | máscara cobre a viewport |
| 0.94–1.00 | Interface | `PrimaryHero` | splash abre e deixa a UI visível |

As sobreposições deliberadas evitam flashes e gaps.

## Texto por cena

- 0.05: “Antes da cor, há uma história.”
- 0.21: “Preparar é onde começa o acabamento.”
- 0.40: “Cada detalhe conta.”
- 0.62: “A transformação torna-se visível.”
- 0.77: “Inovare Pintura.”

No máximo uma frase visível. Não gravar texto nos PNGs.

## Implementação preferida

1. secção com altura de scroll;
2. stage `position: sticky; top: 0; height: 100svh`;
3. imagens em camadas `absolute; inset: 0`;
4. `picture` com derivados responsivos;
5. timeline que controla `autoAlpha`, `scale` e `object-position`;
6. splash como overlay/máscara;
7. conteúdo real já presente no DOM abaixo da introdução;
8. botão skip desloca para `#inicio` e restaura foco.

## Não usar

- scrub do MP4 original como implementação primária;
- canvas com todos os frames em memória;
- scroll suavizado que altera comportamento nativo;
- som automático;
- loader sem informação;
- WebGL como requisito para abrir o site.

## Mobile

- duração reduzida;
- crops específicos;
- no máximo três transições se memória/decode forem limitados;
- ocultar instrução “scroll” depois da primeira interação;
- respeitar safe areas;
- sem cursor líquido.

## Reduced motion

Quando `prefers-reduced-motion: reduce`:

- não pin;
- não scrub;
- mostrar resultado final ou hero;
- splash opcional com fade ≤ 200 ms;
- manter botão e navegação utilizáveis.

## Fallback

Sem JS:

- intro escondida;
- hero e contacto renderizados;
- galeria como grid;
- imagens e texto acessíveis.

## Critérios de aceite

- nenhum flash branco/preto entre cenas;
- sem imagem esticada;
- sem salto ao terminar pin;
- skip funciona por rato, teclado e touch;
- Back/Forward não reinicia de forma errática;
- rotação do telemóvel não quebra timeline;
- 30 minutos de navegação não deixam listeners duplicados;
- animação mantém fluidez num telemóvel médio;
- LCP não depende de carregar todos os frames.

## Métricas internas

Registar:

- intro carregada;
- intro completa;
- intro saltada;
- reduced motion ativo.

Não usar estas métricas para bloquear ou personalizar conteúdo sensível.

