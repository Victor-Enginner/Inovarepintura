# 05 — Arquitetura técnica

## Regra de decisão

Preservar a stack existente quando ela já compila, possui estrutura coerente e
cumpre SEO. Para greenfield, usar Next.js App Router, React, TypeScript strict e
Tailwind CSS.

## Estrutura sugerida

```txt
src/
  app/
    layout.tsx
    page.tsx
    globals.css
    sitemap.ts
    robots.ts
  components/
    cinematic/
      CinematicIntro.tsx
      CinematicFrame.tsx
      PaintReveal.tsx
      IntroSkip.tsx
    layout/
      SiteHeader.tsx
      SiteFooter.tsx
      Section.tsx
    sections/
      PrimaryHero.tsx
      ProofStrip.tsx
      Services.tsx
      Process.tsx
      RealWorkGallery.tsx
      FeaturedBeforeAfter.tsx
      ServiceArea.tsx
      FinalCTA.tsx
    gallery/
      GalleryGrid.tsx
      GalleryFilter.tsx
      GalleryDialog.tsx
      BeforeAfter.tsx
    ui/
      Button.tsx
      Container.tsx
      Heading.tsx
      Icon.tsx
  content/
    site.ts
    services.ts
    gallery.ts
  lib/
    analytics.ts
    motion.ts
    metadata.ts
    structured-data.ts
  styles/
    tokens.css
public/
  images/
  video/
```

## Conteúdo

- Dados de contacto numa única estrutura tipada.
- Galeria derivada de `data/assets.json`.
- Copy centralizada, sem duplicação em componentes.
- Nenhum CMS no Sprint 1.
- Preparar contratos para migração futura, mas não sobrearquitetar.

## Rendering

- conteúdo essencial renderizado no servidor;
- componentes client apenas onde interação exige;
- timeline carregada dinamicamente depois do conteúdo crítico;
- nenhum layout inteiro transformado em client component;
- fallback HTML para galeria e contactos.

## Imagens

Gerar derivados:

- AVIF;
- WebP;
- JPEG de fallback quando necessário;
- larguras 480, 768, 1024, 1440 e 1920 quando a fonte permitir;
- thumb de galeria entre 480 e 800 px;
- imagem grande de lightbox limitada ao tamanho real útil.

Conservar originais fora da pasta pública ou em `/source-assets`.

## Vídeo

O MP4 é um preview. Se for usado:

- `preload="metadata"` ou `none`;
- poster obrigatório;
- muted, playsInline;
- sem autoplay com som;
- versão mobile reduzida;
- sem carregamento antes do LCP;
- medir seek e decode.

## Motion

- uma timeline GSAP para a introdução;
- Intersection Observer/CSS para reveals simples;
- cleanup de timelines e listeners;
- context/revert em unmount;
- nunca animar propriedades que causem layout em loop;
- usar transform e opacity;
- timeline desativada em reduced motion.

## Formulário

Na v1, preferir contacto direto. Se existir formulário:

- nome;
- contacto;
- tipo de serviço;
- localidade;
- mensagem opcional;
- consentimento explícito;
- validação no cliente e servidor;
- anti-spam;
- sem expor segredo;
- sucesso/erro acessível.

## Segurança

- sem chaves no cliente;
- headers de segurança adequados;
- dependências mínimas e auditadas;
- `rel="noopener noreferrer"` em links externos quando aplicável;
- CSP compatível com analytics e fontes;
- sanitização se conteúdo futuro vier de CMS.

## Testing

Mínimo:

- unit para helpers de links/metadata;
- component para galeria e skip intro;
- E2E para navegação, CTA e dialog;
- axe ou equivalente nas rotas principais;
- visual smoke em mobile e desktop.

## Comandos de qualidade

Adaptar aos scripts existentes:

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

Não inventar scripts: criá-los e documentá-los quando ausentes.

