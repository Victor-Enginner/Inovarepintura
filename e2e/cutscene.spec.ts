import { test, expect } from '@playwright/test';

test.describe('Cutscene', () => {
  test('link "Saltar introdução" leva ao hero', async ({ page }) => {
    await page.goto('/');

    /* É uma âncora <a href="#hero">, não um <button>: a âncora funciona
     * mesmo antes da hidratação e sem JavaScript (§6). O onClick só
     * acrescenta o foco. */
    const skipButton = page.getByRole('link', { name: 'Saltar introdução' });
    await expect(skipButton).toBeVisible();
    await skipButton.click();

    /* O hero deve estar visível após saltar. */
    const hero = page.locator('#hero');
    await expect(hero).toBeInViewport();

    /* O foco deve ter sido movido para o hero. */
    const focused = await page.evaluate(() => document.activeElement?.id);
    expect(focused).toBe('hero');
  });

  test('texto da cutscene é legível e não sai do ecrã', async ({ page }) => {
    await page.goto('/');

    /* A primeira frase deve estar visível no início. */
    const firstBeat = page.getByText('Antes da cor, há uma história.');
    await expect(firstBeat).toBeVisible();

    /* Rolar para o meio da cutscene. */
    await page.evaluate(() => {
      const section = document.querySelector('section[aria-label*="transformação"]');
      if (section) {
        const height = section.scrollHeight;
        window.scrollTo(0, height * 0.3);
      }
    });

    /* Uma frase intermédia deve estar visível. */
    const midBeat = page.getByText('Preparar é onde começa o acabamento.');
    await expect(midBeat).toBeVisible();
  });
});
