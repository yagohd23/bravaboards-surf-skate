import type { Core } from '@strapi/strapi';

const PUBLIC_CONTENT_TYPES = [
  'api::global.global',
  'api::home.home',
  'api::product.product',
  'api::category.category',
  'api::brand.brand',
  'api::discipline.discipline',
];

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    try {
      await setPublicPermissions(strapi);
    } catch (e) {
      strapi.log.error('[bootstrap] Error configurando permisos:', e);
    }

    try {
      await seedInitialData(strapi);
    } catch (e) {
      strapi.log.error('[bootstrap] Error en seed:', e);
    }
  },
};

// ── Permisos públicos ─────────────────────────────────────────────────────────

async function setPublicPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (!publicRole) return;

  for (const uid of PUBLIC_CONTENT_TYPES) {
    for (const action of ['find', 'findOne']) {
      const actionKey = `${uid}.${action}`;
      const exists = await strapi
        .query('plugin::users-permissions.permission')
        .findOne({ where: { action: actionKey, role: publicRole.id } });

      if (!exists) {
        await strapi.query('plugin::users-permissions.permission').create({
          data: { action: actionKey, role: publicRole.id, enabled: true },
        });
        strapi.log.info(`[bootstrap] Permiso: ${actionKey}`);
      }
    }
  }
}

// ── Seed ──────────────────────────────────────────────────────────────────────

async function seedInitialData(strapi: Core.Strapi) {
  await seedGlobal(strapi);
  await seedHome(strapi);
  await seedCategories(strapi);
  await seedBrands(strapi);
}

async function seedGlobal(strapi: Core.Strapi) {
  const existing = await strapi.db.query('api::global.global').findOne({});
  if (existing) return;

  await strapi.db.query('api::global.global').create({
    data: {
      site_name: 'BravaBoards',
      nav_menu: JSON.stringify([
        {
          label: 'Surf',
          href: '/surf',
          children: [
            { label: 'Tablas', href: '/surf/tablas' },
            { label: 'Lycras y trajes', href: '/surf/ropa' },
            { label: 'Accesorios', href: '/surf/accesorios' },
          ],
        },
        {
          label: 'Skate',
          href: '/skate',
          children: [
            { label: 'Completos', href: '/skate/completos' },
            { label: 'Decks', href: '/skate/decks' },
            { label: 'Ruedas y trucks', href: '/skate/partes' },
          ],
        },
        { label: 'Ropa', href: '/ropa' },
        { label: 'Marcas', href: '/marcas' },
        { label: 'Outlet', href: '/outlet' },
      ]),
      footer: JSON.stringify({
        menu: [
          { label: 'Inicio', href: '/' },
          { label: 'Tienda', href: '/tienda' },
          { label: 'Sobre nosotros', href: '/nosotros' },
          { label: 'Contacto', href: '/contacto' },
        ],
        contact: {
          address: 'C/ Mediterráneo 42, 08003 Barcelona',
          email: 'hola@bravaboards.com',
          phone: '+34 93 000 00 00',
          socials: [
            { platform: 'instagram', url: 'https://instagram.com/bravaboards', label: 'Instagram' },
            { platform: 'tiktok', url: 'https://tiktok.com/@bravaboards', label: 'TikTok' },
          ],
        },
        legal: {
          links: [
            { label: 'Aviso legal', href: '/legal' },
            { label: 'Política de privacidad', href: '/privacidad' },
            { label: 'Cookies', href: '/cookies' },
            { label: 'Envíos y devoluciones', href: '/envios' },
          ],
        },
        copyright: '© 2025 BravaBoards — Todos los derechos reservados',
      }),
      ui_labels: JSON.stringify({
        search_placeholder: 'Buscar productos...',
        filter_label: 'Filtrar por categoría',
        view_product: 'Ver producto',
        add_to_cart: 'Añadir al carrito',
        empty_results: 'No hemos encontrado resultados para tu búsqueda.',
        status_available: 'Disponible',
        status_sold_out: 'Agotado',
        products_section_title: 'Todos los productos',
        products_section_description: 'Explora nuestra selección de surf y skate.',
        mobile_menu_label: 'Abrir menú de navegación',
        view_all: 'Ver todos',
      }),
      seo_title: 'BravaBoards — Surf & Skate Shop',
      seo_description:
        'Tu tienda de surf y skate en el Mediterráneo. Tablas, ropa y accesorios seleccionados con criterio.',
      seo_robots: 'index, follow',
      publishedAt: new Date(),
    },
  });

  strapi.log.info('[seed] Global creado ✓');
}

