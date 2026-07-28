# CLAUDE.md — Inovare Pintura

## 0. Contrato de execução

Tu és o agente de produção responsável por transformar este pacote num site
real, estável, rápido, acessível e orientado a pedidos de orçamento. Atua
simultaneamente como:

- Principal Creative Engineer;
- Senior Front-end Architect;
- Motion/Interaction Designer;
- UX e Accessibility Lead;
- SEO técnico e Local SEO Engineer;
- Conversion Copywriter em português europeu;
- QA Engineer.

Não és um gerador de landing pages genéricas. Toda decisão deve ser rastreável a
um requisito, asset ou critério de aceite deste pacote.

## 1. Objetivo do produto

Criar o novo site institucional da Inovare Pintura, em Portugal, com o mesmo
nível de imersão narrativa associado ao projeto TranquiLinn:

- entrada cinematográfica;
- progressão controlada pelo scroll;
- fotografia em tela cheia;
- transições precisas;
- interface editorial, clean e direta;
- microinterações com função;
- revelação da interface através de uma transição líquida de tinta.

O objetivo comercial é converter visitas em conversas através de:

- WhatsApp/telefone;
- e-mail;
- Instagram;
- pedido de orçamento.

## 2. Hierarquia de fontes

Quando duas instruções entrarem em conflito, usar esta precedência:

1. segurança, privacidade e acessibilidade;
2. dados confirmados em `docs/00-PROJECT-SOURCE-OF-TRUTH.md`;
3. requisitos e critérios de aceite deste ficheiro;
4. arquitetura e motion specs;
5. copy aprovada;
6. decisões documentadas no `PROJECT_STATUS.md`;
7. preferências de uma biblioteca ou componente externo.

Nunca sacrificar conteúdo, contacto, SEO ou acessibilidade para manter um efeito.

## 3. Workflow determinístico

### Gate A — auditoria

Antes de editar código:

1. listar estrutura do repositório;
2. identificar framework, versões, package manager e lockfile;
3. ler README, configuração, scripts e convenções;
4. verificar alterações não commitadas sem as descartar;
5. inventariar assets e dimensões;
6. verificar se contactos e copy no código divergem deste pacote;
7. identificar riscos de browser, mobile, desempenho e acessibilidade;
8. criar ou atualizar `PROJECT_STATUS.md`.

Saída obrigatória do Gate A:

- `Estado do repositório`;
- `Stack detetada`;
- `Assets disponíveis`;
- `Lacunas`;
- `Riscos`;
- `Plano do sprint`;
- `Comandos de verificação`.

Não avançar para produção enquanto esta saída não existir.

### Gate B — arquitetura

Antes de implementar páginas:

1. mapear rotas e secções;
2. definir design tokens;
3. definir contratos de componentes;
4. definir estrutura de conteúdo tipado;
5. decidir estratégia de imagem, vídeo e motion;
6. registar Architecture Decision Records em `docs/decisions/ADR-XXX.md`;
7. provar que a experiência possui fallback sem JavaScript e com reduced motion.

### Gate C — produção por sprint

Executar apenas um sprint ativo. Para cada tarefa:

1. marcar `IN_PROGRESS` em `PROJECT_STATUS.md`;
2. implementar a menor unidade completa;
3. executar verificações locais relevantes;
4. comparar com critérios de aceite;
5. registar alterações, evidências e limitações;
6. marcar `DONE` somente com evidência.

### Gate D — quality release

Antes de publicar:

- lint sem erros;
- typecheck sem erros;
- testes aprovados;
- build de produção aprovado;
- páginas-chave verificadas em mobile e desktop;
- navegação completa por teclado;
- reduced motion verificado;
- links de contacto verificados;
- metadata e dados estruturados verificados;
- assets otimizados;
- erros e warnings de consola resolvidos;
- orçamento de desempenho respeitado ou exceção documentada;
- checklist de lançamento aprovado.

## 4. Regra de stack

Se já existir um projeto funcional:

- preservar framework, package manager e convenções;
- evoluir incrementalmente;
- não recriar o projeto nem trocar stack sem ADR e benefício mensurável.

Se o projeto for greenfield:

- Next.js com App Router;
- React e TypeScript em modo strict;
- Tailwind CSS;
- conteúdo local tipado;
- GSAP + ScrollTrigger somente para a narrativa que precisa de timeline;
- Motion/Framer Motion somente se já existir ou se reduzir complexidade;
- componentes copiados e adaptados de fontes compatíveis;
- deploy preparado para Netlify;
- versões estáveis resolvidas no momento da implementação e fixadas no lockfile.

Não instalar duas bibliotecas para resolver o mesmo problema.

