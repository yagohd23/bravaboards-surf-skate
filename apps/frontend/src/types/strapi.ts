/**
 * Tipos TypeScript para respuestas de Strapi 5.
 * Strapi 5 devuelve objetos planos (sin wrapper attributes).
 */

// ── Tema visual global (global.theme) ─────────────────────────────────────────
// Campos en Strapi → Global → theme (JSON):
//   ocean, ocean_light, navy, sand, sand_dark, coral, stone, stone_light, warm_white
// Formato: HEX (#0077B6) o cualquier valor CSS válido.
// Se inyectan como variables CSS :root { --color-ocean: ...; } en cada página.

export interface SiteTheme {
  ocean?: string;       // Azul primario.      Default: #0077B6
  ocean_light?: string; // Azul claro.         Default: #E0F2FE
  navy?: string;        // Azul marino oscuro. Default: #0D1F33
  sand?: string;        // Arena cálida.       Default: #F5E6C8
  sand_dark?: string;   // Arena oscura.       Default: #E8D5A3
  coral?: string;       // Acento coral.       Default: #E85D2A
  stone?: string;       // Gris texto.         Default: #6B7280
  stone_light?: string; // Gris claro.         Default: #C5C7C9
  warm_white?: string;  // Blanco cálido.      Default: #FDFAF5
  [key: string]: string | undefined;
}

// ── Estilos del Hero (home.hero_styles) ───────────────────────────────────────
// Campos en Strapi → Home → hero_styles (JSON):
//   section_bg, min_height,
//   overlay_from, overlay_via, overlay_to,
//   title_color, subtitle_color,
//   cta_primary_bg, cta_primary_text, cta_primary_hover_bg,
//   cta_secondary_border, cta_secondary_text,
//   cta_secondary_hover_bg, cta_secondary_hover_text

export interface HeroStyles {
  section_bg?: string;                // Fondo sección (sin imagen). Default: #0D1F33
  min_height?: string;                // Altura mínima.              Default: 80vh
  overlay_from?: string;              // Overlay inferior.           Default: rgba(13,31,51,0.88)
  overlay_via?: string;               // Overlay centro.             Default: rgba(13,31,51,0.5)
  overlay_to?: string;                // Overlay superior.           Default: rgba(13,31,51,0.2)
  title_color?: string;               // Color H1.                   Default: #FDFAF5
  subtitle_color?: string;            // Color subtítulo.            Default: #C5C7C9
  cta_primary_bg?: string;            // Fondo CTA primario.         Default: #E85D2A
  cta_primary_text?: string;          // Texto CTA primario.         Default: #FDFAF5
  cta_primary_hover_bg?: string;      // Fondo CTA primario hover.   Default: #0077B6
  cta_secondary_border?: string;      // Borde CTA secundario.       Default: #FDFAF5
  cta_secondary_text?: string;        // Texto CTA secundario.       Default: #FDFAF5
  cta_secondary_hover_bg?: string;    // Fondo CTA secundario hover. Default: #FDFAF5
  cta_secondary_hover_text?: string;  // Texto CTA secundario hover. Default: #0D1F33
}

// ── Estilos de CategoryCards (home.categories_styles) ─────────────────────────
// Campos en Strapi → Home → categories_styles (JSON):
//   section_bg, title_color, subtitle_color,
//   card_fallback_from, card_fallback_to,
//   overlay_from, overlay_to,
//   card_title_color, view_all_color, view_all_hover_color

export interface CategoriesStyles {
  section_bg?: string;          // Fondo sección.              Default: #FDFAF5
  title_color?: string;         // Color título sección.       Default: #0D1F33
  subtitle_color?: string;      // Color subtítulo sección.    Default: #6B7280
  card_fallback_from?: string;  // Gradiente tarjeta (inicio). Default: #0077B6
  card_fallback_to?: string;    // Gradiente tarjeta (fin).    Default: #0D1F33
  overlay_from?: string;        // Overlay tarjeta inferior.   Default: rgba(13,31,51,0.88)
  overlay_to?: string;          // Overlay tarjeta superior.   Default: transparent
  card_title_color?: string;    // Color nombre categoría.     Default: #FDFAF5
  view_all_color?: string;      // Color texto "Ver todos".    Default: #C5C7C9
  view_all_hover_color?: string;// Color "Ver todos" hover.    Default: #FDFAF5
}

// ── Estilos de AboutSection (home.about_styles) ───────────────────────────────
// Campos en Strapi → Home → about_styles (JSON):
//   section_bg, title_color, subtitle_color, body_color, accent_color

export interface AboutStyles {
  section_bg?: string;     // Fondo sección.     Default: #F5E6C8
  title_color?: string;    // Color título.      Default: #0D1F33
  subtitle_color?: string; // Color subtítulo.   Default: #0077B6
  body_color?: string;     // Color cuerpo.      Default: #6B7280
  accent_color?: string;   // Elemento decorat.  Default: rgba(232,93,42,0.2)
}

// ── Media ─────────────────────────────────────────────────────────────────────

export interface StrapiMedia {
  id: number;
  documentId?: string;
  url: string;
  alternativeText: string | null;
  name: string;
  width: number | null;
  height: number | null;
  mime: string;
  formats?: Record<string, { url: string; width: number; height: number }>;
}

// ── Global (single type) ──────────────────────────────────────────────────────

export interface NavMenuItem {
  label: string;
  href: string;
  children?: NavMenuItem[];
}

