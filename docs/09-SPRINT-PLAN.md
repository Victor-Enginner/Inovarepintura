# 09 — Plano de sprints e tarefas

## Convenções

Estado permitido:

- `TODO`
- `IN_PROGRESS`
- `BLOCKED`
- `DONE`

Cada tarefa deve ter:

- owner;
- dependências;
- ficheiros;
- implementação;
- critérios de aceite;
- verificações;
- evidências.

## Sprint 0 — Descoberta e baseline

**Objetivo:** compreender o repositório e transformar este pacote num plano
executável sem destruir trabalho existente.

### S0-T01 — Auditoria do repositório

- Identificar stack, scripts, lockfile, rotas, estilos e estado Git.
- Registar alterações existentes.
- Aceite: `PROJECT_STATUS.md` possui diagnóstico reproduzível.

### S0-T02 — Inventário e validação dos assets

- Cruzar filesystem com `data/assets.json`.
- Verificar dimensões, formato, duplicados e corrupção.
- Aceite: todos os assets têm função, provenance e estado.

### S0-T03 — Validação de conteúdo

- Cruzar contactos, morada, serviços e copy.
- Abrir issues `CLIENT-*` para dados não confirmados.
- Aceite: nenhum dado provisório é apresentado como confirmado.

### S0-T04 — Architecture Decision Records

- Stack;
- motion;
- galeria;
- imagem;
- analytics.
- Aceite: ADRs explicam escolha, alternativas e consequências.

### S0-T05 — Baseline de qualidade

- Executar scripts atuais.
- Registar build, erros, bundle e Lighthouse se aplicável.
- Aceite: baseline antes das alterações.

**Gate:** não iniciar Sprint 1 sem relatório do Sprint 0.

## Sprint 1 — Fundação e design system

**Objetivo:** criar base tipada, acessível e consistente.

### S1-T01 — Estrutura e tooling

- Configurar TypeScript strict, lint, format, testes e aliases.
- Aceite: instalação limpa e build repetível.

### S1-T02 — Tokens

- Cor, tipografia, espaço, radius, sombra, z-index e motion.
- Aceite: tokens usados nos primitivos; contraste verificado.

### S1-T03 — Primitivos

- Button, Link, Container, Section, Heading, VisuallyHidden.
- Aceite: estados hover/focus/disabled; teclado e touch.

### S1-T04 — Conteúdo tipado

- Migrar `project-data.json` e `assets.json` para contratos.
- Aceite: contactos e galeria sem strings duplicadas.

### S1-T05 — Layout base

- Header, footer, skip link, landmarks.
- Aceite: página navegável sem motion.

**Verificações:** lint, typecheck, testes de componentes, build.

## Sprint 2 — Cutscene e hero

**Objetivo:** implementar a assinatura narrativa.

### S2-T01 — Pipeline de imagens

- Criar derivados responsivos.
- Definir posters, priority e lazy loading.
- Aceite: sem upscale e sem layout shift.

### S2-T02 — CinematicIntro

- Stage pinned, frames e timeline.
- Aceite: mapeamento fiel a `06-MOTION-SCROLLTELLING-SPEC.md`.

### S2-T03 — Skip e reduced motion

- Skip acessível, foco e preferência do sistema.
- Aceite: conteúdo imediato com reduced motion.

### S2-T04 — PaintReveal

- Máscara/splash para revelar UI.
- Aceite: sem flash, sem bloquear clique e com fallback.

### S2-T05 — PrimaryHero

- Copy, CTAs e prova.
- Aceite: quatro respostas essenciais visíveis em dez segundos.

### S2-T06 — QA da introdução

- desktop, mobile, rotação, Back/Forward e rede lenta.
- Aceite: sem scroll lock ou consola.

**Verificações:** E2E da intro, axe, build e medição de FPS/memória.

## Sprint 3 — Serviços e processo

**Objetivo:** explicar oferta e método de forma comercial.

### S3-T01 — Serviços

- Implementar grelha editorial.
- Aceite: seis serviços, copy fiel e ordem responsiva.

### S3-T02 — Processo

- Cinco etapas.
- Aceite: compreensível sem ícones/animação.

### S3-T03 — CTAs contextuais

- CTA por bloco com evento analytics.
- Aceite: link correto e nome acessível.

### S3-T04 — Motion secundário

- Reaparecimentos leves.
- Aceite: nada compete com a cutscene.

**Verificações:** teclado, contraste, mobile 320 px e build.

## Sprint 4 — Galeria e casos reais

