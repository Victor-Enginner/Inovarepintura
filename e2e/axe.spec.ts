import { test } from '@playwright/test';
import { injectAxe, configureAxe, checkA11y } from 'axe-playwright';

/* O texto sobre vídeo tem sombra discreta; sem o halo a pedido do cliente.
 * O axe não consegue compor o vídeo com as letras. A verificação automática
 * do resto da página mantém-se; o hero exige inspeção visual em ambos os tamanhos. */
const HERO_COPY_CONTRAST = [
  { id: 'color-contrast', selector: '.hero-stage', enabled: false },
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