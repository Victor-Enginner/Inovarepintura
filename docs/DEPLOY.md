# Deploy — Inovare Pintura

Runbook de deploy e CI/CD. **Fluxo atual: push para `main` → CI valida →
Netlify publica automaticamente.** Publicar pelo CLI é o plano B.

## Como funciona o pipeline (resumo)

1. `git push` para `main` (a partir do teu computador);
2. **GitHub Actions** corre o Gate D completo (lint, typecheck, testes,
   build, e2e) — `.github/workflows/ci.yml`;
3. **Netlify** deteta o push, faz `npm run build` com `netlify.toml` e
   publica sozinha;
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

```bash
netlify env:set NEXT_PUBLIC_SITE_URL https://inovare-pintura.netlify.app
```

**Sem isto o site anuncia um domínio que não é o dele** no canonical, no
Open Graph e no sitemap — confunde indexação desde o primeiro dia.

Quando o domínio próprio ficar ativo, repetir com o novo endereço e
republicar (ver §Domínio). É a única alteração necessária.

## 2. Deploy de rascunho (quando precisares de ver antes de publicar)

```bash
npx netlify-cli deploy --build
```

Devolve um URL temporário (`*.netlify.app` com hash) que não afeta produção
nem é indexado.

## 3. Publicação manual (plano B)

```bash
npm run verify && npx playwright test   # Gate D local
npx netlify-cli deploy --build --prod
```

## 4. Domínio próprio (Hostinger) — passo a passo

Pré-requisito: contas na Hostinger e na Netlify. O código já está pronto —
nada disto exige alterações no site além da env var.

### 4.1 Comprar

Na Hostinger, comprar o domínio — sugestão: `inovarepintura.pt` (o `.pt`
rege-se por regras próprias de registo; a Hostinger trata do processo).

### 4.2 Apontar o domínio à Netlify

Na **Netlify** → *Domain management → Add a domain / Add a subdomain site*
→ escrever `inovarepintura.pt` → confirmar como domínio primário quando
perguntado. A Netlify mostra os registos DNS exatos.

Na **Hostinger** (hPanel → Domains → DNS/Nameservers), apontar:

| Tipo | Nome | Valor | TTL |
|---|---|---|---|
| `A` | `@` (raiz) | `75.2.60.5` | auto |
| `CNAME` | `www` | `inovare-pintura.netlify.app` | auto |

> Estes valores podem mudar — **usar sempre os que o painel da Netlify
> mostra na altura**. Em alternativa à tabela, a Netlify aceita os
> nameservers da Hostinger trocados pelos dela (`dns1.p0X.nsone.net` etc.),
> e nesse caso gere o DNS todo sozinha (mais simples de manter).

Ativar **"Redirect to primary domain"** (força `www` → raiz ou vice-versa)
para não haver conteúdo duplicado aos olhos do Google.

O SSL (Let's Encrypt) é emitido automaticamente quando o DNS propagar
(minutos a poucas horas). Não há custo nem configuração extra.

### 4.3 Atualizar a env var e republicar

```bash
netlify env:set NEXT_PUBLIC_SITE_URL https://inovarepintura.pt
```

Depois disparar um build (Netlify → Deploys → *Trigger deploy*) — ou fazer
qualquer `git push`, que já o faz. Isto corrige canonical, Open Graph e
sitemap para o novo domínio.

### 4.4 Verificação pós-domínio

```bash
curl -s https://inovarepintura.pt/robots.txt
curl -s https://inovarepintura.pt/sitemap.xml
curl -sI https://inovarepintura.pt | head -5   # esperar 200 + https
```

E confirmar no HTML da home: canonical e `og:url` apontam para
`https://inovarepintura.pt`. Depois:

1. Google Search Console → adicionar propriedade do novo domínio →
   submeter `sitemap.xml` → pedir indexação;
2. Google Business Profile → atualizar o website do perfil para o novo
   endereço;
3. Redirecionamento do domínio antigo: enquanto os dois estiverem ativos, a
   Netlify trata do redirect se `inovare-pintura.netlify.app` continuar
   ligado ao site (auto).

### 4.5 E-mail profissional (opcional, recomendado)

Com o domínio na Hostinger, ativar `geral@inovarepintura.pt` (planos de
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
