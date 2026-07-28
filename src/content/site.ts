/** Dados do negócio, derivados de `data/project-data.json` (S1-T04).
 *
 * Este ficheiro é a única ponte entre o JSON e a aplicação. Os URLs são
 * construídos a partir dos campos canónicos, nunca copiados — assim o
 * `tel:` e o `wa.me` não podem divergir do número.
 */

import projectData from '../../data/project-data.json';
import type { ContactChannel, PostalAddress, ProcessStep, Service } from './types';

const { brand, contact, address, serviceArea } = projectData;

export const site = {
  name: brand.name,
  tagline: brand.tagline,
  language: brand.language,
} as const;

export const postalAddress: PostalAddress = address;

/** Telefone. Confirmado pelo cartão de visita. */
export const phone: ContactChannel = {
  label: contact.phoneDisplay,
  href: `tel:${contact.phoneE164}`,
  needsConfirmation: false,
  analyticsEvent: 'phone_click',
};

/** Mensagem pré-preenchida do WhatsApp (copy aprovada em docs/04).
 *
 * Canal confirmado pelo cliente em 2026-07-28 (CLIENT-02 resolvido) — o
 * prefill está ativo. O conteúdo nunca vai para analytics (§16). */
const whatsappMessage =
  'Olá, Inovare Pintura. Encontrei o vosso site e gostaria de pedir ' +
  'informação sobre um trabalho de pintura, em Olhão.';

export const whatsapp: ContactChannel = {
  label: 'WhatsApp',
  href: `${contact.whatsappUrl}?text=${encodeURIComponent(whatsappMessage)}`,
  needsConfirmation: contact.whatsappNeedsConfirmation,
  analyticsEvent: 'whatsapp_click',
};

export const email: ContactChannel = {
  label: contact.email,
  href: contact.emailUrl,
  needsConfirmation: contact.emailNeedsConfirmation,
  analyticsEvent: 'email_click',
};

export const instagram: ContactChannel = {
  label: contact.instagramHandle,
  href: contact.instagramUrl,
  needsConfirmation: contact.instagramNeedsConfirmation,
  analyticsEvent: 'instagram_click',
};

/** Todos os canais, para o footer e o bloco de contacto. */
export const contactChannels = [phone, whatsapp, email, instagram] as const;

/** Todos os canais estão confirmados desde 2026-07-28 (CLIENT-01/02/03
 * resolvidos). `confirmedChannels` mantém-se como a lista usada onde um
 * contacto errado custaria um lead (CTAs principais). */
export const confirmedChannels = contactChannels.filter((c) => !c.needsConfirmation);

/** Localidades confirmadas. `needsConfirmation` fica de fora até CLIENT-06:
 * o §9 proíbe anunciar área de cobertura não confirmada. */
export const confirmedServiceArea: readonly string[] = serviceArea.confirmed;

/** Serviços, pela ordem definida em docs/03. Descrições da copy aprovada. */
export const services: readonly Service[] = [
  {
    id: 'pintura',
    name: 'Pintura interior e exterior',
    description:
      'Renovação de paredes, tetos e fachadas com preparação adequada ao ' +
      'estado e à exposição de cada superfície.',
  },
  {
    id: 'reparacoes',
    name: 'Reparações',
    description:
      'Correção de fissuras, zonas degradadas e pequenas patologias antes ' +
      'do acabamento.',
  },
  {
    id: 'remodelacao',
    name: 'Remodelação',
    description:
      'Intervenções coordenadas para atualizar ambientes e devolver ' +
      'conforto e coerência ao espaço.',
  },
  {
    id: 'pladur',
    name: 'Pladur',
    description:
      'Soluções em gesso cartonado para paredes, tetos, divisórias e ' +
      'detalhes interiores.',
  },
  {
    id: 'canalizacao',
    name: 'Canalização',
    description:
      'Intervenções associadas à manutenção e remodelação do imóvel, ' +
      'conforme avaliação do trabalho.',
  },
  {
    id: 'isolamento',
    name: 'Isolamento térmico',
    description:
      'Soluções para melhorar proteção, conforto e comportamento térmico ' +
      'do edifício, de acordo com a necessidade.',
  },
];

/** As cinco etapas do processo (docs/04). Sem promessa de visita gratuita —
 * docs/03 proíbe-o sem confirmação. */
export const processSteps: readonly ProcessStep[] = [
  {
    title: 'Falamos consigo',
    description: 'Percebemos o espaço, a necessidade e o resultado esperado.',
  },
  {
    title: 'Avaliamos o trabalho',
    description:
      'Observamos superfícies, acessos, preparação e materiais necessários.',
  },
  {
    title: 'Protegemos e preparamos',
    description: 'Organizamos a área e tratamos a base antes da aplicação.',
  },
  {
    title: 'Executamos com cuidado',
    description: 'Trabalhamos por etapas, com atenção ao detalhe e ao acabamento.',
  },
  {
    title: 'Revemos e entregamos',
    description: 'Confirmamos o resultado final consigo.',
  },
];
