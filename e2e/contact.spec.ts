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
    /* Os atributos Netlify vivem no ficheiro HTML estático de deteção;
     * o JSX não os deve ter, senão o adapter v5 aborta o build. */
    await expect(form).not.toHaveAttribute('data-netlify');
    await expect(form).toHaveAttribute('action', '/orcamento-enviado.html');
    await expect(form.getByLabel(/Nome/)).toBeVisible();
    await expect(form.getByLabel(/Telefone/)).toBeVisible();
    await expect(form.getByLabel(/Tipo de trabalho/)).toBeVisible();
    await expect(form.locator('input[name="empresa"]')).toBeHidden();
  });

  test('submissão mostra confirmação inline', async ({ page }) => {
    /* Simula resposta HTTP do endpoint estático. Isto testa a UI/AJAX,
     * não substitui a verificação real de Netlify Forms em produção. */
    await page.route('**/orcamento-enviado.html', async (route) => {
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

  test('alvo estático inclui a declaração e os campos detetáveis pela Netlify', async ({ page }) => {
    const response = await page.request.get('/orcamento-enviado.html');
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain('<form name="orcamento"');
    expect(html).toContain('data-netlify="true"');
    expect(html).toContain('netlify-honeypot="empresa"');
    for (const field of ['form-name', 'nome', 'telefone', 'tipo', 'mensagem', 'empresa']) {
      expect(html).toContain(`name="${field}"`);
    }

    /* O alvo do POST mostra confirmação útil se JS estiver desativado. */
    await page.goto('/orcamento-enviado.html');
    await expect(page.getByRole('heading', { name: 'Pedido recebido.' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Voltar à página inicial/ })).toHaveAttribute(
      'href',
      '/',
    );
  });

  test('fallback nativo submete os campos quando JavaScript está desativado', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const noJsPage = await context.newPage();
    let postBody = '';

    /* Simula apenas o endpoint de receção para testar HTML/form encoding.
     * A submissão real de Netlify Forms continua a exigir validação em prod. */
    await noJsPage.route('**/orcamento-enviado.html', async (route) => {
      if (route.request().method() === 'POST') {
        postBody = route.request().postData() ?? '';
        await route.fulfill({
          status: 200,
          contentType: 'text/html; charset=utf-8',
          body: '<!doctype html><html lang="pt-PT"><h1>Pedido recebido.</h1></html>',
        });
      } else {
        await route.continue();
      }
    });

    await noJsPage.goto('/');
    const form = noJsPage.locator('section#contactos form[name="orcamento"]');
    await form.getByLabel(/^Nome$/).fill('Teste sem JavaScript');
    await form.getByLabel(/^Telefone$/).fill('+351 900 000 000');
    await form.getByLabel(/^Tipo de trabalho$/).selectOption({ index: 1 });
    await form.getByLabel(/Mensagem/).fill('Pedido de teste sem JS');
    await form.getByRole('button', { name: 'Pedir orçamento' }).click();

    await expect(noJsPage.getByRole('heading', { name: 'Pedido recebido.' })).toBeVisible();
    const submitted = new URLSearchParams(postBody);
    expect(submitted.get('form-name')).toBe('orcamento');
    expect(submitted.get('nome')).toBe('Teste sem JavaScript');
    expect(submitted.get('telefone')).toBe('+351 900 000 000');
    expect(submitted.get('tipo')).not.toBeNull();
    expect(submitted.get('mensagem')).toBe('Pedido de teste sem JS');

    await context.close();
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
