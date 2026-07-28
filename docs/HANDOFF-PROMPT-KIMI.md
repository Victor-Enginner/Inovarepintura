# Prompt de continuação — Inovare Pintura

> Cola tudo o que está abaixo da linha no Kimi K3, com o OpenCode aberto na
> raiz do repositório.

---

## Quem és e o que vais fazer

És o engenheiro responsável por lapidar e finalizar o site da **Inovare
Pintura**, uma empresa real de pintura e remodelação em Olhão, Algarve,
Portugal. O site vai ser publicado e usado para receber pedidos de orçamento.
Não é um protótipo.

A fundação já está construída e a funcionar. O teu trabalho é **acabamento**:
verificar o que nunca foi visto, corrigir o que estiver mal, e fechar as
lacunas listadas no fim. Não recomeces nada, não troques a stack, não
reescrevas o que já passa nas verificações.

---

## Estado atual do projeto

**Stack:** Next.js 16 (App Router, Turbopack), React 19, TypeScript strict,
Tailwind CSS 4 (configuração CSS-first com `@theme`), Vitest + Testing
Library, ESLint 9. Gestor de pacotes: **npm**. Deploy previsto: Netlify.

**Já implementado e verificado:**

- Abertura cinematográfica controlada pelo scroll (`src/components/cinematic/CinematicIntro.tsx`)
  — uma timeline, dois renderers: vídeo com scrub em ecrã largo, sequência de
  24 frames WebP no resto. Texto em túnel de zoom guiado pelo scroll.
- Galeria de trabalhos reais (`src/components/gallery/RealWorkGallery.tsx`)
  com filtros, `<dialog>` nativo como lightbox e carrossel magnético como
  camada de melhoria em ecrãs com rato preciso.
- Hero, faixa de prova, serviços, processo, área de serviço, CTA final,
  rodapé, CTA fixo no telemóvel.
- SEO local: JSON-LD `HomeAndConstructionBusiness`, `sitemap.ts`, `robots.ts`,
  metadata e Open Graph.
- Camada de analytics por delegação de eventos, sem provider (`src/lib/analytics.tsx`).
- Pipelines de assets reproduzíveis: `scripts/build-cutscene-assets.sh` e
  `scripts/build-gallery-assets.mjs`.

**Métricas atuais:** 190,1 KB de JS inicial (gzip), 5,3 KB de CSS.
`lint`, `typecheck`, 20 testes e `build` passam todos.

**Documentação de referência:** `docs/` (lê `docs/04-COPY-PT-PT.md` para a
copy aprovada e `docs/decisions/` para as decisões de arquitetura e as
questões pendentes do cliente).

---

## Regras invioláveis

Estas não são preferências de estilo. Quebrar qualquer uma delas cria risco
legal, perde tráfego ou engana o cliente final.

1. **Não publicar a fotografia `real-005`** (`05-edificio-trabalho-em-altura.jpg`).
   Mostra um trabalhador identificável e o consentimento não foi obtido. Está
   marcada com `publicationNeedsConsent: true` em `data/assets.json` e
   excluída por `publishableImages` em `src/content/gallery.ts`. Há um teste
   que trava se isso mudar. Não o contornes.

2. **Não inventar factos.** É proibido escrever, sob qualquer forma:
   avaliações ou testemunhos, número de clientes ou de obras, anos de
   experiência, garantias, certificações, tempo de resposta, "orçamento
   gratuito", "líder no Algarve", "os melhores". Se não está em
   `docs/00-PROJECT-SOURCE-OF-TRUTH.md` ou `data/project-data.json`, não
   existe.

3. **Não rotular nada como "antes e depois"** enquanto o cliente não
   confirmar que cada par de fotografias é a mesma obra. Estão marcados com
   `pairNeedsConfirmation: true`.

