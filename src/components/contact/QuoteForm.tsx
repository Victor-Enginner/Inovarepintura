'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { email, phone, services, whatsapp } from '@/content/site';

/* Formulário de pedido de orçamento (ADR-007: Netlify Forms).
 *
 * HTML puro pré-renderizado: sem JavaScript faz POST nativo e a Netlify
 * redireciona para o alvo HTML estático `action` (/orcamento-enviado.html).
 * Com JavaScript, o envio é por fetch para o mesmo alvo e o resultado aparece
 * inline, sem sair da página.
 *
 * Campos mínimos de propósito: nome, telefone, tipo de trabalho, mensagem.
 * Nada de morada ou NIF nesta fase. Mensagem opcional — o essencial para
 * responder é saber quem é e como ligar de volta.
 */

const FORM_NAME = 'orcamento';
const HONEYPOT_NAME = 'empresa';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const inputClass =
  'mt-2 block w-full min-h-11 rounded-md border border-border bg-white px-4 py-3 ' +
  'text-base text-navy-900 placeholder:text-text-muted/70 ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action';

export function QuoteForm() {
  const [status, setStatus] = useState<Status>('idle');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus('sending');

    try {
      /* Netlify Forms + Next.js 16 exige um alvo HTML estático detetável pelo
       * adapter; ver public/orcamento-enviado.html (OpenNext Forms docs).
       * URLSearchParams exige valores string, não File/FormDataEntryValue. */
      const formData = new FormData(form);
      const encoded = new URLSearchParams();
      for (const [key, value] of formData.entries()) {
        encoded.append(key, typeof value === 'string' ? value : value.name);
      }
      const response = await fetch('/orcamento-enviado.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encoded.toString(),
      });
      if (!response.ok) throw new Error(`POST / respondeu ${response.status}`);
      form.reset();
      setStatus('sent');
    } catch {
      /* Se o POST falhar, não repetimos nativamente para evitar duplicados.
       * Mostramos canais diretos como fallback acessível. Sem JS, o form faz
       * POST nativo para o HTML estático (action acima), processado pela
       * Netlify Forms e exibindo a confirmação desta página estática. */
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div
        role="status"
        className="rounded-lg border border-teal-700/30 bg-white p-8 text-center"
      >
        <p className="font-display text-2xl text-navy-900">Pedido recebido.</p>
        <p className="mt-3 text-base text-text-muted">
          Obrigado pelo contacto. Vamos ligar-lhe de volta assim que possível.
          Se for urgente, fale connosco já por{' '}
          <a
            href={phone.href}
            className="font-semibold text-navy-900 underline underline-offset-4 hover:text-action"
          >
            {phone.label}
          </a>{' '}
          ou{' '}
          <a
            href={whatsapp.href}
            rel="noopener noreferrer"
            target="_blank"
            className="font-semibold text-navy-900 underline underline-offset-4 hover:text-action"
          >
            WhatsApp
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      name={FORM_NAME}
      method="POST"
      action="/orcamento-enviado.html"
      onSubmit={onSubmit}
      className="rounded-lg border border-border bg-white p-6 sm:p-8"
    >
      {/* Sem isto a Netlify não associa a submissão ao formulário. */}
      <input type="hidden" name="form-name" value={FORM_NAME} />

      {/* Honeypot anti-spam: invisível para pessoas, irresistível para bots.
       * Preenchido = a Netlify descarta silenciosamente. */}
      <p className="hidden" aria-hidden="true">
        <label>
          Não preencher este campo:
          <input name={HONEYPOT_NAME} tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="orcamento-nome" className="block text-sm font-semibold text-navy-900">
            Nome
          </label>
          <input
            id="orcamento-nome"
            name="nome"
            type="text"
            required
            autoComplete="name"
            maxLength={80}
            placeholder="O seu nome"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="orcamento-telefone" className="block text-sm font-semibold text-navy-900">
            Telefone
          </label>
          <input
            id="orcamento-telefone"
            name="telefone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            placeholder="+351 …"
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="orcamento-tipo" className="block text-sm font-semibold text-navy-900">
          Tipo de trabalho
        </label>
        <select
          id="orcamento-tipo"
          name="tipo"
          required
          defaultValue=""
          className={inputClass}
        >
          <option value="" disabled>
            Escolha o mais próximo
          </option>
          {services.map((service) => (
            <option key={service.id} value={service.name}>
              {service.name}
            </option>
          ))}
          <option value="Outro">Outro / ainda não sei</option>
        </select>
      </div>

      <div className="mt-5">
        <label htmlFor="orcamento-mensagem" className="block text-sm font-semibold text-navy-900">
          Mensagem <span className="font-normal text-text-muted">(opcional)</span>
        </label>
        <textarea
          id="orcamento-mensagem"
          name="mensagem"
          rows={4}
          maxLength={1000}
          placeholder="Conte-nos em poucas palavras o que precisa"
          className={inputClass}
        />
      </div>

      <p className="mt-5 text-sm text-text-muted">
        Ao enviar, os seus dados serão usados para responder a este pedido e
        processados pela Netlify para entrega do formulário — ver a{' '}
        <a href="/privacidade" className="underline underline-offset-4 hover:text-action">
          política de privacidade
        </a>
        .
      </p>

      {status === 'error' && (
        <p role="alert" className="mt-4 rounded-md border border-copper-700/40 bg-white p-4 text-sm text-navy-900">
          Não conseguimos enviar agora. Tente de novo ou fale connosco
          diretamente por{' '}
          <a href={phone.href} className="font-semibold underline underline-offset-4">
            {phone.label}
          </a>{' '}
          ou{' '}
          <a
            href={whatsapp.href}
            rel="noopener noreferrer"
            target="_blank"
            className="font-semibold underline underline-offset-4"
          >
            WhatsApp
          </a>
          .
        </p>
      )}

      <div className="mt-6">
        <Button type="submit" disabled={status === 'sending'} className="w-full sm:w-auto">
          {status === 'sending' ? 'A enviar…' : 'Pedir orçamento'}
        </Button>
        <span className="mt-3 block text-sm text-text-muted sm:ml-4 sm:mt-0 sm:inline">
          ou por{' '}
          <a href={email.href} className="underline underline-offset-4 hover:text-action">
            e-mail
          </a>
        </span>
      </div>
    </form>
  );
}
