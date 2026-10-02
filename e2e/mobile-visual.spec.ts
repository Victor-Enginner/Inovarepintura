import { test, expect } from '@playwright/test';

/* Estes testes só fazem sentido no projeto mobile. */
test.describe('Verificação visual em telemóvel', () => {
  test.skip(({ isMobile }) => !isMobile, 'Só corre em mobile');

  test('cutscene usa renderer de frames (não vídeo) em ecrã estreito', async ({ page }) => {
    await page.goto('/');

    /* Aguardar que a hidratação troque o renderer de 'none' para 'frames'. */
    await page.waitForFunction(() => {
      const section = document.querySelector('section[aria-label*="transformação"]');
      return section?.querySelector('img[src*="/cutscene/mobile/"]') !== null;
    });

    /* Em ecrã estreito, o renderer deve ser 'frames' — não deve existir <video>. */
    const video = page.locator('section[aria-label*="transformação"] video');
    await expect(video).not.toBeVisible();

    /* Deve existir uma sequência de imagens WebP. */
    const frames = page.locator('section[aria-label*="transformação"] img[src*="/cutscene/mobile/"]');
    const count = await frames.count();
    expect(count).toBeGreaterThan(0);
  });

  test('link "Saltar introdução" é alcançável e funciona em ecrã estreito', async ({
    page,
  }) => {
    await page.goto('/');

    const skipButton = page.getByRole('link', { name: 'Saltar introdução' });
    await expect(skipButton).toBeVisible();
    await skipButton.click();

    const hero = page.locator('#hero');
    await expect(hero).toBeInViewport();
  });

  test('CTA fixo no fundo não tapa o rodapé', async ({ page }) => {
    await page.goto('/');

    /* Saltar cutscene. */
    const skipButton = page.getByRole('link', { name: 'Saltar introdução' });
    await skipButton.click();

    /* Rolar até ao rodapé. */
    await page.locator('footer').scrollIntoViewIfNeeded();

    /* A barra fixa com Ligar + WhatsApp deve estar visível. */
    const stickyBar = page.locator('div.sticky.bottom-0');
    await expect(stickyBar.getByRole('link', { name: 'Ligar' })).toBeVisible();
    await expect(stickyBar.getByRole('link', { name: 'WhatsApp' })).toBeVisible();

    /* O rodapé deve estar visível (o CTA não o tapa completamente). */
    const footer = page.locator('footer');
    await expect(footer).toBeInViewport();
  });

  test('galeria mostra grelha (não carrossel magnético) em ecrã estreito', async ({ page }) => {
    await page.goto('/');

    const skipButton = page.getByRole('link', { name: 'Saltar introdução' });
    await skipButton.click();
    await page.getByRole('heading', { name: 'Trabalho real. Resultado visível.' }).scrollIntoViewIfNeeded();

    /* A grelha deve usar grid, não flex. */
    const list = page.locator('#trabalhos ul');
    const display = await list.evaluate((el) => window.getComputedStyle(el).display);
    expect(display).toBe('grid');
  });

  test('dialog abre e fecha ao toque em ecrã estreito', async ({ page }) => {
    await page.goto('/');

    const skipButton = page.getByRole('link', { name: 'Saltar introdução' });
    await skipButton.click();
    await page.getByRole('heading', { name: 'Trabalho real. Resultado visível.' }).scrollIntoViewIfNeeded();

    /* Abrir dialog com tap. */
    const firstPhoto = page.locator('#trabalhos ul li button').first();
    await firstPhoto.tap();
    const dialog = page.locator('dialog[aria-label="Fotografia ampliada"]');
    await expect(dialog).toBeVisible();

    /* Fechar com o botão Fechar. */
    await page.getByRole('button', { name: 'Fechar' }).tap();
    await expect(dialog).not.toBeVisible();
  });

  test('não há scroll horizontal em ecrã estreito', async ({ page }) => {
    await page.goto('/');

    const skipButton = page.getByRole('link', { name: 'Saltar introdução' });
    await skipButton.click();

    /* Rolar até ao fim da página. */
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // +1 para subpixel
  });
});
