import type { Core } from '@strapi/strapi';

const PUBLIC_CONTENT_TYPES = [
  'api::global.global',
  'api::home.home',
  'api::product.product',
  'api::category.category',
  'api::subcategory.subcategory',
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
  await updateCategoryOrders(strapi); // Siempre actualiza el orden
  await seedBrands(strapi);
  await seedSubcategories(strapi);
  await seedFeaturedProducts(strapi);
  await removeRopaSurfskate(strapi);  // Limpieza: elimina ropa-surfskate si existe
}

// ── Global ────────────────────────────────────────────────────────────────────

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
        { label: 'Surf-Skate', href: '/surf-skate' },
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
        featured_label: 'Destacado',
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

// ── Home ──────────────────────────────────────────────────────────────────────

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
      featured_sections: JSON.stringify([]),
      seo_title: 'BravaBoards — Surf & Skate Shop',
      seo_description:
        'Tu tienda de surf y skate en el Mediterráneo. Tablas, ropa y accesorios seleccionados con criterio.',
      seo_robots: 'index, follow',
      publishedAt: new Date(),
    },
  });

  strapi.log.info('[seed] Home creado ✓');
}

// ── Categorías ────────────────────────────────────────────────────────────────

async function seedCategories(strapi: Core.Strapi) {
  // Idempotente por slug — añade solo las que faltan
  const cats = [
    { name: 'Ropa',       slug: 'ropa',       order: 1 },
    { name: 'Surf',       slug: 'surf',       order: 2 },
    { name: 'Skate',      slug: 'skate',      order: 3 },
    { name: 'Surf-Skate', slug: 'surf-skate', order: 4 },
  ];

  for (const cat of cats) {
    const existing = await strapi.db.query('api::category.category').findOne({ where: { slug: cat.slug } });
    if (!existing) {
      await strapi.db.query('api::category.category').create({
        data: {
          ...cat,
          description: JSON.stringify([
            { type: 'paragraph', children: [{ type: 'text', text: cat.name }] },
          ]),
          publishedAt: new Date(),
        },
      });
      strapi.log.info(`[seed] Categoría creada: ${cat.slug}`);
    }
  }
}

// Actualiza el campo order en categorías existentes para garantizar el orden correcto
async function updateCategoryOrders(strapi: Core.Strapi) {
  const orders = [
    { slug: 'ropa',       order: 1 },
    { slug: 'surf',       order: 2 },
    { slug: 'skate',      order: 3 },
    { slug: 'surf-skate', order: 4 },
  ];

  for (const { slug, order } of orders) {
    const cat = await strapi.db.query('api::category.category').findOne({ where: { slug } });
    if (cat && cat.order !== order) {
      await strapi.db.query('api::category.category').update({
        where: { id: cat.id },
        data: { order },
      });
    }
  }
}

// ── Marcas ────────────────────────────────────────────────────────────────────

