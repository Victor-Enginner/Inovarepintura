# Deploy — Inovare Pintura

Runbook de deploy e CI/CD. **Fluxo atual: push para `main` → CI valida →
Netlify publica automaticamente.** O Netlify CLI está instalado e a sessão
foi validada. Publicar pelo CLI é o plano B.

## Como funciona o pipeline (resumo)

1. `git push` para `main` (a partir do teu computador);
2. **GitHub Actions** corre o Gate D completo (lint, typecheck, testes,
   build, e2e) — `.github/workflows/ci.yml`;
3. **Netlify** deteta o push, corre o comando `npm run verify` declarado em
   `netlify.toml` (lint, types, unitários, build Next) e publica sozinha;
4. Se o CI falhar, o deploy da Netlify ainda acontece (são sistemas
   independentes), por isso o hábito é: olhar o ✗ no GitHub antes de
   considerar a alteração publicada de facto. Para hard block, usar PRs.

## 0. One-time: ligar GitHub → Netlify

Feito uma única vez, na conta do cliente (ou tua, se gerires):

1. Criar repositório GitHub e `git remote add origin <url>` + `git push`;
2. Em **app.netlify.com** → site `inovare-pintura` → *Site configuration →
   Build & deploy → Continuous deployment → Link repository* — escolher o
   repo GitHub;
3. A partir daí cada push a `main` publica sozinho. Deploys manuais pelo
   CLI continuam possíveis mas deixam de ser necessários.

> Nota: o site já existe na Netlify (siteId `62c8dc92-…`). Ao ligar o Git,
> os deploys passam a ser feitos a partir do repositório — o histórico de
> deploys CLI mantém-se intacto.

## 1. One-time: variáveis de ambiente na Netlify

Em *Site configuration → Environment variables* (ou via CLI):

O domínio de produção é `https://inovarepintura.com`. A variável
`NEXT_PUBLIC_SITE_URL` já está definida e foi confirmada via CLI. Verificar
sem expor o valor em logs desnecessários:

```bash
netlify env:get NEXT_PUBLIC_SITE_URL --context production
```

Quando houver uma migração de domínio futura, atualizar essa variável e
reconstruir o site antes de considerar a migração completa.

## 2. Deploy de rascunho (quando precisares de ver antes de publicar)

```bash
netlify deploy --build
```

Devolve um URL temporário (`*.netlify.app` com hash) que não afeta produção
nem é indexado.

## 3. Publicação manual (plano B)

```bash
npm run verify && npm run test:e2e      # Gate D local
netlify deploy --build --prod
```

## 4. Domínio próprio — estado atual e manutenção

O domínio `inovarepintura.com` foi comprado na Hostinger, delegado para
Netlify DNS, validado com SSL e definido como primário. Nameservers e
redirecionamentos já estão configurados; a receita abaixo só se aplica se
fizeres uma migração futura ou adicionares outro domínio.

### 4.1 Adicionar um domínio futuro

### 4.2 Apontar o domínio à Netlify

Na **Netlify** → *Domain management → Add a domain / Add a subdomain site*
→ adicionar o novo domínio. Não alteres o primário `inovarepintura.com` até
o novo domínio estar validado com DNS e HTTPS. A Netlify indica a estratégia
DNS apropriada; para o domínio existente já se usa Netlify DNS.

Na **Hostinger** (hPanel → Domains → DNS/Nameservers), apontar:

Segue os valores que o painel da Netlify indicar para o novo domínio.
Para o domínio atual, já estão delegados os nameservers Netlify DNS; os
registos autoritativos devem ser geridos na Netlify, não no DNS da Hostinger.

Ativar um único domínio primário e redirecionar os aliases para ele.
A Netlify emite SSL automaticamente depois de validar DNS; verificar HTTPS
antes de apontar tráfego ou anunciar o endereço.

### 4.3 Atualizar a env var e republicar

```bash
netlify env:set NEXT_PUBLIC_SITE_URL https://inovarepintura.com
```

