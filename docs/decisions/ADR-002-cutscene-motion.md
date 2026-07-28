# ADR-002 — Estratégia de motion da cutscene

## Estado

**Substituído pelo [ADR-006](ADR-006-cutscene-hibrida-v2.md)** (2026-07-28).

A premissa deste ADR — "o MP4 disponível não tem keyframes preparados para
seek" — deixou de ser verdadeira quando o cliente forneceu o master v2, com
56 keyframes a intervalos de 0,200 s verificados. O ADR-006 documenta as
medições e a decisão híbrida que substitui esta.

## Contexto

A abertura cinematográfica (`CLAUDE.md` §6) precisa de uma sequência pinned
controlada por scroll. Temos 6 PNGs gerados (1672×941) e 1 MP4 de 9,5 s como
preview. É preciso decidir entre animar as camadas de imagem ou usar o MP4
como scroll-scrub.

## Critérios

- acessibilidade (reduced motion, sem travar scroll);
- desempenho (LCP, JS inicial, sem bloquear pela decodificação de vídeo);
- manutenção;
- compatibilidade;
- custo de implementação.

## Opções

### Opção A — Camadas de imagem + timeline GSAP/ScrollTrigger

Anima opacidade, escala e enquadramento dos 6 PNGs numa única timeline.
Determinístico, sem custo de seek/decode de vídeo, fácil de calibrar por
breakpoint, funciona com poster imediato em reduced motion.

### Opção B — MP4 como scroll-scrub

Visualmente mais "cinemático" contínuo, mas o `CLAUDE.md` proíbe usá-lo sem
medir precisão de seek e sem reencodar keyframes adequados — trabalho extra
sem asset de vídeo preparado para isso (o MP4 atual é preview de 9,5 s a
4,5 Mbps, sem keyframes pensados para scrub).

## Decisão

Opção A, conforme já determinado no `CLAUDE.md` §6 ("Estratégia principal").
O MP4 fica apenas como fallback opcional/preview de direção e para redes
sociais.

## Consequências

- positivas: mais performático e previsível; melhor fallback com reduced
  motion e rede lenta;
- negativas: menos fluido do que vídeo nativo contínuo;
- mitigação: crossfades e easing cuidados na timeline para simular
  continuidade;
- fallback: poster final estático quando `prefers-reduced-motion` ou
  carregamento lento.

## Evidência

`CLAUDE.md` §6; dimensões e bitrate medidos nesta sessão
(`assets/generated/inovare-cutscene-abertura-v1.mp4`: 9,5 s, ~4,56 Mbps).
