# 10 — QA, performance e acessibilidade

## Viewports mínimos

- 320 × 568
- 390 × 844
- 430 × 932
- 768 × 1024
- 1024 × 768
- 1440 × 900
- 1920 × 1080

## Browsers

- Chrome/Edge atual;
- Firefox atual;
- Safari macOS;
- Safari iOS;
- Chrome Android.

## Fluxos E2E

1. entrar, saltar introdução, abrir WhatsApp;
2. concluir introdução, navegar a Serviços;
3. filtrar galeria e abrir imagem;
4. navegar lightbox apenas com teclado;
5. comparar antes/depois;
6. abrir telefone, e-mail e Instagram;
7. voltar no browser sem estado quebrado;
8. carregar com reduced motion;
9. carregar com JS desativado;
10. carregar em rede lenta.

## Acessibilidade manual

- Tab completo;
- Shift+Tab;
- Enter/Space;
- Escape em dialogs;
- zoom 200%;
- leitor de ecrã em headings/links;
- contraste;
- estado de foco;
- labels de ícones;
- ordem DOM versus visual;
- movimento reduzido;
- skip intro e skip content.

## Performance

### Métricas

- LCP ≤ 2,5 s;
- CLS ≤ 0,10;
- INP ≤ 200 ms;
- TTFB monitorizado;
- FPS da intro sem quedas prolongadas;
- memória estável depois de repetir intro/galeria.

### Testes

- Lighthouse mobile e desktop;
- WebPageTest ou equivalente para waterfall;
- bundle analyzer;
- teste com CPU/network throttling;
- Chrome Performance para timeline;
- imagens sem dimensões = falha;
- fontes sem estratégia de display = falha.

## Imagens

- AVIF/WebP;
- dimensions;
- responsive `sizes`;
- alt;
- lazy loading;
- priority somente LCP;
- EXIF removido;
- sem imagem original de vários MB no grid.

## Motion

- no máximo uma animação contínua crítica;
- cancelamento em unmount;
- sem layout thrashing;
- reduced motion;
- pausa/skip;
- transform/opacity;
- nenhuma interação depende de hover.

## Conteúdo

- PT-PT consistente;
- contactos iguais em toda parte;
- sem lorem ipsum;
- sem promessa sem prova;
- estágio “antes/durante/depois” correto;
- generated nunca rotulado como real.

## Severidade

- P0: bloqueia contacto, publicação ou expõe dado;
- P1: quebra função principal, acessibilidade crítica ou mobile;
- P2: degrada experiência, SEO ou performance;
- P3: polish.

Não lançar com P0/P1. P2 só com owner e prazo documentados.

## Evidências por release

- URL do preview;
- commit;
- outputs de lint/typecheck/test/build;
- screenshots mobile/desktop;
- relatório Lighthouse;
- relatório axe;
- checklist de contactos;
- lista de limitações.

