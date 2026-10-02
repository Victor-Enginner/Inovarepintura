import { readFileSync } from 'node:fs';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { QuoteForm } from './QuoteForm';
import { services } from '@/content/site';

/* O vitest corre sem `globals: true`, por isso o cleanup automático do
 * Testing Library não se regista — cada render ficaria no DOM e os testes
 * seguintes veriam elementos a duplicar. Limpeza explícita por teste. */
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function fillValidForm() {
  fireEvent.change(screen.getByLabelText(/^Nome$/), { target: { value: 'Maria Silva' } });
  fireEvent.change(screen.getByLabelText(/^Telefone$/), { target: { value: '+351 912 345 678' } });
  fireEvent.change(screen.getByLabelText(/^Tipo de trabalho$/), {
    target: { value: services[0]!.name },
  });
}

describe('QuoteForm', () => {
  it('mostra os quatro campos com rótulos acessíveis', () => {
    render(<QuoteForm />);
    expect(screen.getByLabelText(/^Nome$/)).toHaveAttribute('name', 'nome');
    expect(screen.getByLabelText(/^Telefone$/)).toHaveAttribute('name', 'telefone');
    expect(screen.getByLabelText(/^Tipo de trabalho$/)).toHaveAttribute('name', 'tipo');
    expect(screen.getByLabelText(/Mensagem/)).toHaveAttribute('name', 'mensagem');
  });

  it('marca nome, telefone e tipo como obrigatórios; mensagem é opcional', () => {
    render(<QuoteForm />);
    expect(screen.getByLabelText(/^Nome$/)).toBeRequired();
    expect(screen.getByLabelText(/^Telefone$/)).toBeRequired();
    expect(screen.getByLabelText(/^Tipo de trabalho$/)).toBeRequired();
    expect(screen.getByLabelText(/Mensagem/)).not.toBeRequired();
  });

  it('tem declaração HTML estática necessária ao adaptador Next.js da Netlify', () => {
    /* O OpenNext adapter não deteta o JSX prerenderizado da app router. Esta
     * definição em public/ é necessária para evitar erro do plugin e registar
     * os nomes de campos permitidos antes de aceitar submissões. */
    const staticHtml = readFileSync('public/orcamento-enviado.html', 'utf8');
    expect(staticHtml).toMatch(/<form[^>]*?\s(netlify|data-netlify)[=>\s]/);
    expect(staticHtml).toContain('<form name="orcamento"');
    expect(staticHtml).toContain('data-netlify="true"');
    expect(staticHtml).toContain('netlify-honeypot="empresa"');
    const staticDoc = new DOMParser().parseFromString(staticHtml, 'text/html');
    const staticForm = staticDoc.querySelector('form[name="orcamento"]');
    expect(staticForm).not.toBeNull();
    const staticFields = Array.from(staticForm!.querySelectorAll('[name]'))
      .map((field) => field.getAttribute('name'))
      .sort();
    const { container } = render(<QuoteForm />);
    const appForm = container.querySelector('form[name="orcamento"]')!;
    const appFields = Array.from(appForm.querySelectorAll('[name]'))
      .map((field) => field.getAttribute('name'))
      .sort();
    expect(staticFields).toEqual(appFields);
    expect(
      (staticForm!.querySelector('input[name="form-name"]') as HTMLInputElement).value,
    ).toBe('orcamento');
  });

  it('mantém o JSX sem atributos Netlify incompatíveis com o adapter v5', () => {
    /* A definição existe no HTML estático acima. Se estes atributos forem
     * colocados no JSX, o adapter v5 considera a migração incompleta e
     * termina o build com erro. */
    const { container } = render(<QuoteForm />);
    const form = container.querySelector('form')!;
    /* O adapter Next.js requer declaração de deteção separada em public/.
     * Pôr data-netlify no JSX faz o plugin falhar com mensagem de migração. */
    expect(form).not.toHaveAttribute('data-netlify');
    expect(form).toHaveAttribute('name', 'orcamento');
    expect(form).toHaveAttribute('action', '/orcamento-enviado.html');
    const formName = form.querySelector('input[name="form-name"]');
    expect(formName).toHaveAttribute('value', 'orcamento');
    expect(form.querySelector('input[name="empresa"]')).not.toBeNull();
  });

  it('o select lista os serviços reais mais a opção "Outro"', () => {
    render(<QuoteForm />);
    const options = Array.from(
      screen.getByLabelText(/^Tipo de trabalho$/).querySelectorAll('option'),
    ).map((o) => o.textContent);
    for (const service of services) {
      expect(options).toContain(service.name);
    }
    expect(options).toContain('Outro / ainda não sei');
  });

  it('envia URL-encoded para o HTML estático e confirma o sucesso', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);
    render(<QuoteForm />);
    fillValidForm();
    fireEvent.change(screen.getByLabelText(/Mensagem/), {
      target: { value: 'Pintura da sala' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Pedir orçamento' }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Pedido recebido');
    });
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith(
      '/orcamento-enviado.html',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: expect.stringContaining('form-name=orcamento'),
      }),
    );
    expect(fetchMock.mock.calls[0]?.[1]?.body).toContain('mensagem=Pintura+da+sala');
    // A confirmação oferece os canais diretos para casos urgentes.
    expect(screen.getByRole('status').textContent).toContain('WhatsApp');
  });

  it('mostra os canais diretos quando o envio falha', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    render(<QuoteForm />);
    fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: 'Pedir orçamento' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    expect(screen.getByRole('alert').textContent).toContain('WhatsApp');
  });

  it('liga a política de privacidade junto ao botão', () => {
    render(<QuoteForm />);
    expect(screen.getByRole('link', { name: /política de privacidade/i })).toHaveAttribute(
      'href',
      '/privacidade',
    );
  });
});