async function seedHome(strapi: Core.Strapi) {
  const existing = await strapi.db.query('api::home.home').findOne({});
  if (existing) return;

  await strapi.db.query('api::home.home').create({
    data: {
      hero_title: 'Deslízate con el Mediterráneo',
      hero_subtitle:
        'Tablas, ropa y accesorios para surf y skate seleccionados con criterio. Envío rápido a toda España.',
      hero_ctas: JSON.stringify([
        { label: 'Ver surf', href: '/surf', variant: 'primary' },
        { label: 'Ver skate', href: '/skate', variant: 'secondary' },
      ]),
      featured_sections: JSON.stringify([
        {
          title: 'Surf',
          description: 'Todo para dominar las olas del Mediterráneo.',
          search_placeholder: 'Buscar tablas, lycras, accesorios...',
          filter_label: 'Filtrar surf',
          category_slug: 'surf',
          limit: 8,
          sort: 'createdAt:desc',
        },
        {
          title: 'Skate',
          description: 'Decks, completos y partes para rodar en la calle o el skatepark.',
          search_placeholder: 'Buscar decks, ruedas, trucks...',
          filter_label: 'Filtrar skate',
          category_slug: 'skate',
          limit: 8,
          sort: 'createdAt:desc',
        },
      ]),
      seo_title: 'BravaBoards — Surf & Skate Shop',
      seo_description:
        'Tu tienda de surf y skate en el Mediterráneo. Tablas, ropa y accesorios seleccionados con criterio.',
      seo_robots: 'index, follow',
      publishedAt: new Date(),
    },
  });

  strapi.log.info('[seed] Home creado ✓');
}

async function seedCategories(strapi: Core.Strapi) {
  const count = await strapi.db.query('api::category.category').count({});
  if (count > 0) return;

  const cats = [
    { name: 'Surf', slug: 'surf', order: 1 },
    { name: 'Skate', slug: 'skate', order: 2 },
    { name: 'Ropa', slug: 'ropa', order: 3 },
  ];

  for (const cat of cats) {
    await strapi.db.query('api::category.category').create({
      data: {
        ...cat,
        description: JSON.stringify([
          { type: 'paragraph', children: [{ type: 'text', text: cat.name }] },
        ]),
        publishedAt: new Date(),
      },
    });
  }

  strapi.log.info('[seed] Categorías creadas ✓');
}

async function seedBrands(strapi: Core.Strapi) {
  const count = await strapi.db.query('api::brand.brand').count({});
  if (count > 0) return;

  const brands = [
    { name: 'Channel Islands', slug: 'channel-islands', type: 'Hardware' },
    { name: 'Quiksilver', slug: 'quiksilver', type: 'Mixto' },
    { name: 'Santa Cruz', slug: 'santa-cruz', type: 'Hardware' },
    { name: 'Rip Curl', slug: 'rip-curl', type: 'Textil' },
  ];

  for (const brand of brands) {
    await strapi.db.query('api::brand.brand').create({
      data: {
        ...brand,
        description: JSON.stringify([
          { type: 'paragraph', children: [{ type: 'text', text: brand.name }] },
        ]),
        publishedAt: new Date(),
      },
    });
  }

  strapi.log.info('[seed] Marcas creadas ✓');
}
