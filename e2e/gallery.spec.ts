import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Galeria', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    /* Saltar a cutscene para chegar rapidamente à galeria. */
    const skipButton = page.getByRole('link', { name: 'Saltar introdução' });
    if (await skipButton.isVisible()) {
      await skipButton.click();
    }
    await page.getByRole('heading', { name: 'Trabalho real. Resultado visível.' }).scrollIntoViewIfNeeded();
  });

  test('abrir fotografia, navegar com setas, fechar com Escape e foco regressa', async ({
    page,
  }) => {
    /* Encontrar o primeiro botão da grelha (primeira fotografia). */
    const firstPhoto = page.locator('#trabalhos ul li button').first();
    await firstPhoto.click();

    /* O dialog deve estar aberto. */
    const dialog = page.locator('dialog[aria-label="Fotografia ampliada"]');
    await expect(dialog).toBeVisible();

    /* Navegar para a fotografia seguinte com a seta direita. */
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('text=2 de')).toBeVisible();

    /* Navegar de volta com a seta esquerda. */
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('text=1 de')).toBeVisible();

    /* Fechar com Escape. */
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();

    /* O foco deve regressar ao botão que abriu o diálogo. */
    await expect(firstPhoto).toBeFocused();
  });

  test('mudar de filtro altera a contagem anunciada', async ({ page }) => {
    const liveRegion = page.locator('#trabalhos [aria-live="polite"]');

    /* Começar com "Todos" — 11 trabalhos (real-005 liberado em 2026-09-30). */
    await expect(liveRegion).toContainText('11 trabalhos');

    /* Filtrar por Coberturas — 3 trabalhos. */
    await page.getByRole('button', { name: 'Coberturas' }).click();
    await expect(liveRegion).toContainText('3 trabalhos');

    /* Filtrar por Interiores — 2 trabalhos. */
    await page.getByRole('button', { name: 'Interiores' }).click();
    await expect(liveRegion).toContainText('2 trabalhos');
  });

  test('filtro "Todos" mostra todos os trabalhos publicáveis', async ({ page }) => {
    await page.getByRole('button', { name: 'Todos' }).click();
    const items = page.locator('#trabalhos ul li');
    await expect(items).toHaveCount(11);
  });

  test('não existe filtro de Remodelação (sem fotos reais)', async ({ page }) => {
    const remodelacao = page.getByRole('button', { name: 'Remodelação' });
    await expect(remodelacao).not.toBeVisible();
  });

  test('dialog é acessível', async ({ page }) => {
    const firstPhoto = page.locator('#trabalhos ul li button').first();
    await firstPhoto.click();

    await injectAxe(page);
    await checkA11y(page, 'dialog[aria-label="Fotografia ampliada"]', {
      detailedReport: true,
      detailedReportOptions: { html: true },
      axeOptions: {
        rules: {
          /* Imagens dentro do dialog têm alt, o botão fechar tem texto. */
          'color-contrast': { enabled: true },
        },
      },
    });
  });
});
