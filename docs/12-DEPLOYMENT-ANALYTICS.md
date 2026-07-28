# 12 — Deployment, analytics e operação

## Ambientes

- local;
- preview por pull request/branch;
- production.

## Variáveis

Criar `.env.example`, nunca incluir segredos.

Possíveis:

```txt
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_ANALYTICS_ID=
NEXT_PUBLIC_ENABLE_FLUID_CURSOR=false
NEXT_PUBLIC_ENABLE_CONTACT_FORM=false
```

Dados públicos da empresa podem ficar em conteúdo tipado; não tratá-los como
segredos.

## Netlify

- detectar framework automaticamente ou configurar adapter oficial;
- build reproduzível;
- Node version declarada;
- redirects/headers versionados;
- previews ativos;
- produção somente a partir do branch definido;
- não mudar DNS sem autorização.

## Analytics

Implementar uma camada própria:

```ts
track("whatsapp_click", { location: "hero" })
```

Eventos:

- `cta_quote_click`;
- `phone_click`;
- `whatsapp_click`;
- `email_click`;
- `instagram_click`;
- `gallery_open`;
- `before_after_interaction`;
- `intro_skip`;
- `intro_complete`.

Parâmetros permitidos:

- localização do componente;
- categoria de serviço;
- ID interno da imagem;
- viewport class;
- reduced motion boolean.

Proibido:

- telefone do visitante;
- e-mail do visitante;
- conteúdo da mensagem;
- endereço;
- nome;
- texto livre.

## Consentimento

Se a ferramenta exigir cookies não essenciais:

- banner e preferências;
- carregar apenas após consentimento;
- política correspondente;
- opção de revogar.

Preferir solução privacy-friendly quando possível.

## Release

1. build local;
2. preview;
3. QA;
4. aprovação;
5. snapshot/versão;
6. deploy production;
7. smoke test;
8. monitorização;
9. rollback documentado.

## Smoke test

- home 200;
- imagens 200;
- sitemap/robots;
- HTTPS;
- canonical;
- WhatsApp/telefone/e-mail;
- Instagram;
- galeria;
- intro skip;
- reduced motion;
- consola;
- analytics consentido;
- JSON-LD.

## Runbook

Documentar:

- instalar;
- executar;
- testar;
- build;
- deploy;
- trocar contactos;
- adicionar galeria;
- criar par antes/depois;
- desativar efeito;
- rollback.

