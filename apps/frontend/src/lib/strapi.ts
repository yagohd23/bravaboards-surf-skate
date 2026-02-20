/**
 * Strapi 5 fetch layer — BravaBoards
 * Todos los datos visibles de la UI vienen de aquí.
 */

const STRAPI_URL = import.meta.env.STRAPI_URL ?? 'http://localhost:1337';
const STRAPI_TOKEN = import.meta.env.STRAPI_API_TOKEN as string | undefined;

// ── Fetch base ────────────────────────────────────────────────────────────────

async function fetchFromStrapi<T>(
  endpoint: string,
  params: Record<string, string> = {}
): Promise<T> {
  const url = new URL(`${STRAPI_URL}/api/${endpoint}`);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, value);
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (STRAPI_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
  }

  const response = await fetch(url.toString(), { headers });

  if (!response.ok) {
    throw new Error(
      `Strapi ${response.status} en ${endpoint}: ${response.statusText}`
    );
  }

  return response.json() as Promise<T>;
}

// ── Single types ──────────────────────────────────────────────────────────────

export async function getGlobalData() {
  try {
    const res = await fetchFromStrapi<{ data: Record<string, unknown> }>(
      'global',
      { populate: '*' }
    );
    return res.data ?? null;
  } catch (err) {
    console.error('[Strapi] getGlobalData:', err);
    return null;
  }
}

export async function getHomeData() {
  try {
    const res = await fetchFromStrapi<{ data: Record<string, unknown> }>(
      'home',
      { populate: '*' }
    );
    return res.data ?? null;
  } catch (err) {
    console.error('[Strapi] getHomeData:', err);
    return null;
  }
}

// ── Collections ───────────────────────────────────────────────────────────────

export async function getProducts(query: Record<string, string> = {}) {
  try {
    const res = await fetchFromStrapi<{ data: unknown[] }>(
      'products',
      { populate: '*', ...query }
    );
    return res.data ?? [];
  } catch (err) {
    console.error('[Strapi] getProducts:', err);
    return [];
  }
}

export async function getCategories() {
  try {
    const res = await fetchFromStrapi<{ data: unknown[] }>(
      'categories',
      { populate: '*', sort: 'order:asc' }
    );
    return res.data ?? [];
  } catch (err) {
    console.error('[Strapi] getCategories:', err);
    return [];
  }
}

export async function getSubcategories() {
  try {
    const res = await fetchFromStrapi<{ data: unknown[] }>(
      'subcategories',
      { populate: 'category', sort: 'order:asc' }
    );
    return res.data ?? [];
  } catch (err) {
    console.error('[Strapi] getSubcategories:', err);
    return [];
  }
}

export async function getFeaturedProducts() {
  try {
    const res = await fetchFromStrapi<{ data: unknown[] }>(
      'products',
      {
        'filters[featured][$eq]': 'true',
        'populate': '*',
        'pagination[limit]': '200',
        'sort': 'createdAt:asc',
      }
    );
    return res.data ?? [];
  } catch (err) {
    console.error('[Strapi] getFeaturedProducts:', err);
    return [];
  }
}

export async function getBrands() {
  try {
    const res = await fetchFromStrapi<{ data: unknown[] }>(
      'brands',
      { populate: '*' }
    );
    return res.data ?? [];
  } catch (err) {
    console.error('[Strapi] getBrands:', err);
    return [];
  }
}

// ── Media helpers ─────────────────────────────────────────────────────────────

/**
 * Devuelve la URL absoluta de un campo media de Strapi 5.
 * Strapi 5 ya no envuelve en data.attributes — el objeto es plano.
 */
export function getStrapiMediaUrl(
  media: { url?: string } | null | undefined
): string | null {
  if (!media?.url) return null;
  return media.url.startsWith('http')
    ? media.url
    : `${STRAPI_URL}${media.url}`;
}

/**
 * Devuelve el alt text de un campo media.
 * Prioriza alternativeText de Strapi; si no existe, usa el fallback.
 */
export function getStrapiMediaAlt(
  media: { alternativeText?: string | null; name?: string } | null | undefined,
  fallback = ''
): string {
  return media?.alternativeText ?? media?.name ?? fallback;
}

export { STRAPI_URL };