**Objetivo:** converter fotografias reais em prova organizada.

### S4-T01 — Otimização e privacidade

- Remover EXIF, criar derivados, verificar rostos/matrículas.
- Aceite: originais preservados, públicos sanitizados.

### S4-T02 — Data model

- Categoria, estágio, alt, caption, provenance e pairId.
- Aceite: validação de schema.

### S4-T03 — GalleryGrid

- Masonry/Chroma/OriginKit conforme ADR.
- Aceite: layout estável e leitura correta.

### S4-T04 — Filtros

- Todos, Exteriores, Interiores, Coberturas, Remodelação.
- Aceite: teclado, URL/estado e resultados anunciados.

### S4-T05 — Lightbox

- Dialog com foco preso, Escape, navegação e caption.
- Aceite: WCAG e touch.

### S4-T06 — Before/After

- Implementar somente nos pares validados.
- Aceite: slider acessível ou comparação lado a lado.

### S4-T07 — Caso moradia ocre

- Antes/durante/depois e texto.
- Aceite: fotos reais, sem cor alterada.

**Verificações:** E2E da galeria, axe, visual regression e build.

## Sprint 5 — Conversão e contacto

**Objetivo:** reduzir fricção entre intenção e conversa.

### S5-T01 — CTA final

- WhatsApp e telefone.
- Aceite: links derivados de dados centrais.

### S5-T02 — Contact footer

- NAP, e-mail, Instagram e morada.
- Aceite: copy/paste, acessibilidade e segurança.

### S5-T03 — Mensagem WhatsApp

- Prefill codificado.
- Aceite: não incluir dados pessoais no analytics.

### S5-T04 — Área de serviço

- Olhão e mapa/link.
- Aceite: sem localidades inventadas.

### S5-T05 — Tracking

- Eventos sem PII.
- Aceite: debug mostra exatamente um evento por ação.

**Gate:** e-mail e WhatsApp validados antes de produção.

## Sprint 6 — SEO local e conteúdo técnico

**Objetivo:** indexação correta e presença local consistente.

### S6-T01 — Metadata

- title, description, canonical, OG.
- Aceite: ferramentas de preview sem campos críticos ausentes.

### S6-T02 — Structured data

- LocalBusiness/HomeAndConstructionBusiness.
- Aceite: validador sem erros.

### S6-T03 — Sitemap e robots

- Aceite: URLs canónicas corretas.

### S6-T04 — Semântica

- heading tree, landmarks, anchors.
- Aceite: auditoria sem problemas estruturais.

### S6-T05 — Local SEO handoff

- checklist Google Business Profile.
- Aceite: NAP idêntico ao site.

## Sprint 7 — Qualidade, performance e segurança

**Objetivo:** preparar release.

### S7-T01 — Core Web Vitals

- Medir e otimizar LCP, CLS e INP.
- Aceite: objetivos ou exceção documentada.

### S7-T02 — Bundle

- Analisar JS/CSS, remover dependências duplicadas.
- Aceite: orçamento respeitado ou ADR.

### S7-T03 — Acessibilidade

- automatizada + manual.
- Aceite: zero violações críticas/sérias conhecidas.

### S7-T04 — Cross-browser

- Chromium, Firefox, Safari/iOS e Android.
- Aceite: funções críticas consistentes.

### S7-T05 — Segurança e privacidade

- headers, consentimento e leakage.
- Aceite: nenhum segredo/PII exposto.

### S7-T06 — Resiliência

- rede lenta, imagem falha, JS off, reduced motion.
- Aceite: contacto continua possível.

## Sprint 8 — Deploy e handoff

**Objetivo:** publicar com rollback e documentação.

### S8-T01 — Preview

- Deploy de preview.
- Aceite: checklist completo no URL real.

### S8-T02 — DNS/domínio

- Configurar quando credenciais forem fornecidas.
- Aceite: HTTPS e canonical.

### S8-T03 — Production

- Deploy versionado.
- Aceite: smoke test pós-deploy.

### S8-T04 — Google

- Search Console, sitemap e Business Profile.
- Aceite: propriedade e submissão documentadas.

### S8-T05 — Handoff

- README, runbook, assets, contactos e manutenção.
- Aceite: outra pessoa consegue instalar, executar e publicar.

## Release blockers

- contacto incorreto;
- build falha;
- introdução impede acesso;
- imagem gerada dentro de “Trabalhos”;
- licença desconhecida;
- erro crítico de acessibilidade;
- metadata aponta para domínio errado;
- fotografia pessoal sem consentimento;
- analytics envia PII.

