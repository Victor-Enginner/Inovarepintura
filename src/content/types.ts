/** Contratos de conteúdo (S1-T04).
 *
 * Regra do CLAUDE.md §10: `data/project-data.json` é a fonte central dos
 * contactos. Nenhum componente escreve um número, e-mail ou URL à mão — tudo
 * deriva daqui. Se um contacto mudar, muda num sítio só.
 */

/** Um canal de contacto e o seu estado de validação.
 *
 * `needsConfirmation` existe porque o e-mail e o WhatsApp ainda não foram
 * validados pelo cliente (CLIENT-01, CLIENT-02, CLIENT-03). O `docs/13` é
 * explícito: dados não confirmados não podem chegar a produção como facto.
 * O tipo obriga quem consome a tomar uma decisão consciente sobre isso.
 */
export interface ContactChannel {
  /** Texto para mostrar ao utilizador. */
  readonly label: string;
  /** URL de destino (tel:, mailto:, https:). */
  readonly href: string;
  /** Se true, o canal ainda não foi validado pelo cliente. */
  readonly needsConfirmation: boolean;
  /** Evento de analytics associado (CLAUDE.md §16). Nunca leva PII. */
  readonly analyticsEvent: AnalyticsEvent;
}

/** Os nove eventos mínimos do CLAUDE.md §16. Lista fechada de propósito:
 * um evento novo exige uma decisão, não um typo. */
export type AnalyticsEvent =
  | 'cta_quote_click'
  | 'phone_click'
  | 'whatsapp_click'
  | 'email_click'
  | 'instagram_click'
  | 'gallery_open'
  | 'before_after_interaction'
  | 'intro_skip'
  | 'intro_complete';

export interface PostalAddress {
  readonly streetAddress: string;
  readonly postalCode: string;
  readonly addressLocality: string;
  readonly addressRegion: string;
  readonly addressCountry: string;
  /** NAP numa linha — tem de ser idêntico ao Google Business Profile (§13). */
  readonly display: string;
}

/** Categorias da galeria. "remodelacao" está no contrato porque o filtro é
 * exigido (§12), mas ainda não existe nenhuma foto real assim classificada —
 * ver CLIENT-07. O código não pode inventar uma. */
export type GalleryCategory =
  | 'exteriores'
  | 'interiores'
  | 'coberturas'
  | 'remodelacao';

export type GalleryStage = 'antes' | 'durante' | 'resultado';

/** Distingue prova real de atmosfera gerada.
 *
 * Invariante do CLAUDE.md §11: nada com `provenance: 'generated'` pode
 * aparecer em "Trabalhos realizados". Os tipos abaixo tornam isso
 * verificável em vez de ficar dependente de disciplina. */
export type Provenance = 'real' | 'generated';

export interface GalleryImage {
  readonly id: string;
  readonly src: string;
  readonly category: GalleryCategory;
  readonly stage: GalleryStage;
  readonly title: string;
  readonly alt: string;
  /** Sempre 'real' — o tipo impede que uma imagem gerada entre na galeria. */
  readonly provenance: 'real';
  /** Agrupa antes/depois da mesma obra. Slider só após o par estar
   * confirmado (`pairConfirmedAt` presente) — CLIENT-05. */
  readonly pairId?: string | undefined;
  /** Data ISO da confirmação do cliente de que o par é a mesma intervenção.
   * Substitui `pairNeedsConfirmation` (resolvido em 2026-09-30). */
  readonly pairConfirmedAt?: string | undefined;
  /** True quando há uma pessoa identificável na fotografia. */
  readonly personVisible?: boolean | undefined;
  /** Data ISO do consentimento de publicação confirmado pelo cliente.
   *
   * CLIENT-04: `real-005` mostra um trabalhador identificável. O §11 e o
   * docs/09 tratavam "fotografia pessoal sem consentimento" como release
   * blocker. Resolvido em 2026-09-30: consentimento confirmado, a foto é
   * publicável. */
  readonly consentConfirmedAt?: string | undefined;
}

export interface Service {
  readonly id: string;
  readonly name: string;
  readonly description: string;
}

export interface ProcessStep {
  readonly title: string;
  readonly description: string;
}
