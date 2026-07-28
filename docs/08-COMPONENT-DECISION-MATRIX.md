# 08 — Matriz de componentes

## Princípio

Selecionar pelo problema resolvido, não pelo efeito visual do demo. Copiar
apenas componentes cuja licença, compatibilidade, peso e acessibilidade forem
verificados na implementação.

## Fontes candidatas

- React Bits: https://www.reactbits.dev/
- Magic UI: https://magicui.design/
- OriginKit: https://www.originkit.dev/

Consultar documentação oficial atual; APIs podem mudar.

## Matriz

| Necessidade | Opção preferida | Alternativa | Fallback |
|---|---|---|---|
| galeria assimétrica | React Bits Masonry | OriginKit Gallery | CSS Grid |
| grelha editorial | React Bits Chroma Grid | Magic UI Bento Grid | CSS Grid |
| detalhe/zoom | Magic UI Lens | dialog custom | imagem normal |
| serviços | Magic UI Bento Grid adaptado | cards custom | lista sem cards |
| before/after | componente custom acessível | lib auditada | duas imagens lado a lado |
| reveal de texto | CSS/GSAP local | React Bits SplitText | sem animação |
| textura líquida | splash estático + mask | React Bits Splash Cursor | fade |
| faixa de prova | CSS marquee manual pausável | Magic UI Marquee | lista estática |

## Seleção recomendada para v1

### Galeria

Começar por React Bits Masonry ou Chroma Grid. Requisitos:

- sem dependência pesada de WebGL;
- layout estável;
- tab order coerente;
- botão semântico por imagem;
- dialog próprio acessível;
- filtros controlados no projeto.

OriginKit pode ser escolhido se a galeria tiver melhor comportamento mobile e
licença compatível. Documentar comparação no ADR.

### Services

Magic UI Bento Grid pode orientar a composição, mas:

- remover decoração genérica;
- usar ícones simples;
- não animar todos os cards;
- manter leitura linear no mobile.

### Lens

Usar apenas em desktop como melhoria. O lightbox deve funcionar sem Lens.

### Splash Cursor

Não é a transição principal. Só pode existir:

- depois da revelação;
- em ponteiro fino;
- com reduced motion desligado;
- com FPS e memória medidos;
- com botão/flag de feature;
- sem cobrir links ou texto.

## Scorecard obrigatório

Antes de aprovar componente, pontuar 0–2:

| Critério | Peso |
|---|---:|
| resolve requisito real | 3 |
| acessibilidade | 3 |
| desempenho | 3 |
| compatibilidade | 2 |
| facilidade de adaptação | 2 |
| licença/proveniência | 3 |
| comportamento mobile | 3 |
| manutenção | 2 |

Rejeitar abaixo de 28/42 ou se licença/acessibilidade receber zero.

## Registo

Cada componente externo deve ter comentário documental:

```txt
Source:
Retrieved:
License:
Original component:
Adaptations:
Dependencies:
Fallback:
```

