import { test, expect } from '@playwright/test';

test.describe('Navegação por teclado', () => {
  test('percorrer a página só com Tab, sem ficar preso', async ({ page }) => {
    await page.goto('/');

    /* Aguardar a hidratação: o botão "Saltar introdução" só é renderizado
     * depois do renderer ser escolhido no cliente. Sem esta espera, a ordem
     * de tabulação muda a meio do teste e o resultado é intermitente. */
    await page.getByRole('button', { name: 'Saltar introdução' }).waitFor();

    /* Percorrer 25 elementos com Tab e registar o índice de cada um na lista
     * de focáveis do documento. Índices estritamente crescentes provam que o
     * foco avança sem armadilhas nem regressos inesperados. */
    const indices: number[] = [];
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press('Tab');
      const index = await page.evaluate(() => {
        const focusables = Array.from(
          document.querySelectorAll(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        );
        return focusables.indexOf(document.activeElement as Element);
      });
      indices.push(index);
    }

    /* Cada Tab tem de parar num elemento focável conhecido. */
    for (const index of indices) {
      expect(index).toBeGreaterThan(-1);
    }

    /* Sem armadilhas: a sequência é crescente (nunca regressa a um elemento
     * anterior dentro da página). */
    const sorted = [...indices].sort((a, b) => a - b);
    expect(indices).toEqual(sorted);

    /* E avança de facto: pelo menos 10 elementos distintos visitados. */
    expect(new Set(indices).size).toBeGreaterThanOrEqual(10);
  });

  test('skip link leva ao conteúdo principal', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    const main = page.locator('#conteudo');
    await expect(main).toBeInViewport();
  });
});
