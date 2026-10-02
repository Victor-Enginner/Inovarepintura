'use client';

import { useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { phone } from '@/content/site';
import {
  heroBaseAlt,
  heroBeats,
  heroFade,
  heroFrames,
  heroMaxScale,
  heroReveals,
  heroResultAlt,
} from '@/content/heroFrames';

/* Hero scrolltelling.
 *
 * Cinco estados da mesma casa, com o scroll a fazer o trabalho de um cursor de
 * videografo: a fachada parte, é preparada, é pintada e acaba acabada. Não há
 * slideshow porque nada entra nem sai — as camadas são a mesma vista em
 * momentos diferentes, e cada uma cobre a anterior de cima para baixo.
 *
 * Três decisões que sustentam o resto:
 *
 * 1. A imagem base (frame 1) nunca sai. É a imagem de LCP, é o que se vê sem
 *    JavaScript, e ficar sempre por baixo garante que não existe um único
 *    instante em que o ecrã fique vazio ou preto. Cada frame entra por
 *    `opacity` de 0 a 1 sobre ela; como a camada de cima chega a 1 com a de
 *    baixo a 1 por baixo, o resultado visual é o de um crossfade simétrico
 *    com metade do trabalho.
 *
 * 2. O `src` dos frames 2–5 não existe no HTML. Se existisse, o browser
 *    descarregaria os cinco de uma vez antes do LCP. Quem os pede é o
 *    JavaScript, por ordem: o 2 logo que a página fica ociosa, os restantes
 *    em cadeia, cada um à espera do anterior, e todos à frente de forma
 *    urgente quando o scroll se aproxima.
 *
 * 3. O pin é `position: sticky` em CSS, não o `pin` do ScrollTrigger. Sticky
 *    funciona sem JavaScript e não insere um espaçador no fluxo; o pin do
 *    ScrollTrigger entraria em conflito com ele. O ScrollTrigger fica só a
 *    traduzir scroll em progresso — que é o que o GSAP faz melhor.
 *
 * Com `prefers-reduced-motion` não há timeline: mostra-se a casa final, com o
 * nome e o contacto. A escolha da imagem é feita por `<source media>`, que o
 * browser avalia no parse — nem o frame 1 nem o MP4 são descarregados.
 */

gsap.registerPlugin(ScrollTrigger);

const REDUCED = '(prefers-reduced-motion: reduce)';

/** Tempo entre o carregamento de um frame e o pedido do seguinte, em ms. */
const CHAIN_GAP = 400;

export function HeroScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  /* Índice 0 = frame 2 … índice 3 = frame 5. */
  const layersRef = useRef<Array<HTMLImageElement | null>>([null, null, null, null]);

  /** Dá `src`/`srcset` a um frame. Idempotente.
   *
   * `frameIndex` é o índice em `heroFrames` (1 a 4: frame 1 é a base e já
   * vem no HTML). As camadas vivem num array à parte, deslocado em um. */
  const ensure = useCallback((frameIndex: number) => {
    const source = heroFrames[frameIndex];
    const el = layersRef.current[frameIndex - 1];
    if (!source || !el || el.src) return;
    el.srcset = source.srcset;
    el.sizes = '100vw';
    el.src = source.sources.desktop;
  }, []);

  /* Carregamento em cadeia. Nunca pede tudo de uma vez: o caminho crítico do
   * LCP é o frame 1 e o orçamento de banda pertence-lhe. */
  useEffect(() => {
    if (window.matchMedia(REDUCED).matches) return;

    const reduced = window.matchMedia(REDUCED);
    let cancelled = false;
    let timer = 0;

    const next = (index: number) => {
      if (cancelled || index > 3) return;
      ensure(index + 1);

      const el = layersRef.current[index];
      const go = () => {
        timer = window.setTimeout(() => next(index + 1), CHAIN_GAP);
      };

      /* `load` resolve mais depressa; o timeout cobre uma imagem que nunca
       * dispara o evento (erro de rede, aba em segundo plano). */
      if (el?.complete && el.naturalWidth > 0) go();
      else {
        el?.addEventListener('load', go, { once: true });
        timer = window.setTimeout(go, 4000);
      }
    };

    const onReducedChange = () => {
      if (reduced.matches) {
        cancelled = true;
        window.clearTimeout(timer);
      }
    };
    reduced.addEventListener('change', onReducedChange);

    /* `requestIdleCallback` existe em todos os browsers suportados; o
     * `setTimeout` é só para o caso de não existir. */
    const idle = (
      window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }
    ).requestIdleCallback;
    if (idle) {
      idle(() => next(0), { timeout: 2000 });
    } else {
      timer = window.setTimeout(() => next(0), 600);
    }

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      reduced.removeEventListener('change', onReducedChange);
    };
  }, [ensure]);

  /* Timeline. */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia(REDUCED).matches) return;

    const layers = layersRef.current.filter((el): el is HTMLImageElement => el !== null);
    const base = section.querySelector<HTMLElement>('[data-hero-base]');
    const reveal = section.querySelector<HTMLElement>('[data-hero-reveal]');
    const beatNodes = Array.from(section.querySelectorAll<HTMLElement>('[data-hero-beat]'));
    const halo = section.querySelector<HTMLElement>('[data-hero-halo]');
    const revealHalo = section.querySelector<HTMLElement>('[data-hero-halo-reveal]');

    const context = gsap.context(() => {
      /* Push-in contínuo, igual em todas as camadas. Se cada camada tivesse a
       * sua própria rampa, ao revelar a seguinte haveria um salto de
       * tamanho — que é exatamente o que denuncia um slideshow.
       *
       * A origem é a base da imagem (`bottom`), não o centro: centrado, o
       * zoom de 1,025 cortava a base da casa, onde estão as pinceladas. */
      gsap.set([base, ...layers], { transformOrigin: '50% 100%', scale: 1 });

      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          invalidateOnRefresh: true,
          /* Sem `pin`: o pin é o `sticky` do contentor. */
          onUpdate: (self) => {
            /* Urgência: mal o progresso se aproxime da fatia de um frame, ele
             * é pedido. Um visitante que role depressa não espera pela cadeia. */
            for (let i = 0; i < heroReveals.length; i += 1) {
              if (self.progress >= heroReveals[i]! - heroFade * 0.5) ensure(i + 1);
            }
          },
        },
      });

      layers.forEach((layer, index) => {
        timeline.fromTo(
          layer,
          { opacity: 0 },
          { opacity: 1, duration: heroFade, ease: index === 0 ? 'power2.out' : 'power1.inOut' },
          heroReveals[index]!,
        );
        timeline.fromTo(layer, { scale: 1 }, { scale: heroMaxScale, duration: 1 }, 0);
      });

      if (base) {
        timeline.fromTo(base, { scale: 1 }, { scale: heroMaxScale, duration: 1 }, 0);
      }

      /* Frases: entram e saem dentro da sua fatia. O deslocamento é pequeno e a
       * escala quase nula — uma frase inteira sobre fotografia só fica
       * legível se cresce pouco, e o texto tem de parecer escrito na
       * imagem, não a pousar sobre ela. */
      beatNodes.forEach((node) => {
        const start = Number(node.dataset['heroBeat'] ?? 0);
        const end = Number(node.dataset['heroBeatEnd'] ?? start);
        const fade = Math.min(0.06, (end - start) / 4);

        timeline.fromTo(
          node,
          { opacity: 0, y: 40, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: fade, ease: 'power2.out' },
          start,
        );
        timeline.to(
          node,
          { opacity: 0, y: -30, duration: fade, ease: 'power2.in' },
          end - fade,
        );
      });

      /* O halo segue exatamente a mesma curva que o texto que protege: existe
       * enquanto há letra sobre a fotografia e desaparece com ela. Sem isto,
       * escureceria a casa nos estados em que não há texto nenhum por cima. */
      if (halo) {
        heroBeats.forEach((beat) => {
          const fade = Math.min(0.06, (beat.end - beat.start) / 4);
          timeline.fromTo(halo, { opacity: 0 }, { opacity: 1, duration: fade, ease: 'power2.out' }, beat.start);
          timeline.to(halo, { opacity: 0, duration: fade, ease: 'power2.in' }, beat.end - fade);
        });
      }

      /* Reveal final: aparece já com o frame 5 estável, para a leitura não
       * competir com a última transição. O halo dele sobe mais cedo e em
       * menos tempo do que a letra: se aparecessem juntos, nos primeiros
       * píxeis do reveal ainda não havia nada por trás do texto. */
      const revealAt = heroReveals[3]! + heroFade;
      if (revealHalo) {
        timeline.fromTo(
          revealHalo,
          { opacity: 0 },
          { opacity: 1, duration: 0.04, ease: 'power1.out' },
          revealAt - 0.03,
        );
      }
      if (reveal) {
        timeline.fromTo(
          reveal,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.06, ease: 'power1.out' },
          revealAt,
        );
      }

      const bar = section.querySelector<HTMLElement>('[data-hero-bar]');
      if (bar) {
        timeline.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);
      }

      /* `will-change` só enquanto a animação está a acontecer: mantê-lo
       * depois cria camadas de composição que consomem memória sem motivo. */
      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => {
          for (const el of [base, ...layers]) {
            if (el) el.style.willChange = self.isActive ? 'opacity, transform' : '';
          }
        },
      });
    }, section);

    return () => context.revert();
  }, [ensure]);

  const skip = useCallback(() => {
    /* A âncora já leva a página ao hero; isto só move o foco, para quem
     * navega por teclado não ficar preso na introdução. */
    document.getElementById('hero')?.focus({ preventScroll: true });
  }, []);

  const [base, ...rest] = heroFrames;

  return (
    <section
      ref={sectionRef}
      aria-label="Apresentação: a transformação de uma fachada"
      className="hero-scroll relative"
    >
      <div className="hero-sticky sticky top-0 h-dvh overflow-hidden bg-navy-900">
        {/* Imagem base. O `<source media>` faz o browser escolher no parse: com
         * movimento reduzido nunca pede o frame 1, pede o frame 5. Sem
         * JavaScript, é esta a única imagem — e nunca há ecrã vazio. */}
        <picture>
          <source media="(prefers-reduced-motion: reduce)" srcSet={heroFrames[4].srcset} sizes="100vw" />
          {/* `<img>` e não `next/image`: este é o elemento LCP e o pipeline do
           * Next re-codifica para o seu próprio formato, o que aqui seria
           * recomprimir ficheiros que já saíram de um master PNG. O srcset
           * responsivo é escrito à mão e não há nenhum passo de otimização
           * entre o ficheiro em disco e o browser. */}
          <img
            data-hero-base
            src={base.src}
            srcSet={base.srcset}
            sizes="100vw"
            width={base.width}
            height={base.height}
            alt={heroBaseAlt}
            fetchPriority="high"
            loading="eager"
            decoding="async"
            className="hero-frame hero-frame-base"
          />
        </picture>

        {/* Camadas 2–5. Sem `src` no HTML: quem as pede é a cadeia de
         * carregamento, não o browser. */}
        {rest.map((f, index) => (
          // Mesma razão que a imagem base: aqui o <img> é a unidade de
          // animação e o src é atribuído por JavaScript.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={f.id}
            ref={(el) => {
              layersRef.current[index] = el;
            }}
            data-hero-layer={f.id}
            alt=""
            aria-hidden="true"
            decoding="async"
            className="hero-frame"
          />
        ))}

        {/* Sem JavaScript a progressão não existe: o vídeo conta a sequência
         * em ciclo, em vez de ficar um cartaz parado durante 500vh. */}
        <noscript>
          <video
            className="hero-frame"
            src="/hero/inovare/inovare-hero-fallback-1080p.mp4"
            poster={`${base.src}`}
            autoPlay
            muted
            loop
            playsInline
            aria-label={heroResultAlt}
          />
        </noscript>

        {/* Palco de texto do hero: frases do percurso e reveal final.
         *
         * Tudo o que é escrito sobre a fotografia vive aqui, ao centro do
         * ecrã. O alinhamento é do contentor (`inset: 0` + flex centrado) e
         * não um `bottom` ou um `translate` em píxeis: é isso que mantém o
         * texto centrado quando a altura da janela muda — barras do browser
         * que entram e saem, ecrã dobrado, rotação.
         *
         * `pointer-events: none` vai no contentor e é reativado nos próprios
         * links: o palco cobre o ecrã todo e sem isso roubava o clique ao
         * "Saltar introdução". */}
        <div className="hero-stage">
          {/* Narrativa do percurso: frases sobre os frames 2 a 4. */}
          <div aria-hidden="true" data-hero-halo className="hero-halo" />

          {heroBeats.map((beat) => (
            <p
              key={beat.text}
              data-hero-beat={beat.start}
              data-hero-beat-end={beat.end}
              className="hero-beat"
            >
              {beat.text}
            </p>
          ))}

          {/* Reveal final: marca, promessa e contacto, depois de ~84% do
           * percurso — o resto é a casa final a ficar parada.
           *
           * O halo é um elemento separado porque tem a sua própria curva: o
           * das frases apaga-se em 78% e o reveal só aparece em 84%. Com um
           * halo só, havia 6% do percurso com texto sobre a fotografia e sem
           * nada por trás. */}
          <div aria-hidden="true" data-hero-halo-reveal className="hero-halo" />

          <div data-hero-reveal className="hero-reveal">
            <p className="hero-brand">Inovare Pintura</p>
            <h1 className="hero-headline">
              Transformamos espaços.
              <br />
              Valorizamos o que é seu.
            </h1>
            <div className="hero-actions">
              <a href={phone.href} data-analytics="cta_quote_click" className="hero-cta">
                Pedir orçamento
              </a>
              <a href={phone.href} data-analytics="phone_click" className="hero-phone">
                {phone.label}
              </a>
            </div>
          </div>
        </div>

        {/* Controlo sempre presente: em movimento reduzido a secção é um
         * ecrã só e a âncora continua a ser a saída natural para o conteúdo. */}
        <div className="hero-controls on-dark">
          <div className="hero-progress" role="presentation" aria-hidden="true">
            <div data-hero-bar className="hero-progress-bar" />
          </div>
          <a
            href="#hero"
            onClick={skip}
            data-analytics="intro_skip"
            className="hero-skip"
          >
            Saltar introdução
          </a>
        </div>
      </div>
    </section>
  );
}