4. **Contactos vêm sempre de `data/project-data.json`**, através de
   `src/content/site.ts`. Nunca escrevas um número, e-mail ou URL à mão num
   componente. O e-mail, o WhatsApp e o Instagram continuam marcados
   `needsConfirmation: true` — não os atives por tua iniciativa.

5. **Não regridas a acessibilidade.** Concretamente: todas as fotografias são
   `<img>` com `alt` real (nunca `background-image`); tudo o que é clicável é
   `<button>` ou `<a>`; alvos de toque com pelo menos 44 px; o anel de foco
   nunca é turquesa sobre fundo claro (só dá 2,66 de contraste, abaixo do
   mínimo de 3,0); animações respeitam `prefers-reduced-motion`.

6. **Não adiciones bibliotecas sem justificação medida.** O orçamento de JS
   já está no teto. Não instales GSAP, framer-motion, nem bibliotecas de
   galeria ou de carrossel — tudo isso já foi resolvido com código próprio,
   de propósito. Se achares que precisas de uma, explica primeiro o custo em
   KB gzip e o que ela resolve que 60 linhas não resolvem.

7. **Não gerar o logo nem o favicon por IA.** A marca é do cliente. As
   referências em `assets/brand/` servem para vetorização manual, não para
   recriação.

---

## Português europeu — especificação obrigatória

**Toda a interface é em português de Portugal.** Não é "português com
sotaque": há diferenças de vocabulário, gramática e ortografia que um
português nota imediatamente e que fazem o site parecer estrangeiro — o que,
num negócio local de confiança, custa credibilidade.

### Gramática

| Errado (pt-BR) | Correto (pt-PT) |
|---|---|
| Estamos **fazendo** a preparação | Estamos **a fazer** a preparação |
| Vamos **pintando** por etapas | Vamos **a pintar** / pintamos por etapas |
| Fale **conosco** | Fale **connosco** |
| **Nos** contacte | Contacte-**nos** |
| **Te** ajudamos | Ajudamo-**lo** / ajudamos **o cliente** |
| Para **você** | Para **si** |
| Com **você** | **Consigo** |
| O **seu** projeto (com "você") | O **seu** projeto (com "o senhor"/impessoal) |

Regra prática do gerúndio — **atenção, é mais subtil do que parece**: o que
muda é apenas a construção **progressiva** (estar/andar/ir + gerúndio). Aí
pt-PT usa **"a" + infinitivo**: "estamos **a** preparar", nunca "estamos
preparando".

O gerúndio **adverbial continua correto e natural** em português europeu:
"Preparámos a superfície, **evitando** fissuras", "Trabalhamos por etapas,
**garantindo** o acabamento". Não os elimines — eliminá-los produz português
artificial. Corrige só a forma progressiva.

Regra prática dos clíticos: em pt-PT o pronome vai depois do verbo
(**ênclise**) em frases afirmativas — "Ligue-nos", "Contacte-nos",
"Enviamos-lhe". O pt-BR antepõe ("Nos ligue"), o que soa errado em Portugal.

### Ortografia

| Errado (pt-BR) | Correto (pt-PT) |
|---|---|
| conta**t**o | conta**c**to |
| fa**t**o (no sentido de facto) | fa**c**to |
| **ú**mido | **h**úmido |
| rece**p**ção | rece**ç**ão |

Atenção: `contacto` e `facto` mantêm o **c** em Portugal mesmo depois do
Acordo Ortográfico. É dos erros mais visíveis.

### Vocabulário geral

| Errado (pt-BR) | Correto (pt-PT) |
|---|---|
| tela | ecrã |
| arquivo | ficheiro |
| celular | telemóvel |
| time | equipa |
| banheiro | casa de banho |
| xícara | chávena |
| ônibus | autocarro |
| trem | comboio |
| sorvete | gelado |
| geladeira | frigorífico |
| grama (relva) | relva |
| café da manhã | pequeno-almoço |

### Vocabulário do setor (crítico neste projeto)

