/**
 * Tipos TypeScript para respuestas de Strapi 5.
 * Strapi 5 devuelve objetos planos (sin wrapper attributes).
 */

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
  featured_sections: FeaturedSection[] | null;
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
