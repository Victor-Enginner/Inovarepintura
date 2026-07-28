# ADR-003 — Componente de galeria

## Estado

Proposto

## Contexto

`CLAUDE.md` §8 e §12 exigem filtros, suporte a antes/depois, lightbox
acessível e zero layout shift. As preferências listadas (React Bits
Masonry/Chroma Grid, OriginKit) ainda não foram auditadas quanto a licença,
bundle e acessibilidade (passo obrigatório do §8 antes de copiar qualquer
componente).

## Critérios

- acessibilidade (foco preso, Escape, navegação por teclado);
- desempenho (bundle, sem layout shift);
- manutenção;
- compatibilidade com Next.js/Tailwind;
- licença.

## Opções

### Opção A — CSS Grid + dialog acessível construído no projeto

Fallback definitivo já indicado no `CLAUDE.md` §8. Sem dependências externas,
controlo total sobre foco/teclado/Escape, zero risco de licença ou bundle
inesperado.

### Opção B — React Bits Masonry / Chroma Grid

Visualmente mais rico, mas exige a auditoria completa do §8 (licença,
bundle, teclado, reduced motion) antes de decidir — ainda não feita.

### Opção C — OriginKit gallery

Alternativa explícita do `CLAUDE.md`, mesma exigência de auditoria pendente.

## Decisão

Começar pela Opção A (fallback definitivo) na Sprint 4, para garantir uma
galeria acessível e sem dependências desde o primeiro release. Reavaliar
Opção B/C num ADR de atualização se, após a auditoria do §8, uma delas trouxer
benefício mensurável sem custo de acessibilidade/bundle.

## Consequências

- positivas: zero risco de licença/bundle; acessibilidade garantida por
  construção;
- negativas: menos polimento visual "out of the box" do que uma lib pronta;
- mitigação: aplicar motion leve (Intersection Observer/CSS) sobre a grid
  própria;
- fallback: já é o próprio fallback do `CLAUDE.md`.

## Evidência

`CLAUDE.md` §8, §12; inventário de 11 fotos reais em 3 categorias
(`PROJECT_STATUS.md`).
