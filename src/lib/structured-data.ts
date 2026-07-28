import {
  confirmedServiceArea,
  instagram,
  phone,
  postalAddress,
  services,
  site,
} from '@/content/site';

/** JSON-LD para pesquisa local.
 *
 * Só entra aqui o que está confirmado. Nada de `openingHours`, `aggregateRating`
 * ou `priceRange` inventados: dados estruturados falsos são pior do que
 * ausentes — o Google penaliza e o cliente fica exposto.
 *
 * `sameAs` inclui o Instagram apenas quando o handle for validado (CLIENT-03).
 */
export function localBusinessJsonLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': `${siteUrl}#business`,
    name: site.name,
    url: siteUrl,
    telephone: phone.label,
    address: {
      '@type': 'PostalAddress',
      streetAddress: postalAddress.streetAddress,
      postalCode: postalAddress.postalCode,
      addressLocality: postalAddress.addressLocality,
      addressRegion: postalAddress.addressRegion,
      addressCountry: postalAddress.addressCountry,
    },
    areaServed: confirmedServiceArea.map((name) => ({ '@type': 'Place', name })),
    ...(instagram.needsConfirmation ? {} : { sameAs: [instagram.href] }),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Serviços',
      itemListElement: services.map((service) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: service.name },
      })),
    },
  };
}
