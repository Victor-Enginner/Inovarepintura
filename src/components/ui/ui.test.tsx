import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button, LinkButton } from './Button';
import { Heading, VisuallyHidden } from './primitives';

describe('Button', () => {
  it('usa type="button" por omissão, para não submeter formulários por acidente', () => {
    render(<Button>Pedir orçamento</Button>);
    expect(screen.getByRole('button', { name: 'Pedir orçamento' })).toHaveAttribute(
      'type',
      'button',
    );
  });

  it('expõe o estado desativado à árvore de acessibilidade', () => {
    render(<Button disabled>Indisponível</Button>);
    expect(screen.getByRole('button', { name: 'Indisponível' })).toBeDisabled();
  });
});

describe('LinkButton', () => {
  it('continua a ser um link, para funcionar sem JavaScript', () => {
    render(<LinkButton href="tel:+351913411051">Ligar</LinkButton>);
    const link = screen.getByRole('link', { name: 'Ligar' });
    expect(link).toHaveAttribute('href', 'tel:+351913411051');
  });

  it('protege links externos com rel=noopener noreferrer', () => {
    render(<LinkButton href="https://instagram.com/inovarepintura">Instagram</LinkButton>);
    expect(screen.getByRole('link', { name: 'Instagram' })).toHaveAttribute(
      'rel',
      'noopener noreferrer',
    );
  });

  it('não põe rel em links internos', () => {
    render(<LinkButton href="#trabalhos">Ver trabalhos</LinkButton>);
    expect(screen.getByRole('link', { name: 'Ver trabalhos' })).not.toHaveAttribute('rel');
  });
});

describe('Heading', () => {
  it('separa o nível semântico do tamanho visual, evitando saltos na árvore', () => {
    render(
      <Heading level={3} size="4xl">
        Título grande mas h3
      </Heading>,
    );
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Título grande mas h3',
    );
  });
});

describe('VisuallyHidden', () => {
  it('mantém o texto acessível a leitores de ecrã', () => {
    render(<VisuallyHidden>Abre em novo separador</VisuallyHidden>);
    // Estaria ausente se usássemos display:none ou hidden.
    expect(screen.getByText('Abre em novo separador')).toBeInTheDocument();
  });
});