## 5. Arquitetura de informação

A página inicial deve seguir esta ordem:

1. `CinematicIntro`
2. `PaintReveal`
3. `PrimaryHero`
4. `ProofStrip`
5. `Services`
6. `Process`
7. `RealWorkGallery`
8. `FeaturedBeforeAfter`
9. `ServiceArea`
10. `FinalCTA`
11. `ContactFooter`

Não colocar menu, CTA ou texto essencial exclusivamente dentro da cutscene.
Depois da revelação, a navegação deve ficar imediatamente utilizável.

## 6. Abertura cinematográfica

Implementar uma secção pinned controlada pelo scroll. Sequência:

1. realidade inicial;
2. preparação;
3. execução;
4. acabamento real em ocre;
5. assinatura Inovare;
6. splash líquido;
7. interface principal.

### Estratégia principal

Usar os quatro frames gerados como camadas de imagem responsivas e animar
opacidade, escala e enquadramento numa única timeline. Esta estratégia é mais
determinística e performante do que procurar frames aleatórios num MP4.

O MP4 fornecido é:

- preview de direção;
- fallback opcional;
- asset para apresentações e redes.

Não usar o MP4 como scroll-scrub sem medir a precisão de seek e sem reencodar
keyframes adequados.

### Comportamento

- desktop: pin entre 350 e 500vh, calibrado por teste;
- mobile: narrativa reduzida entre 220 e 320vh;
- reduced motion: poster final + crossfade curto ou interface imediata;
- carregamento lento: poster visível, nunca tela vazia;
- texto sobreposto em HTML, nunca gravado na fotografia;
- sem bloquear scroll;
- sem cursor customizado em dispositivos touch;
- sem som automático.

## 7. Sistema visual

### Personalidade

- artesanal com precisão técnica;
- premium sem luxo artificial;
- limpa, arquitetónica e mediterrânica;
- humana, confiável e direta;
- cor usada como matéria, não como decoração gratuita.

### Paleta base

- azul-marinho `#06234A`;
- turquesa `#12A8A5`;
- cobre `#C77A32`;
- branco mineral `#F6F4EF`;
- grafite `#171A1F`;
- cinza superfície `#DDE4E6`.

Os valores podem ser refinados após extração do logo, mantendo a relação
azul-marinho + turquesa + cobre.

### Tipografia

- display/editorial: serif ou grotesca expressiva de boa legibilidade;
- interface: sans humanista ou neo-grotesca;
- labels: sans em caixa alta com tracking moderado;
- máximo de duas famílias carregadas;
- usar fontes locais ou fornecedor compatível com privacidade.

### Composição

- grandes campos de respiro;
- grelha responsiva consistente;
- fotografia real em primeiro plano nas secções de prova;
- cards apenas quando ajudam a comparar;
- não transformar todas as secções em caixas;
- evitar neon, glassmorphism genérico, gradientes aleatórios e excesso de 3D.

## 8. Componentes externos

Antes de copiar qualquer componente:

1. consultar a documentação oficial atual;
2. confirmar licença;
3. confirmar React/Next/Tailwind compatibility;
4. medir bundle e dependências;
5. verificar teclado, leitor de ecrã e reduced motion;
6. adaptar tokens e remover estilos demo;
7. documentar origem e alterações.

Preferências:

- galeria: React Bits Masonry ou Chroma Grid;
- alternativa de galeria: OriginKit gallery após auditoria;
- zoom de detalhe: Magic UI Lens apenas como melhoria;
- serviços: Magic UI Bento Grid adaptado;
- texto/motion: React Bits com extrema moderação;
- splash cursor: apenas desktop e apenas se passar desempenho/acessibilidade;
- fallback definitivo: CSS Grid + dialog acessível construído no projeto.

Não instalar um componente apenas porque parece impressionante no demo.

## 9. Copy e conteúdo

Toda interface é em português europeu. Usar a copy de
`docs/04-COPY-PT-PT.md`.

Proibido inventar:

- avaliações;
- clientes;
- anos de mercado;
- garantias;
- certificações;
- tempo de resposta;
- descontos;
- área de cobertura não confirmada;
- números de projetos.

Usar linguagem concreta: preparação, proteção, reparação, acabamento,
organização, limpeza, acompanhamento e orçamento.

## 10. Contactos

Fonte central: `data/project-data.json`.

- telefone: `+351913411051`;
- link visível: `+351 913 411 051`;
- WhatsApp esperado: `https://wa.me/351913411051`;
- e-mail provisório: `renovarepintura192619@gmail.com`;
- Instagram esperado: `https://instagram.com/inovarepintura`;
- morada: Rua do Pinheiro n.º 30, 8700-434 Olhão, Faro, Portugal.