| Errado (pt-BR) | Correto (pt-PT) |
|---|---|
| **reforma** (de casa) | **remodelação** / obras |
| **encanamento** | **canalização** |
| **drywall** / gesso acartonado | **pladur** |
| **massa corrida** | **betume** / barramento |
| **tinta látex** | **tinta plástica** |
| **selador** | **primário** |
| esquadrias | **caixilharia** |
| piso (superfície) | **pavimento** / chão |

**Não "corrijas" estas** — são idênticas nas duas variantes e já estão certas
no site: *acabamento, andaime, fachada, impermeabilização, isolamento
térmico, pintura, reparação, orçamento, obra, parede, teto, telhado,
azulejo*.

### Formatos

- Telefone: `+351 913 411 051` (espaços, como está em `project-data.json`).
- Código postal: `8700-434` (quatro dígitos, hífen, três dígitos).
- Data: `DD/MM/AAAA`.
- Decimais com **vírgula**: `2,5 s`, não `2.5 s`.
- Moeda, se alguma vez for usada: `1 250 €` (símbolo depois, com espaço).

### Como verificar

Antes de dares uma tarefa por terminada, corre este varrimento sobre os
ficheiros que tocaste:

```bash
grep -rnE "conosco|contato|você|celular|encanamento|drywall|úmido" src/
grep -rnE "\b(estamos|estão|está|estou|vamos|vai) [a-zà-ú]+ndo\b" src/
```

O primeiro procura vocabulário e ortografia do Brasil. O segundo procura
**apenas a construção progressiva** — repara que exige o verbo auxiliar
antes, precisamente para não assinalar gerúndios adverbiais, que são
corretos. Ambos devem devolver vazio.

A copy aprovada em `docs/04-COPY-PT-PT.md` já está em pt-PT correto — usa-a
como referência de tom e como fonte para qualquer texto novo.

---

## Tarefas, por ordem de prioridade

### 1. Verificação visual em telemóvel (nunca foi feita)

Todo o site foi validado por estrutura HTML, testes e build — **mas ninguém o
viu num ecrã pequeno**. É o maior risco aberto, e é onde está a maior parte
do tráfego de um negócio local.

Corre `npm run dev` e verifica, com a janela abaixo de 1024 px e num
telemóvel real:

- A cutscene usa o renderer de **frames** (não vídeo) — confirma que a
  transformação branco → ocre acontece ao rolar e que os 24 frames trocam sem
  saltos nem ecrã branco.
- O texto do túnel de zoom não sai do ecrã nem fica ilegível.
- O botão "Saltar introdução" é alcançável e funciona.
- O CTA fixo no fundo não tapa conteúdo nem o rodapé.
- A galeria mostra a **grelha** (não o carrossel magnético) e o `<dialog>`
  abre e fecha bem ao toque.
- Nada provoca scroll horizontal.

Corrige o que estiver mal. Regista o que encontraste.

### 2. Verificação do carrossel magnético em desktop

Em ecrã largo com rato, a galeria vira uma fila de barras que crescem à
passagem do cursor. Nunca foi visto. As constantes de geometria estão no topo
de `src/components/gallery/RealWorkGallery.tsx` (`BAR_COLLAPSED_W`,
`BAR_HOVER_W`, `BAR_COLLAPSED_H`, `BAR_HOVER_H`, `BAR_GAP`, `INFLUENCE`).

Verifica: dez barras a 96 px mais espaçamentos dão cerca de 1100 px — confirma
que não transborda em ecrãs de 1280 px, que a navegação por Tab magnetiza a
barra focada, e que o efeito desaparece corretamente ao filtrar por uma
categoria com poucas fotografias.

### 3. Página 404

Não existe `src/app/not-found.tsx`. Cria uma, em pt-PT, sóbria, com ligação
para a página inicial e para o telefone. Sem humor e sem imagens pesadas.

### 4. Testes end-to-end

Não há cobertura para o `<dialog>` da galeria nem para o scroll da cutscene —
o jsdom não simula nenhum dos dois de forma fiável. Instala Playwright e
cobre, no mínimo:

