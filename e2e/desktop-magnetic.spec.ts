import { test, expect } from '@playwright/test';

/* Estes testes só fazem sentido no projeto desktop (pointer: fine, ecrã largo). */
test.describe('Carrossel magnético em desktop', () => {
  test.skip(({ isMobile }) => !!isMobile, 'Só corre em desktop');

  test('galeria em modo magnético mostra barras em ecrã largo', async ({ page }) => {
    await page.goto('/');

    const skipButton = page.getByRole('link', { name: 'Saltar introdução' });
    await skipButton.click();
    await page.getByRole('heading', { name: 'Trabalho real. Resultado visível.' }).scrollIntoViewIfNeeded();

    /* Aguardar que a hidratação ative o modo magnético. */
    await page.waitForFunction(() => {
      const list = document.querySelector('#trabalhos ul');
      return list && window.getComputedStyle(list).display === 'flex';
    });

    /* Em ecrã largo com pointer: fine, deve estar em modo flex (magnético). */
    const list = page.locator('#trabalhos ul');
    const display = await list.evaluate((el) => window.getComputedStyle(el).display);
    expect(display).toBe('flex');
  });

  test('onze barras cabem em ecrã de 1280 px sem transbordar', async ({ page }) => {
    await page.goto('/');

    const skipButton = page.getByRole('link', { name: 'Saltar introdução' });
    await skipButton.click();
    await page.getByRole('heading', { name: 'Trabalho real. Resultado visível.' }).scrollIntoViewIfNeeded();

    /* Aguardar modo magnético. */
    await page.waitForFunction(() => {
      const list = document.querySelector('#trabalhos ul');
      return list && window.getComputedStyle(list).display === 'flex';
    });

    const list = page.locator('#trabalhos ul');
    const box = await list.boundingBox();
    expect(box).not.toBeNull();
    /* A lista não deve exceder a largura do viewport. */
    expect(box!.width).toBeLessThanOrEqual(1280);
  });

  test('navegação por Tab magnetiza a barra focada', async ({ page }) => {
    await page.goto('/');

    const skipButton = page.getByRole('link', { name: 'Saltar introdução' });
    await skipButton.click();
    await page.getByRole('heading', { name: 'Trabalho real. Resultado visível.' }).scrollIntoViewIfNeeded();

    /* Aguardar modo magnético. */
    await page.waitForFunction(() => {
      const list = document.querySelector('#trabalhos ul');
      return list && window.getComputedStyle(list).display === 'flex';
    });

    /* Tab até à primeira fotografia. */
    const firstPhoto = page.locator('#trabalhos ul li button').first();
    await firstPhoto.focus();

    /* Aguardar a animação da barra. */
    await page.waitForTimeout(300);

    /* A barra deve crescer quando focada (largura maior que 96px). */
    const firstLi = page.locator('#trabalhos ul li').first();
    const width = await firstLi.evaluate((el) => el.getBoundingClientRect().width);
    expect(width).toBeGreaterThan(96);
  });

  test('filtro com poucas fotografias mantém o efeito funcional', async ({ page }) => {
    await page.goto('/');

    const skipButton = page.getByRole('link', { name: 'Saltar introdução' });
    await skipButton.click();
    await page.getByRole('heading', { name: 'Trabalho real. Resultado visível.' }).scrollIntoViewIfNeeded();

    /* Aguardar modo magnético. */
    await page.waitForFunction(() => {
      const list = document.querySelector('#trabalhos ul');
      return list && window.getComputedStyle(list).display === 'flex';
    });

    /* Filtrar por Interiores (2 fotografias). */
    await page.getByRole('button', { name: 'Interiores' }).click();

    /* As barras devem continuar a existir e a ser interativas. */
    const items = page.locator('#trabalhos ul li');
    await expect(items).toHaveCount(2);

    /* O modo magnético deve continuar ativo. */
    const list = page.locator('#trabalhos ul');
    const display = await list.evaluate((el) => window.getComputedStyle(el).display);
    expect(display).toBe('flex');
  });
});