Depois disparar um build (Netlify → Deploys → *Trigger deploy*) — ou fazer
`git push` depois de verificar que o deploy contínuo está ligado. Isto atualiza
canonical, Open Graph e sitemap para o domínio configurado.

### 4.4 Verificação pós-domínio

```bash
curl -s https://inovarepintura.com/robots.txt
curl -s https://inovarepintura.com/sitemap.xml
curl -sI https://inovarepintura.com | head -5   # esperar 200 + https
```

E confirmar no HTML da home: canonical e `og:url` apontam para
`https://inovarepintura.com`. Depois:

1. Google Search Console → adicionar/verificar a propriedade do domínio novo →
   submeter `sitemap.xml` → pedir indexação;
2. Google Business Profile → atualizar o website do perfil para o novo
   endereço;
3. Manter redirects dos domínios antigos para o primário durante a migração,
   para não perder links existentes.

### 4.5 Deteção e notificações do formulário (obrigatório)

**Antes do deploy:** Netlify → **Forms** → confirmar que *form detection*
está **enabled**. O HTML de deteção e o alvo de POST vivem em
`public/orcamento-enviado.html`; não remover nem mover para `src/app/`. O custo
varia por plano: nas contas atuais baseadas em créditos, Forms é gratuito e
ilimitado; planos legacy podem ter cobrança por níveis/volume. Confirma em
Forms → Usage/billing da equipa antes de assumir o custo.
O Next.js + OpenNext adapter v5 exige este ficheiro estático. O JSX não pode
conter `data-netlify`/`netlify-honeypot` — isso causa falha intencional do
plugin durante o build. Depois do deploy, o formulário `orcamento` deve
aparecer em **Netlify → Forms**. Se não aparecer, não considerar o formulário
operacional nem anunciar que recebe pedidos.

Para os pedidos chegarem ao e-mail do cliente:

1. **Netlify** → *Forms* → *Form notifications* → **Add notification** →
   *Email notification*;
2. Evento: *New form submission* · formulário: `orcamento` ·
   destino: o e-mail do cliente;
3. Testar com uma submissão real e confirmar que chegou (ver spam).

Depois, verificar em **Forms → Submissions** que o registo foi guardado e
que a notificação chegou ao endereço certo. A resposta AJAX do browser, por
si só, não prova que o formulário foi registado — só o painel e a submissão
real confirmam isso. Sem notificação, os pedidos acumulam-se no painel sem
ninguém saber.

### 4.6 E-mail profissional (opcional, recomendado)

Com o domínio na Hostinger, ativar `geral@inovarepintura.com` (planos de
e-mail da própria Hostinger, ou encaminhar para o Gmail atual). Se ativar,
atualizar `data/project-data.json` (campo `contact.email*`) e republicar —
os testes de conteúdo garantem consistência.

## Verificação antes de qualquer deploy

```bash
npm run verify   # lint + typecheck + testes + build
npx playwright test
```

## Bloqueadores — estado

- ~~**CLIENT-04**~~ **Resolvido 2026-09-30:** consentimento confirmado,
  `real-005` publicável.
- ~~**CLIENT-05**~~ **Resolvido 2026-09-30:** pares confirmados como a
  mesma obra; rótulo "durante/resultado" mantém-se, comparador slider é
  evolução futura.
- **Sem favicon próprio:** o separador do browser mostra o ícone genérico.
  Precisa da vetorização do logo a partir de `assets/brand/`. Não deve ser
  gerado por IA. (Pendente do cliente.)
- **Analytics:** sem ferramenta por decisão do cliente (2026-09-30). A
  camada de eventos existe; integrar antes de qualquer ferramenta nova
  (ver `docs/decisions/ADR-005-analytics.md`).

## Reverter

Na Netlify, em **Deploys**, abre um deploy anterior e usa
**"Publish deploy"**. Volta atrás em segundos, sem passar pelo Git.
