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

  it('traz os atributos que a Netlify exige para detetar o formulário', () => {
    /* ADR-007: se a secção passar a renderizar por JS, o HTML estático perde
     * o formulário e a Netlify deixa de o detetar em silêncio. Este teste
     * trava isso. */
    const { container } = render(<QuoteForm />);
    const form = container.querySelector('form')!;
    expect(form).toHaveAttribute('data-netlify', 'true');
    expect(form).toHaveAttribute('name', 'orcamento');
    expect(form).toHaveAttribute('action', '/orcamento-enviado');
    expect(form).toHaveAttribute('netlify-honeypot', 'empresa');
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

  it('mostra confirmação inline quando o envio corre bem', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));
    render(<QuoteForm />);
    fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: 'Pedir orçamento' }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Pedido recebido');
    });
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