export interface FooterContact {
  address?: string;
  email?: string;
  phone?: string;
  socials?: { platform: string; url: string; label: string }[];
}

export interface FooterLegal {
  links: { label: string; href: string }[];
}

export interface FooterData {
  menu?: { label: string; href: string }[];
  contact?: FooterContact;
  legal?: FooterLegal;
  copyright?: string;
}

/** Etiquetas de UI dinámicas — todos los textos visibles vienen del CMS */
export interface UILabels {
  search_placeholder?: string;
  filter_label?: string;
  add_to_cart?: string;
  view_product?: string;
  loading?: string;
  error?: string;
  empty_results?: string;
  view_all?: string;
  status_available?: string;
  status_sold_out?: string;
  mobile_menu_label?: string;
  // Blog
  blog_title?: string;
  blog_read_more?: string;
  blog_back?: string;
  blog_related_title?: string;
  blog_by?: string;
  blog_empty?: string;
  // Favoritos
  favorites_add?: string;
  favorites_remove?: string;
  favorites_title?: string;
  favorites_empty?: string;
  // Carrito
  cart_title?: string;
  cart_empty?: string;
  cart_total?: string;
  cart_remove?: string;
  cart_checkout?: string;
  [key: string]: string | undefined;
}

export interface GlobalData {
  id: number;
  documentId?: string;
  site_name: string;
  logo: StrapiMedia | null;
  favicon: StrapiMedia | null;
  nav_menu: NavMenuItem[] | null;
  footer: FooterData | null;
  ui_labels: UILabels | null;
  theme: SiteTheme | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_image: StrapiMedia | null;
  seo_robots: string | null;
}

// ── Home (single type) ────────────────────────────────────────────────────────

export interface HeroCTA {
  label: string;
  href: string;
  variant: 'primary' | 'secondary';
}

export interface FeaturedSection {
  title: string;
  description?: string;
  search_placeholder?: string;
  filter_label?: string;
  /** Slug de categoría para filtrar productos */
  category_slug?: string;
  /** Slug de marca para filtrar productos */
  brand_slug?: string;
  limit?: number;
  sort?: string;
}

export interface HomeData {
  id: number;
  documentId?: string;
  hero_title: string;
  hero_subtitle: string | null;
  hero_background: StrapiMedia | null;
  /** Video subido a Strapi (MP4, WebM…). Tiene prioridad sobre hero_background. */
  hero_video: StrapiMedia | null;
  hero_ctas: HeroCTA[] | null;
  hero_styles: HeroStyles | null;
  featured_sections: FeaturedSection[] | null;
  categories_title: string | null;
  categories_subtitle: string | null;
  categories_styles: CategoriesStyles | null;
  about_title: string | null;
  about_subtitle: string | null;
  about_body: string | null;
  about_image: StrapiMedia | null;
  about_styles: AboutStyles | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_image: StrapiMedia | null;
  seo_robots: string | null;
  seo_canonical: string | null;
}

// ── Subcategory (collection type) ─────────────────────────────────────────────

export interface Subcategory {
  id: number;
  documentId?: string;
  name: string;
  slug: string;
  order: number | null;
  category?: Category | null;
}

// ── Product (collection type) ─────────────────────────────────────────────────

export interface Product {
  id: number;
  documentId?: string;
  name: string;
  slug: string;
  description: unknown;
  price: number;
  actual_status: 'Disponible' | 'Agotado' | null;
  featured: boolean;
  featured_image: StrapiMedia | null;
  gallery: StrapiMedia[] | null;
  category?: Category | null;
  subcategory?: Subcategory | null;
  brand?: Brand | null;
}

// ── Category (collection type) ────────────────────────────────────────────────

export interface Category {
  id: number;
  documentId?: string;
  name: string;
  slug: string;
  images: StrapiMedia | null;
  card_image: StrapiMedia | null;
  order: number | null;
}

// ── Brand (collection type) ───────────────────────────────────────────────────

export interface Brand {
  id: number;
  documentId?: string;
  name: string;
  slug: string;
  logo: StrapiMedia | null;
  type: 'Hardware' | 'Textil' | 'Mixto' | null;
}

// ── Article (collection type) ─────────────────────────────────────────────────

export interface Article {
  id: number;
  documentId?: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: unknown;           // Strapi blocks (rich text JSON)
  featured_image: StrapiMedia | null;
  author: string | null;
  published_date: string | null;  // ISO date string "YYYY-MM-DD"
  category: string | null;
  seo_title: string | null;
  seo_description: string | null;
}

// ── ContactPage (single type) ─────────────────────────────────────────────────

export interface ContactSocial {
  label: string;
  url: string;
  platform: 'instagram' | 'facebook' | 'tiktok' | 'youtube' | 'twitter' | string;
}

export interface ContactPage {
  id: number;
  documentId?: string;
  hero_title: string;
  hero_subtitle: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_address: string | null;
  contact_hours: string | null;
  contact_socials: ContactSocial[] | null;
  form_submit_label: string | null;
  form_loading_label: string | null;
  form_success_message: string | null;
  form_error_message: string | null;
  form_field_name_label: string | null;
  form_field_email_label: string | null;
  form_field_phone_label: string | null;
  form_field_subject_label: string | null;
  form_field_message_label: string | null;
  form_subject_options: string[] | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_robots: string | null;
  seo_canonical: string | null;
}

// ── Wrappers de respuesta API ─────────────────────────────────────────────────

export interface StrapiSingleResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

export interface StrapiCollectionResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
