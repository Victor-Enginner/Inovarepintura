import { test } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Acessibilidade (axe)', () => {
  test('secções principais sem violações críticas ou sérias', async ({ page }) => {
    await page.goto('/');

    /* Saltar a cutscene. */
    const skipButton = page.getByRole('link', { name: 'Saltar introdução' });
    if (await skipButton.isVisible()) {
      await skipButton.click();
    }

    await injectAxe(page);
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
