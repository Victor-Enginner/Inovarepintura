'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { phone } from '@/content/site';
import { heroBeats } from '@/content/heroFrames';

const REDUCED = '(prefers-reduced-motion: reduce)';
const subscribeMotion = (notify: () => void) => {
  const media = window.matchMedia(REDUCED);
  media.addEventListener('change', notify);
  return () => media.removeEventListener('change', notify);
};
const motionSnapshot = () => window.matchMedia(REDUCED).matches;
const serverMotionSnapshot = () => false;

export function HeroScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [manualPlayback, setManualPlayback] = useState(false);
  const reduced = useSyncExternalStore(
    subscribeMotion,
    motionSnapshot,
    serverMotionSnapshot,
  );

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;
    const media = window.matchMedia(REDUCED);
    const syncPlayback = () => {
      if ((media.matches && !manualPlayback) || paused || document.hidden) video.pause();
      else {
        if (!video.getAttribute('src')) {
          video.src = window.matchMedia('(max-width: 767px)').matches
            ? '/hero/inovare/renovation-mobile.mp4'
            : '/hero/inovare/renovation-desktop.mp4';
        }
        void video.play().catch(() => {
          /* Poster remains visible if autoplay is unavailable. */
        });
      }
    };
    syncPlayback();
    media.addEventListener('change', syncPlayback);
    document.addEventListener('visibilitychange', syncPlayback);
    return () => {
      video.pause();
      media.removeEventListener('change', syncPlayback);
      document.removeEventListener('visibilitychange', syncPlayback);
    };
  }, [paused, manualPlayback]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const media = window.matchMedia(REDUCED);
    const reveal = section.querySelector<HTMLElement>('[data-hero-reveal]');
    const beats = Array.from(section.querySelectorAll<HTMLElement>('[data-hero-beat]'));
    const bar = section.querySelector<HTMLElement>('[data-hero-bar]');
    let frame = 0;
    const clamp = (value: number) => Math.min(1, Math.max(0, value));
    const paint = (node: HTMLElement | null, opacity: number, y: number) => {
      if (!node) return;
      node.style.opacity = String(opacity);
      node.style.visibility = opacity > 0 ? 'visible' : 'hidden';
      node.style.transform = `translateY(${y}px)`;
    };
    const update = () => {
      frame = 0;
      if (media.matches) return;
      const sticky = section.querySelector<HTMLElement>('.hero-sticky');
      const distance = Math.max(
        1,
        section.offsetHeight - (sticky?.offsetHeight ?? window.innerHeight),
      );
      const progress = clamp(-section.getBoundingClientRect().top / distance);
      // The video follows its own clock; scroll only changes HTML text.
      beats.forEach((node) => {
        const start = Number(node.dataset['heroBeat']);
        const end = Number(node.dataset['heroBeatEnd']);
        const entering = clamp((progress - start) / 0.05);
        const leaving = clamp((progress - (end - 0.05)) / 0.05);
        paint(node, Math.min(entering, 1 - leaving), 24 * (1 - entering) - 24 * leaving);
      });
      const final = clamp((progress - 0.8) / 0.06);
      const opening = 1 - clamp(progress / 0.14);
      paint(
        reveal,
        Math.max(opening, final),
        opening > 0 ? -24 * (1 - opening) : 24 * (1 - final),
      );
      if (bar) bar.style.transform = `scaleX(${progress})`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const configure = () => {
      section.classList.toggle('hero-animated', !media.matches);
      if (media.matches) {
        for (const node of [...beats, reveal, bar]) node?.removeAttribute('style');
      } else update();
    };
    configure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    media.addEventListener('change', configure);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      media.removeEventListener('change', configure);
      section.classList.remove('hero-animated');
      for (const node of [...beats, reveal, bar]) node?.removeAttribute('style');
    };
  }, []);

  const skip = useCallback(() => {
    document.getElementById('hero')?.focus({ preventScroll: true });
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Apresentação: a transformação de uma fachada"
      className="hero-scroll relative"
    >
      <div className="hero-sticky sticky top-0 h-svh overflow-hidden bg-navy-900">
        {/* Poster is also the no-JS, failed-autoplay and reduced-motion fallback. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-hero-base
          src="/hero/inovare/renovation-poster.webp"
          width={1920}
          height={1080}
          alt="Cena ilustrativa da renovação de uma moradia."
          fetchPriority="high"
          className="hero-frame"
        />
        <video
          ref={videoRef}
          data-hero-video
          className={`hero-frame hero-video${manualPlayback ? ' hero-video-opt-in' : ''}`}
          poster="/hero/inovare/renovation-poster.webp"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
        />
        <div className="hero-stage">
          {/* Narrativa HTML independente do vídeo. */}

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
          <button
            type="button"
            className="hero-skip hero-pause"
            onClick={() => {
              if (reduced && !manualPlayback) {
                setManualPlayback(true);
                setPaused(false);
              } else setPaused((value) => !value);
            }}
            aria-pressed={paused || (reduced && !manualPlayback)}
          >
            {paused || (reduced && !manualPlayback) ? 'Reproduzir vídeo' : 'Pausar vídeo'}
          </button>
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
