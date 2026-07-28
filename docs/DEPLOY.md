# Deploy — Inovare Pintura

Runbook do deploy para Netlify. Segue a ordem: rascunho primeiro, produção
depois de veres o resultado.

## Pré-requisitos, uma vez só

O CLI da Netlify **não** é dependência deste projeto — entra em conflito de
peer dependencies com o Next (`@opentelemetry/api`). Instala-o globalmente:

```bash
npm install -g netlify-cli
netlify login
```

O `netlify login` abre o browser. Depois disso a credencial fica em
`~/.netlify` e todos os comandos abaixo funcionam.

## 1. Criar e ligar o site

```bash
netlify init
```

Escolhe **"Create & configure a new site"**. O `netlify.toml` já traz o
comando de build, a pasta de publicação e o plugin do Next — aceita o que ele
propuser. Anota o URL que te devolve (algo como
`inovare-pintura.netlify.app`).

## 2. Definir o URL público

Isto alimenta o `canonical`, o Open Graph e o `sitemap.xml`. **Sem isto o
site anuncia um domínio que não é o dele**, o que confunde a indexação desde
o primeiro dia.

Substitui pelo URL real que o passo anterior devolveu:

```bash
netlify env:set NEXT_PUBLIC_SITE_URL https://inovare-pintura.netlify.app
```

Quando houver domínio próprio, repete este comando com o novo endereço e
volta a publicar. É a única alteração necessária.

## 3. Deploy de rascunho

```bash
netlify deploy --build
```

Devolve um URL temporário que **não** afeta produção nem é indexado. Abre-o e
confirma, no telemóvel e no computador:

- a abertura cinematográfica corre ao rolar;
- o botão "Saltar introdução" funciona;
- a galeria abre e fecha fotografias;
- os botões de telefone e WhatsApp abrem as aplicações certas;
- não há erros na consola.

## 4. Produção

Só depois de aprovares o rascunho:

```bash
netlify deploy --build --prod
```

## 5. Depois de publicar

```bash
curl -s https://SEU-URL/robots.txt
curl -s https://SEU-URL/sitemap.xml
```

Confirma que ambos apontam para o URL certo. Depois submete o sitemap no
Google Search Console e liga o Google Business Profile ao site — é isso que
faz a empresa aparecer nas pesquisas locais de Olhão.

## Verificação antes de qualquer deploy

```bash
npm run verify   # lint + typecheck + testes + build
npx playwright test
```

## Bloqueadores conhecidos

- **CLIENT-04 continua aberto:** a fotografia `real-005`
  (`05-edificio-trabalho-em-altura.jpg`) mostra um trabalhador identificável
  e está excluída do site por falta de consentimento. Publicar sem esse
  consentimento é um problema legal, não uma questão de gosto. Há um teste
  que trava se alguém a tentar incluir.
- **CLIENT-05:** os pares de fotografias ainda não podem ser rotulados
  "antes e depois" — falta confirmar que cada par é a mesma obra.
- **Sem favicon próprio:** o separador do browser mostra o ícone genérico.
  Precisa da vetorização do logo a partir de `assets/brand/`. Não deve ser
  gerado por IA.

## Reverter

Na Netlify, em **Deploys**, abre um deploy anterior e usa
**"Publish deploy"**. Volta atrás em segundos, sem passar pelo Git.
