import { Container, Heading, Prose } from '@/components/ui/primitives';
import { LinkButton } from '@/components/ui/Button';
import { phone } from '@/content/site';

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-display text-6xl text-navy-900" aria-hidden="true">
        404
      </p>
      <Heading level={1} size="3xl" className="mt-6 text-navy-900">
        Página não encontrada
      </Heading>
      <Prose className="mt-4">
        A página que procura não existe ou foi movida.
      </Prose>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <LinkButton href="/" variant="primary">
          Voltar à página inicial
        </LinkButton>
        <LinkButton href={phone.href} variant="secondary">
          Ligar: {phone.label}
        </LinkButton>
      </div>
    </Container>
  );
}
