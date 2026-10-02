import { test, expect } from '@playwright/test';

/* Secção de contacto (Sprint 4): canais diretos + formulário Netlify Forms.
 *
 * O envio real só existe em produção (a Netlify apanha o POST). Aqui
 * intercetamos o POST e devolvemos 200 — isso exercita o caminho AJAX
 * completo sem depender de infraestrutura externa. */

test.describe('Contacto', () => {
  test('secção de contacto tem canais diretos e social real', async ({ page }) => {
    await page.goto('/');

    const section = page.locator('section#contactos');
    await section.scrollIntoViewIfNeeded();

    /* Canais com os destinos canónicos. */
    await expect(section.getByRole('link', { name: /Ligar:/ })).toHaveAttribute(
      'href',
      'tel:+351913411051',
    );
    const whatsapp = section.getByRole('link', { name: 'WhatsApp' });
    await expect(whatsapp).toHaveAttribute('href', /wa\.me\/351913411051/);
    await expect(section.getByRole('link', { name: 'Enviar e-mail' })).toHaveAttribute(
      'href',
      'mailto:renovarepintura192619@gmail.com',
    );

    /* Só o Instagram real aparece — sem canais inventados (§9). */
    const instagram = section.getByRole('link', { name: /Ver no Instagram/ });
    await expect(instagram).toHaveAttribute('href', 'https://instagram.com/inovarepinturaa');
  });

  test('formulário tem campos, honeypot e atributos Netlify', async ({ page }) => {
    await page.goto('/');
    await page.locator('section#contactos').scrollIntoViewIfNeeded();

    const form = page.locator('section#contactos form[name="orcamento"]');
    await expect(form).toHaveAttribute('data-netlify', 'true');
    await expect(form.getByLabel(/Nome/)).toBeVisible();
    await expect(form.getByLabel(/Telefone/)).toBeVisible();
    await expect(form.getByLabel(/Tipo de trabalho/)).toBeVisible();
    await expect(form.locator('input[name="empresa"]')).toBeHidden();
  });

  test('submissão mostra confirmação inline', async ({ page }) => {
    /* Simula a Netlify: POST / com 200. */
    await page.route('/', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({ status: 200, body: 'ok' });
      } else {
        await route.continue();
      }
    });
    await page.goto('/');
    await page.locator('section#contactos').scrollIntoViewIfNeeded();

    const form = page.locator('section#contactos form[name="orcamento"]');
    await form.getByLabel(/Nome/).fill('Teste E2E');
    await form.getByLabel(/Telefone/).fill('+351 900 000 000');
    await form.getByLabel(/Tipo de trabalho/).selectOption({ index: 1 });
    await form.getByRole('button', { name: 'Pedir orçamento' }).click();

    await expect(page.locator('section#contactos [role="status"]')).toContainText(
      'Pedido recebido',
    );
  });

  test('página de confirmação existe (fallback sem JS)', async ({ page }) => {
    await page.goto('/orcamento-enviado');
    await expect(page.getByRole('heading', { name: 'Pedido recebido.' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Voltar à página inicial/ })).toHaveAttribute(
      'href',
      '/',
    );
  });

  test('rodapé tem navegação e privacidade', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer.getByRole('link', { name: 'Serviços' })).toHaveAttribute(
      'href',
      '/#servicos',
    );
    await expect(footer.getByRole('link', { name: 'Política de privacidade' })).toHaveAttribute(
      'href',
      '/privacidade',
    );
  });
});