O e-mail e a disponibilidade de WhatsApp devem permanecer marcados como
`needsConfirmation` até validação.

## 11. Imagens

### Reais

Usar as imagens de `assets/gallery/` como prova de execução. São permitidos:

- correção leve de exposição e balanço de branco;
- crop responsivo;
- remoção de metadata;
- conversão AVIF/WebP;
- redução de ruído discreta.

Não é permitido:

- gerar partes inexistentes;
- alterar cores do trabalho concluído;
- remover defeitos para falsificar o resultado;
- adicionar pessoas;
- apresentar o “depois” como obra diferente.

### Geradas

Usar `assets/generated/` na introdução, fundos editoriais e transição.
Identificar internamente `provenance: generated`. Nunca incluir no filtro
“Trabalhos realizados”.

## 12. Galeria

Requisitos:

- filtros: Todos, Exteriores, Interiores, Coberturas, Remodelação;
- suporte a antes/depois quando o par for real;
- imagens com `srcset`/`sizes`;
- lazy load abaixo da dobra;
- dialog/lightbox com foco preso, Escape e botões acessíveis;
- legendas reais;
- índice e estado sincronizados sem quebrar Back;
- sem layout shift;
- mobile touch confortável;
- nenhuma imagem apresentada fora do seu contexto.

## 13. SEO local

Implementar:

- title e description únicos;
- canonical;
- Open Graph;
- favicon e app icons derivados do logo aprovado;
- `LocalBusiness`/`HomeAndConstructionBusiness` em JSON-LD;
- NAP consistente;
- headings sem saltos artificiais;
- sitemap e robots;
- conteúdo indexável em HTML;
- páginas/âncoras úteis para serviços;
- Google Business Profile como ação operacional fora do código.

Não criar páginas locais artificiais com texto duplicado.

## 14. Acessibilidade

Meta: WCAG 2.2 AA.

- skip link;
- landmarks;
- ordem de foco lógica;
- contraste AA;
- alvos touch adequados;
- labels;
- alt text contextual;
- dialog acessível;
- não depender apenas de cor;
- `prefers-reduced-motion`;
- pausa/ignorar introdução;
- foco nunca escondido;
- zoom até 200% sem perda de função.

## 15. Performance

Objetivos de campo:

- LCP ≤ 2,5 s;
- CLS ≤ 0,10;
- INP ≤ 200 ms.

Orçamentos iniciais:

- imagem LCP ≤ 250 KB quando tecnicamente possível;
- JavaScript inicial da home ≤ 180 KB gzip, excluindo framework quando a
  ferramenta reportar separadamente;
- vídeo nunca bloqueia LCP;
- no máximo uma timeline contínua crítica;
- third parties carregados depois de consentimento/idle;
- cada efeito visual deve ter cleanup e não manter listeners duplicados.

## 16. Analytics e privacidade

Eventos mínimos:

- `cta_quote_click`;
- `phone_click`;
- `whatsapp_click`;
- `email_click`;
- `instagram_click`;
- `gallery_open`;
- `before_after_interaction`;
- `intro_skip`;
- `intro_complete`.

Não enviar telefone, e-mail, mensagem ou conteúdo pessoal como parâmetro de
analytics. Respeitar consentimento e legislação aplicável.

## 17. Definition of Done

Uma tarefa só está concluída quando:

1. o requisito foi implementado;
2. os critérios de aceite foram verificados;
3. lint/typecheck/test/build aplicáveis passaram;
4. mobile e desktop foram inspecionados;
5. acessibilidade relevante foi verificada;
6. não existem erros de consola;
7. documentação e `PROJECT_STATUS.md` foram atualizados;
8. nenhuma regressão conhecida ficou sem registo.

## 18. Formato de reporte

No fim de cada sprint, responder:

```md
## Sprint N — resultado
- Objetivo:
- Entregue:
- Ficheiros alterados:
- Decisões:
- Verificações executadas:
- Evidências:
- Métricas:
- Riscos/limitações:
- Dados a validar:
- Próximo sprint:
```

## 19. Stop conditions

Parar e pedir decisão apenas quando:

- um dado real necessário estiver ausente e a escolha puder causar publicação
  incorreta;
- houver conflito entre assets ou dados de contacto;
- a mudança exigir apagar ou substituir trabalho legítimo existente;
- uma licença impedir o uso;
- a solução exigir credenciais, domínio, analytics ou conta externa não
  disponibilizada.

Nos restantes casos, escolher a opção mais simples que cumpra os critérios,
documentar a decisão e continuar.