- abrir uma fotografia, navegar com as setas, fechar com `Escape`, e
  confirmar que o foco regressa ao botão que a abriu;
- mudar de filtro e confirmar que a contagem anunciada muda;
- rolar pela cutscene e confirmar que o "Saltar introdução" leva ao hero;
- percorrer a página inteira só com o teclado, sem ficar preso;
- correr `axe` nas secções principais.

Acrescenta o script `test:e2e` ao `package.json`.

### 5. Caso destacado (antes / durante / depois)

Falta a secção `FeaturedBeforeAfter` prevista na arquitetura — provavelmente
a mais persuasiva do site. As fotografias da moradia ocre são
`real-010` (durante, com andaime) e `real-011` (resultado em ocre).

**Enquanto o cliente não confirmar** que são a mesma intervenção
(`pairNeedsConfirmation: true`), apresenta-as lado a lado com as legendas
reais de cada uma, **sem** slider e **sem** afirmar que são a mesma obra.
Assim que a confirmação chegar, converte num comparador acessível — que tem
de funcionar com teclado, não só com arrasto do rato.

### 6. Revisão de copy em português europeu

Passa por todos os textos visíveis (`src/app/page.tsx`,
`src/components/**`, `src/content/site.ts`) aplicando a especificação de
pt-PT acima. Confirma também que nada contradiz
`docs/04-COPY-PT-PT.md` e que nenhuma frase proibida entrou.

### 7. Acessibilidade e desempenho, com números

Corre uma auditoria a sério e regista os valores, não impressões:

- `axe` sem violações críticas ou sérias;
- Lighthouse em mobile e desktop;
- confirma LCP ≤ 2,5 s, CLS ≤ 0,10, INP ≤ 200 ms, ou documenta porque não.

Presta atenção especial ao vídeo da cutscene (7,4 MB): ele **não pode**
bloquear o LCP. Se estiver a bloquear, atrasa-o.

---

## O que NÃO fazer

- Não mexer em `scripts/build-cutscene-assets.sh` nem em
  `scripts/build-gallery-assets.mjs` sem necessidade — os derivados atuais
  foram gerados e medidos (o vídeo desktop está em CRF 29 por comparação de
  SSIM; a remoção de EXIF protege a localização das casas dos clientes).
- Não versionar `source-assets/` — são os masters de vídeo, propositadamente
  fora do Git.
- Não alterar a paleta sem recalcular contrastes. As variantes `teal-700`
  (`#0D7C7A`) e `copper-700` (`#9E6128`) existem porque as cores base falham
  AA quando carregam texto.
- Não converter componentes de servidor em componentes client sem motivo. Só
  três precisam de ser client: a cutscene, a galeria e o listener de
  analytics.

---

## Verificação antes de dares qualquer coisa por concluída

```bash
npm run verify   # corre lint + typecheck + test + build de seguida
```

Ou, individualmente:

```bash
npm run lint        # 0 erros, 0 avisos
npm run typecheck   # 0 erros
npm run test        # todos passam
npm run build       # compila e prerenderiza
```

Além disso: viste a alteração no browser, em mobile **e** desktop; não há
erros na consola; e o orçamento de JS não subiu de forma significativa (mede
os scripts que a home carrega, em gzip).

Ao terminar cada tarefa, diz de forma directa o que fizeste, o que
verificaste, e o que **não** conseguiste verificar. Se algo ficou por
confirmar, diz que ficou — não escrevas que está feito quando não está.

---

## Dados que continuam por confirmar com o cliente

Estão em `docs/decisions/CLIENT-ISSUES.md`. Não os resolvas por adivinhação;
se uma tarefa depender de um deles, para e assinala.

Os dois que mais custam: o **e-mail** e o **WhatsApp** continuam por validar,
por isso o site hoje só oferece telefone. Muita gente prefere escrever a
ligar.
