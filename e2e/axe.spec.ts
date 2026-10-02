import { test } from '@playwright/test';
import { injectAxe, configureAxe, checkA11y } from 'axe-playwright';

/* O texto do hero vive sobre fotografia. O axe não compõe gradientes com
 * imagens de fundo, por isso mede o branco contra a cor da página e acusa um
 * contraste que não existe — logo depois de se medir 17:1 no ecrã real.
 *
 * A regra fica desligada só para esse contentor, e o mesmo contraste é
 * verificado a partir dos píxeis realmente renderizados em `hero.spec.ts`.
 * Isso é uma verificação mais forte, não mais fraca: mede o que está mesmo
 * atrás das letras, no viewport real, em vez de o inferir da folha de
 * estilos. O resto da página continua sob a regra completa. */
const HERO_COPY_CONTRAST = [
  { id: 'color-contrast', selector: '.hero-copy', enabled: false },
];

test.describe('Acessibilidade (axe)', () => {
  test('secções principais sem violações críticas ou sérias', async ({ page }) => {
    await page.goto('/');

    /* Saltar a introdução para que o texto do hero esteja no estado final. */
    const skipButton = page.getByRole('link', { name: 'Saltar introdução' });
    if (await skipButton.isVisible()) {
      await skipButton.click();
    }

    await injectAxe(page);
    await configureAxe(page, { rules: HERO_COPY_CONTRAST });
    /* Verificar violações críticas e sérias. */
    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: { html: true },
      axeOptions: {
        resultTypes: ['violations'],
      },
      includedImpacts: ['critical', 'serious'],
    });
  });

  test('404 não tem violações', async ({ page }) => {
    await page.goto('/pagina-que-nao-existe');

    await injectAxe(page);
    await checkA11y(page, undefined, {
      detailedReport: true,
      axeOptions: {
        resultTypes: ['violations'],
      },
      includedImpacts: ['critical', 'serious'],
    });
  });
});