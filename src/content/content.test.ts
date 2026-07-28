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
    // "Todos" mostra o que é publicável, não o inventário completo:
    // real-005 fica de fora até haver consentimento (CLIENT-04).
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
  /* Release blocker do docs/09: "fotografia pessoal sem consentimento". */
  it('exclui da publicação a foto com trabalhador identificável', () => {
    const inDataset = galleryImages.find((i) => i.id === 'real-005');
    expect(inDataset?.personVisible).toBe(true);
    expect(inDataset?.publicationNeedsConsent).toBe(true);

    // Existe no inventário, mas nunca na lista que a UI consome.
    expect(publishableImages.some((i) => i.id === 'real-005')).toBe(false);
    expect(imagesByCategory('exteriores').some((i) => i.id === 'real-005')).toBe(false);
  });

  it('nenhuma imagem publicável espera consentimento', () => {
    for (const image of publishableImages) {
      expect(image.publicationNeedsConsent).not.toBe(true);
    }
    expect(publishableImages).toHaveLength(galleryImages.length - 1);
  });

  it('mantém os três pares por confirmar (CLIENT-05)', () => {
    /* Enquanto o cliente não confirmar que cada par é a mesma intervenção,
     * nenhum slider pode ser rotulado "antes/depois". */
    expect([...pairsAwaitingConfirmation()].sort()).toEqual([
      'interior-01',
      'moradia-ocre-01',
      'terraco-01',
    ]);
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

  it('mantém e-mail, WhatsApp e Instagram marcados por confirmar', () => {
    /* CLIENT-01/02/03. Se algum destes passar a false sem o cliente ter
     * confirmado, o teste falha e trava o release. */
    expect(email.needsConfirmation).toBe(true);
    expect(whatsapp.needsConfirmation).toBe(true);
    expect(instagram.needsConfirmation).toBe(true);
    expect(phone.needsConfirmation).toBe(false);
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
