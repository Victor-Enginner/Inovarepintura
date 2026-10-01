import { describe, expect, it } from 'vitest';
import projectData from '../../data/project-data.json';
import assetsData from '../../data/assets.json';
import {
  galleryImages,
  imagesByCategory,
  pairedImages,
  pairsAwaitingConfirmation,
  publishableImages,
} from './gallery';
import { contactChannels, email, instagram, phone, whatsapp } from './site';

describe('galeria', () => {
  /* O risco que este teste cobre é um release blocker do docs/09:
   * "imagem gerada dentro de Trabalhos". */
  it('não deixa passar nenhuma imagem gerada', () => {
    for (const image of galleryImages) {
      expect(image.provenance).toBe('real');
    }
  });

  it('exclui os assets gerados que existem no JSON', () => {
    const generatedIds = new Set(assetsData.generated.map((a) => a.id));
    for (const image of galleryImages) {
      expect(generatedIds.has(image.id)).toBe(false);
    }
    // Garante que o teste acima não passa por a lista estar vazia.
    expect(assetsData.generated.length).toBeGreaterThan(0);
    expect(galleryImages.length).toBe(11);
  });

  it('filtra por categoria sem perder nem inventar imagens', () => {
    // "Todos" mostra o que é publicável, não o inventário completo.
    // Desde 2026-09-30 os dois coincidem: real-005 foi liberado (CLIENT-04).
    expect(imagesByCategory('todos')).toHaveLength(publishableImages.length);
    const exteriores = imagesByCategory('exteriores');
    expect(exteriores.length).toBeGreaterThan(0);
    for (const image of exteriores) {
      expect(image.category).toBe('exteriores');
    }
  });

  it('não tem fotos de remodelação — o filtro exigido pelo §12 ficaria vazio', () => {
    /* Documenta CLIENT-07 como facto verificável. Quando o cliente fornecer
     * fotos, este teste falha e obriga a rever a UI do filtro. */
    expect(imagesByCategory('remodelacao')).toHaveLength(0);
  });

  it('agrupa pares antes/depois da mesma obra', () => {
    const pairs = pairedImages();
    expect(pairs.get('moradia-ocre-01')).toHaveLength(2);
    for (const [, group] of pairs) {
      expect(group.length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('consentimento e publicação', () => {
  /* CLIENT-04 resolvido em 2026-09-30: o cliente confirmou o consentimento
   * do trabalhador em real-005. A regra continua valendo para fotos novas. */
  it('real-005 tem consentimento confirmado e é publicável', () => {
    const inDataset = galleryImages.find((i) => i.id === 'real-005');
    expect(inDataset?.personVisible).toBe(true);
    expect(inDataset?.consentConfirmedAt).toBe('2026-09-30');

    expect(publishableImages.some((i) => i.id === 'real-005')).toBe(true);
  });

  it('nenhuma foto com pessoa identificável publica sem consentimento', () => {
    /* Invariante permanente do §11: se entrar uma foto nova de pessoa sem
     * `consentConfirmedAt`, este teste falha antes de chegar a produção. */
    for (const image of galleryImages) {
      if (image.personVisible === true) {
        expect(image.consentConfirmedAt).toBeDefined();
      }
    }
    expect(publishableImages).toHaveLength(galleryImages.length);
  });

  it('não tem pares por confirmar (CLIENT-05 resolvido em 2026-09-30)', () => {
    /* Os três pares foram confirmados como a mesma intervenção. Um par
     * novo sem `pairConfirmedAt` aparece aqui e bloqueia o slider. */
    expect(pairsAwaitingConfirmation()).toEqual([]);
  });
});

describe('contactos', () => {
  /* §10: os links têm de derivar do JSON. Se alguém escrever um número à
   * mão num componente, estes testes não o apanham — mas apanham a
   * divergência entre a fonte e o que é exposto. */
  it('deriva o tel: do número canónico', () => {
    expect(phone.href).toBe(`tel:${projectData.contact.phoneE164}`);
    expect(phone.label).toBe(projectData.contact.phoneDisplay);
  });

  it('constrói o WhatsApp a partir do URL canónico com mensagem codificada', () => {
    expect(whatsapp.href.startsWith(projectData.contact.whatsappUrl)).toBe(true);
    expect(whatsapp.href).toContain('?text=');
    expect(whatsapp.href).not.toContain(' ');
  });

  it('todos os canais estão confirmados pelo cliente', () => {
    /* CLIENT-01/02/03 resolvidos em 2026-07-28: e-mail, WhatsApp e Instagram
     * confirmados diretamente pelo cliente. O Instagram foi corrigido para
     * @inovarepinturaa (duplo 'a') nessa validação. */
    expect(email.needsConfirmation).toBe(false);
    expect(whatsapp.needsConfirmation).toBe(false);
    expect(instagram.needsConfirmation).toBe(false);
    expect(phone.needsConfirmation).toBe(false);
  });

  it('Instagram usa o handle correto com duplo a', () => {
    /* O handle real é @inovarepinturaa — o @inovarepintura estava ocupado.
     * Um typo aqui enviaria visitantes para uma conta alheia. */
    expect(instagram.label).toBe('@inovarepinturaa');
    expect(instagram.href).toBe('https://instagram.com/inovarepinturaa');
  });

  it('associa a cada canal um evento de analytics da lista fechada do §16', () => {
    const allowed = new Set([
      'phone_click',
      'whatsapp_click',
      'email_click',
      'instagram_click',
    ]);
    for (const channel of contactChannels) {
      expect(allowed.has(channel.analyticsEvent)).toBe(true);
    }
  });

  it('não expõe contactos em texto que não venha da fonte central', () => {
    expect(email.href).toBe(projectData.contact.emailUrl);
    expect(instagram.href).toBe(projectData.contact.instagramUrl);
  });
});