async function seedBrands(strapi: Core.Strapi) {
  const brands = [
    { name: 'Channel Islands', slug: 'channel-islands', type: 'Hardware' },
    { name: 'Quiksilver',      slug: 'quiksilver',      type: 'Mixto' },
    { name: 'Santa Cruz',      slug: 'santa-cruz',      type: 'Hardware' },
    { name: 'Rip Curl',        slug: 'rip-curl',        type: 'Textil' },
    { name: 'Carver',          slug: 'carver',          type: 'Hardware' },
    { name: 'YOW',             slug: 'yow',             type: 'Hardware' },
  ];

  for (const brand of brands) {
    const existing = await strapi.db.query('api::brand.brand').findOne({ where: { slug: brand.slug } });
    if (!existing) {
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
  }

  strapi.log.info('[seed] Marcas creadas ✓');
}

// ── Subcategorías ─────────────────────────────────────────────────────────────

async function seedSubcategories(strapi: Core.Strapi) {
  const surf      = await strapi.db.query('api::category.category').findOne({ where: { slug: 'surf' } });
  const skate     = await strapi.db.query('api::category.category').findOne({ where: { slug: 'skate' } });
  const ropa      = await strapi.db.query('api::category.category').findOne({ where: { slug: 'ropa' } });
  const surfSkate = await strapi.db.query('api::category.category').findOne({ where: { slug: 'surf-skate' } });

  if (!surf || !skate || !ropa || !surfSkate) {
    strapi.log.warn('[seed] Categorías no encontradas, saltando subcategorías');
    return;
  }

  const subcats = [
    // Surf
    { name: 'Tablas',              slug: 'tablas',              order: 1, category: surf.id },
    { name: 'Lycras y trajes',     slug: 'lycras-trajes',       order: 2, category: surf.id },
    { name: 'Accesorios surf',     slug: 'accesorios-surf',     order: 3, category: surf.id },
    // Skate
    { name: 'Completos',           slug: 'completos',           order: 1, category: skate.id },
    { name: 'Decks',               slug: 'decks',               order: 2, category: skate.id },
    { name: 'Ruedas y trucks',     slug: 'ruedas-trucks',       order: 3, category: skate.id },
    // Ropa
    { name: 'Camisetas',           slug: 'camisetas',           order: 1, category: ropa.id },
    { name: 'Pantalones',          slug: 'pantalones',          order: 2, category: ropa.id },
    { name: 'Accesorios ropa',     slug: 'accesorios-ropa',     order: 3, category: ropa.id },
    { name: 'Calzado',             slug: 'calzado',             order: 4, category: ropa.id },
    { name: 'Sudaderas',           slug: 'sudaderas',           order: 5, category: ropa.id },
    // Surf-Skate
    { name: 'Surfskates',       slug: 'surfskates',       order: 1, category: surfSkate.id },
    { name: 'Trucks surfskate', slug: 'trucks-surfskate', order: 2, category: surfSkate.id },
  ];

  for (const sc of subcats) {
    const existing = await strapi.db.query('api::subcategory.subcategory').findOne({ where: { slug: sc.slug } });
    if (!existing) {
      await strapi.db.query('api::subcategory.subcategory').create({
        data: { ...sc, publishedAt: new Date() },
      });
      strapi.log.info(`[seed] Subcategoría creada: ${sc.slug}`);
    }
  }

  strapi.log.info('[seed] Subcategorías ✓');
}

// ── Productos destacados ──────────────────────────────────────────────────────

async function seedFeaturedProducts(strapi: Core.Strapi) {
  const getCat = (slug: string) =>
    strapi.db.query('api::category.category').findOne({ where: { slug } });
  const getSub = (slug: string) =>
    strapi.db.query('api::subcategory.subcategory').findOne({ where: { slug } });

  const [surf, skate, ropa, surfSkate] = await Promise.all([
    getCat('surf'), getCat('skate'), getCat('ropa'), getCat('surf-skate'),
  ]);

  if (!surf || !skate || !ropa || !surfSkate) return;

  const [
    tablas, lycras, accesoriosSurf,
    completos, decks, ruedasTrucks,
    camisetas, pantalones, accesoriosRopa, calzado, sudaderas,
    surfskates, trucksSurfskate,
  ] = await Promise.all([
    getSub('tablas'),          getSub('lycras-trajes'),   getSub('accesorios-surf'),
    getSub('completos'),       getSub('decks'),           getSub('ruedas-trucks'),
    getSub('camisetas'),       getSub('pantalones'),      getSub('accesorios-ropa'),
    getSub('calzado'),         getSub('sudaderas'),
    getSub('surfskates'),      getSub('trucks-surfskate'),
  ]);

  type PS = { name: string; slug: string; price: number; category: number; subcategory: number | null; actual_status: 'Disponible' | 'Agotado' };

  const products: PS[] = [
    // ── Ropa › Camisetas
    { name: 'Quiksilver Everyday UV Tee',     slug: 'quik-everyday-uv-tee',   price:  35, category: ropa.id,      subcategory: camisetas?.id ?? null,        actual_status: 'Disponible' },
    { name: 'Billabong Dreamy Place Tee',     slug: 'billabong-dreamy-tee',   price:  30, category: ropa.id,      subcategory: camisetas?.id ?? null,        actual_status: 'Disponible' },
    { name: 'Santa Cruz Screaming Hand Tee',  slug: 'sc-screaming-tee',       price:  28, category: ropa.id,      subcategory: camisetas?.id ?? null,        actual_status: 'Disponible' },
    { name: "O'Neill Circle Surfer Tee",      slug: 'oneill-circle-tee',      price:  32, category: ropa.id,      subcategory: camisetas?.id ?? null,        actual_status: 'Disponible' },
    // ── Ropa › Pantalones
    { name: 'Volcom Frickin Modern Chino',    slug: 'volcom-frickin-chino',    price:  72, category: ropa.id,      subcategory: pantalones?.id ?? null,       actual_status: 'Disponible' },
    { name: 'Quiksilver Crucial Battle 21"',  slug: 'quik-crucial-battle',     price:  65, category: ropa.id,      subcategory: pantalones?.id ?? null,       actual_status: 'Disponible' },
    { name: 'Billabong Surftrek Walkshort',   slug: 'billabong-surftrek',      price:  68, category: ropa.id,      subcategory: pantalones?.id ?? null,       actual_status: 'Disponible' },
    { name: 'Rusty Napa Valley Chino',        slug: 'rusty-napa-chino',        price:  58, category: ropa.id,      subcategory: pantalones?.id ?? null,       actual_status: 'Disponible' },
    // ── Ropa › Accesorios ropa
    { name: 'Dakine Covert Backpack 24L',     slug: 'dakine-covert-24l',       price:  89, category: ropa.id,      subcategory: accesoriosRopa?.id ?? null,   actual_status: 'Disponible' },
    { name: 'Quiksilver Performer Cap',       slug: 'quik-performer-cap',      price:  28, category: ropa.id,      subcategory: accesoriosRopa?.id ?? null,   actual_status: 'Disponible' },
    { name: 'Neff Daily Beanie',              slug: 'neff-daily-beanie',       price:  22, category: ropa.id,      subcategory: accesoriosRopa?.id ?? null,   actual_status: 'Disponible' },
    { name: 'Santa Cruz Dot Socks',           slug: 'sc-dot-socks',            price:  15, category: ropa.id,      subcategory: accesoriosRopa?.id ?? null,   actual_status: 'Disponible' },
    // ── Ropa › Calzado
    { name: 'Vans Old Skool',                 slug: 'vans-old-skool',          price:  75, category: ropa.id,      subcategory: calzado?.id ?? null,          actual_status: 'Disponible' },
    { name: 'DC Shoes Pure',                  slug: 'dc-shoes-pure',           price:  65, category: ropa.id,      subcategory: calzado?.id ?? null,          actual_status: 'Disponible' },
    { name: 'Etnies Marana',                  slug: 'etnies-marana',           price:  80, category: ropa.id,      subcategory: calzado?.id ?? null,          actual_status: 'Disponible' },
    { name: 'Globe Motley II',                slug: 'globe-motley-ii',         price:  70, category: ropa.id,      subcategory: calzado?.id ?? null,          actual_status: 'Disponible' },
    // ── Ropa › Sudaderas
    { name: 'Quiksilver Everyday Hood',       slug: 'quik-everyday-hood',      price:  65, category: ropa.id,      subcategory: sudaderas?.id ?? null,        actual_status: 'Disponible' },
    { name: 'Billabong All Day Hood',         slug: 'billabong-all-day-hood',  price:  60, category: ropa.id,      subcategory: sudaderas?.id ?? null,        actual_status: 'Disponible' },
    { name: 'Rip Curl Surf Revival Hood',     slug: 'ripcurl-surf-revival-hood', price: 70, category: ropa.id,    subcategory: sudaderas?.id ?? null,        actual_status: 'Disponible' },
    { name: "O'Neill Rutile Hood",            slug: 'oneill-rutile-hood',      price:  75, category: ropa.id,      subcategory: sudaderas?.id ?? null,        actual_status: 'Disponible' },
    // ── Surf › Tablas
    { name: "Channel Islands Happy Traveler 6'4\"", slug: 'ci-happy-traveler-64',  price: 650, category: surf.id,  subcategory: tablas?.id ?? null,           actual_status: 'Disponible' },
    { name: "Lost Hydra 5'10\"",              slug: 'lost-hydra-510',          price: 580, category: surf.id,      subcategory: tablas?.id ?? null,           actual_status: 'Disponible' },
    { name: "JS Monsta Box 6'0\"",            slug: 'js-monsta-box-60',        price: 620, category: surf.id,      subcategory: tablas?.id ?? null,           actual_status: 'Disponible' },
    { name: "Firewire Seaside 6'2\"",         slug: 'firewire-seaside-62',     price: 740, category: surf.id,      subcategory: tablas?.id ?? null,           actual_status: 'Disponible' },
    // ── Surf › Lycras y trajes
    { name: 'Rip Curl E-Bomb 3/2mm',         slug: 'ripcurl-ebomb-32',        price: 280, category: surf.id,      subcategory: lycras?.id ?? null,           actual_status: 'Disponible' },
    { name: "O'Neill Hyperfreak 3/2mm",       slug: 'oneill-hyperfreak-32',    price: 320, category: surf.id,      subcategory: lycras?.id ?? null,           actual_status: 'Disponible' },
    { name: 'Quiksilver Highline Pro 3/2mm',  slug: 'quik-highline-32',        price: 350, category: surf.id,      subcategory: lycras?.id ?? null,           actual_status: 'Disponible' },
    { name: 'Billabong Revolution 2mm',       slug: 'billabong-revolution-2',  price: 210, category: surf.id,      subcategory: lycras?.id ?? null,           actual_status: 'Disponible' },
    // ── Surf › Accesorios surf
    { name: 'FCS II Machado Keel Quad',       slug: 'fcs-machado-keel-quad',   price:  89, category: surf.id,      subcategory: accesoriosSurf?.id ?? null,   actual_status: 'Disponible' },
    { name: "Creatures of Leisure Leash 8'",  slug: 'creatures-leash-8',       price:  45, category: surf.id,      subcategory: accesoriosSurf?.id ?? null,   actual_status: 'Disponible' },
    { name: 'Sex Wax Mr. Zogs Basecoat',      slug: 'sexwax-basecoat',         price:   8, category: surf.id,      subcategory: accesoriosSurf?.id ?? null,   actual_status: 'Disponible' },
    { name: 'Dakine Padded Deckpad',          slug: 'dakine-padded-deckpad',   price:  55, category: surf.id,      subcategory: accesoriosSurf?.id ?? null,   actual_status: 'Disponible' },
    // ── Skate › Completos
    { name: 'Element Section Complete 8.0"',  slug: 'element-section-80',      price: 145, category: skate.id,     subcategory: completos?.id ?? null,        actual_status: 'Disponible' },
    { name: 'Santa Cruz Screaming Hand 8.25"',slug: 'sc-screaming-hand-825',   price: 165, category: skate.id,     subcategory: completos?.id ?? null,        actual_status: 'Disponible' },
    { name: 'Baker Intro Complete 8.0"',      slug: 'baker-intro-80',          price: 155, category: skate.id,     subcategory: completos?.id ?? null,        actual_status: 'Disponible' },
    { name: 'Enjoi Whitey Panda 8.0"',        slug: 'enjoi-whitey-panda-80',   price: 140, category: skate.id,     subcategory: completos?.id ?? null,        actual_status: 'Disponible' },
    // ── Skate › Decks
    { name: 'Powell Peralta Ripper 8.5"',     slug: 'powell-ripper-85',        price:  85, category: skate.id,     subcategory: decks?.id ?? null,            actual_status: 'Disponible' },
    { name: 'Girl Malto Mädchen 8.25"',       slug: 'girl-malto-825',          price:  79, category: skate.id,     subcategory: decks?.id ?? null,            actual_status: 'Disponible' },
    { name: 'Deathwish Faded 8.0"',           slug: 'deathwish-faded-80',      price:  75, category: skate.id,     subcategory: decks?.id ?? null,            actual_status: 'Disponible' },
    { name: 'Anti Hero Grimple Stix 8.375"',  slug: 'antihero-grimple-8375',   price:  80, category: skate.id,     subcategory: decks?.id ?? null,            actual_status: 'Disponible' },
    // ── Skate › Ruedas y trucks
    { name: 'Independent 149 Stage 11',       slug: 'independent-149-s11',     price:  55, category: skate.id,     subcategory: ruedasTrucks?.id ?? null,     actual_status: 'Disponible' },
    { name: 'Spitfire Formula Four 54mm',     slug: 'spitfire-f4-54',          price:  42, category: skate.id,     subcategory: ruedasTrucks?.id ?? null,     actual_status: 'Disponible' },
    { name: 'Bones Swiss Bearings',           slug: 'bones-swiss-bearings',    price:  22, category: skate.id,     subcategory: ruedasTrucks?.id ?? null,     actual_status: 'Disponible' },
    { name: 'Venture 5.25 Hollow Trucks',     slug: 'venture-525-hollow',      price:  60, category: skate.id,     subcategory: ruedasTrucks?.id ?? null,     actual_status: 'Disponible' },
    // ── Surf-Skate › Surfskates
    { name: 'Carver C7 Pintail 32"',          slug: 'carver-c7-pintail-32',    price: 640, category: surfSkate.id, subcategory: surfskates?.id ?? null,       actual_status: 'Disponible' },
    { name: 'YOW Surf Hossegor 33"',          slug: 'yow-surf-hossegor-33',    price: 590, category: surfSkate.id, subcategory: surfskates?.id ?? null,       actual_status: 'Disponible' },
    { name: 'Smoothstar Thruster 32"',        slug: 'smoothstar-thruster-32',  price: 480, category: surfSkate.id, subcategory: surfskates?.id ?? null,       actual_status: 'Disponible' },
    { name: 'Waterborne Surf Adapter Set',    slug: 'waterborne-surf-adapter', price: 350, category: surfSkate.id, subcategory: surfskates?.id ?? null,       actual_status: 'Disponible' },
    // ── Surf-Skate › Trucks surfskate
    { name: 'Carver C7 Truck Set',            slug: 'carver-c7-truck-set',     price: 195, category: surfSkate.id, subcategory: trucksSurfskate?.id ?? null,  actual_status: 'Disponible' },
    { name: 'YOW Meraki Truck System',        slug: 'yow-meraki-trucks',       price: 185, category: surfSkate.id, subcategory: trucksSurfskate?.id ?? null,  actual_status: 'Disponible' },
    { name: 'Sector 9 Gullwing Sidewinder II',slug: 'sector9-sidewinder-ii',   price:  65, category: surfSkate.id, subcategory: trucksSurfskate?.id ?? null,  actual_status: 'Disponible' },
    { name: 'Abec 11 Freeride 76mm Wheels',   slug: 'abec11-freeride-76',      price:  52, category: surfSkate.id, subcategory: trucksSurfskate?.id ?? null,  actual_status: 'Disponible' },
  ];

  for (const p of products) {
    // Idempotente por slug
    const existing = await strapi.db.query('api::product.product').findOne({ where: { slug: p.slug } });
    if (existing) continue;

    await strapi.db.query('api::product.product').create({
      data: {
        name:          p.name,
        slug:          p.slug,
        price:         p.price,
        actual_status: p.actual_status,
        featured:      true,
        category:      p.category,
        subcategory:   p.subcategory,
        description: JSON.stringify([
          { type: 'paragraph', children: [{ type: 'text', text: p.name }] },
        ]),
        publishedAt: new Date(),
      },
    });
  }

  strapi.log.info('[seed] Productos destacados ✓');
}

// ── Limpieza: elimina ropa-surfskate si existe de una sesión anterior ─────────

async function removeRopaSurfskate(strapi: Core.Strapi) {
  const sub = await strapi.db.query('api::subcategory.subcategory').findOne({ where: { slug: 'ropa-surfskate' } });
  if (!sub) return;

  // Eliminar productos vinculados a esta subcategoría
  const prods = await strapi.db.query('api::product.product').findMany({ where: { subcategory: sub.id } });
  for (const p of prods) {
    await strapi.db.query('api::product.product').delete({ where: { id: p.id } });
  }

  // Eliminar la subcategoría
  await strapi.db.query('api::subcategory.subcategory').delete({ where: { id: sub.id } });
  strapi.log.info('[cleanup] ropa-surfskate eliminada ✓');
}
