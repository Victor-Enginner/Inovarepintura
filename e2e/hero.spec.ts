import { test, expect, type Page } from '@playwright/test';

/* O hero deixou de ser a cutscene com vídeo e passou a ser um scrolltelling
 * de cinco frames (ADR-008). O que se verifica aqui é o que o briefing pediu:
 * que não há slideshow, que a sequência avança na ordem certa e que existe
 * uma saída para quem não quer a introdução. */

const SECTION = 'section[aria-label*="transformação"]';

/** Posição de scroll correspondente a uma fração do percurso do hero. */
async function scrollToProgress(page: Page, p: number) {
  await page.evaluate((target) => {
    const section = document.querySelector('section[aria-label*="transformação"]');
    if (!section) return;
    const scrollable = section.clientHeight - window.innerHeight;
    window.scrollTo({ top: scrollable * target, behavior: 'instant' });
  }, p);
  /* scrub: 1 é uma suavização de cerca de 1 s. */
  await page.waitForTimeout(1500);
}

test.describe('Hero scrolltelling', () => {
  test('as frases não aparecem antes de a animação arrancar', async ({ page }) => {
    /* Reproduz o F5: o script inline do <head> corre e marca `js`, mas os
     * ficheiros externos são bloqueados, por isso o GSAP nunca arranca.
     *
     * Sem este bloqueio, este teste passaria sempre: a hidratação é tão rápida
     * que o Playwright mediria sempre o estado final e nunca o intervalo
     * problemático — aquele entre o primeiro pixel e o primeiro efeito. Foi
     * nesse intervalo que as três frases apareceram sobrepostas. */
    await page.route('**/*.{js,mjs}', (route) => route.abort());

    await page.goto('/');

    /* O estado sem JavaScript tem de continuar a ser o mesmo: o palco
     * visível, com o nome e o contacto. */
    await expect(page.locator('[data-hero-reveal]')).toBeVisible();

    /* E nada de frases a espreitar. */
    const opacities = await page.evaluate(() =>
      Array.from(document.querySelectorAll('[data-hero-beat]')).map(
        (b) => getComputedStyle(b).opacity,
      ),
    );
    expect(opacities).toEqual(['0', '0', '0']);

    /* O halo também não pode estar aceso sem texto por trás. */
    expect(
      await page.evaluate(() => getComputedStyle(document.querySelector('[data-hero-halo]')!).opacity),
    ).toBe('0');
  });

  test('avança pelos cinco frames pela ordem certa, sem saltos', async ({ page }) => {
    await page.goto('/');
    await scrollToProgress(page, 0);

    /* No início só a base está visível: nenhum pedido antecipado. */
    const opacities = () =>
      page.evaluate(() => {
        const section = document.querySelector('section[aria-label*="transformação"]');
        return Array.from(section?.querySelectorAll('img[data-hero-layer]') ?? []).map(
          (i) => Number(getComputedStyle(i).opacity),
        );
      });

    expect(await opacities()).toEqual([0, 0, 0, 0]);

    const expected = [0.34, 0.54, 0.74, 1];

    for (const [step, p] of expected.entries()) {
      await scrollToProgress(page, p);
      const ops = await opacities();

      /* Os frames já revelados ficam opacos; os seguintes continuam limpos.
       * É isto que distingue uma transformação contínua de um slideshow. */
      for (let i = 0; i < ops.length; i += 1) {
        if (i <= step) expect(ops[i]).toBe(1);
        else expect(ops[i]).toBe(0);
      }
    }
  });

  test('o último frame segura e o reveal final aparece com o nome e o contacto', async ({
    page,
  }) => {
    await page.goto('/');

    await scrollToProgress(page, 1);

    const reveal = page.locator('[data-hero-reveal]');
    await expect(reveal).toHaveCSS('opacity', '1');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Transformamos espaços');

    /* O telefone é a via de conversão principal e tem de ser clicável. */
    const phone = page.locator('[data-hero-reveal] .hero-phone');
    await expect(phone).toBeVisible();
    await expect(phone).toHaveAttribute('href', 'tel:+351913411051');
  });

  test('o h1 só existe uma vez na página', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  });

  test('link "Saltar introdução" leva ao hero e move o foco', async ({ page }) => {
    await page.goto('/');

    /* É uma âncora <a href="#hero">, não um <button>: funciona antes da
     * hidratação e sem JavaScript (§6). O onClick só acrescenta o foco. */
    const skip = page.getByRole('link', { name: 'Saltar introdução' });
    await expect(skip).toBeVisible();
    await skip.click();

    await expect(page.locator('#hero')).toBeInViewport();
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('hero');
  });

  test('sem JavaScript fica a casa final com nome e contacto, nunca um vazio', async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/');

    const hero = page.locator(SECTION);
    await expect(hero).toBeVisible();

    /* O reveal final é o estado sem JavaScript: nome, promessa e telefone. */
    await expect(page.locator('[data-hero-reveal]')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('[data-hero-reveal] .hero-phone')).toBeVisible();

    /* E a secção não fica com 500vh de nada: sem script é um ecrã só. */
    const height = await hero.evaluate((el) => el.clientHeight);
    const viewport = await page.evaluate(() => window.innerHeight);
    expect(height).toBeLessThan(viewport * 1.2);

    await context.close();
  });

  test('com movimento reduzido mostra a casa final e não corre a timeline', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/');

    /* O <source media> faz o browser pedir o frame 5 em vez do 1. */
    const base = page.locator('[data-hero-base]');
    await expect(base).toBeVisible();
    expect(await base.evaluate((img: HTMLImageElement) => img.currentSrc)).toContain('frame-05');

    /* Um ecrã só, com o contacto à vista. */
    const height = await page.locator(SECTION).evaluate((el) => el.clientHeight);
    const viewport = await page.evaluate(() => window.innerHeight);
    expect(height).toBeLessThan(viewport * 1.2);

    await expect(page.locator('[data-hero-reveal]')).toBeVisible();
    await context.close();
  });
});