// lib/seo.js
// Centralised SEO defaults + per-page overrides

export const SITE = {
  name: 'LinaRoos',
  tagline: 'Luxury Floral Studio',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.linaroos.nl',
  description:
    'LinaRoos is a luxury floral studio crafting bespoke bouquets, arrangements and gift boxes. Premium flowers, hand-tied with love and delivered to your door.',
  twitterHandle: '@linaroosflowers',
  locale: 'nl_NL',
  themeColor: '#c96b7a',
  ogImage: '/og-default.jpg',
}

/**
 * Build a full SEO config for a page.
 * @param {object} overrides – any field from SITE can be overridden
 */
export function buildSEO(overrides = {}) {
  const config = { ...SITE, ...overrides }

  const title = overrides.title
    ? `${overrides.title} | ${SITE.name}`
    : `${SITE.name} – ${SITE.tagline}`

  return {
    ...config,
    title,
    canonical: overrides.canonical
      ? `${SITE.url}${overrides.canonical}`
      : SITE.url,
  }
}

/**
 * Build JSON-LD structured data for a product page.
 */
export function buildProductSchema(product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    brand: { '@type': 'Brand', name: SITE.name },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: product.price.toFixed(2),
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${SITE.url}/shop/${product.slug}`,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviews,
    },
  }
}

/**
 * Build JSON-LD for the local business (homepage / contact).
 */
export function buildLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Florist',
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/logo.png`,
    description: SITE.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Bloemenlaan 12',
      addressLocality: 'Amsterdam',
      postalCode: '1012 AB',
      addressCountry: 'NL',
    },
    telephone: '+31-20-000-0000',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '16:00',
      },
    ],
    priceRange: '€€€',
    image: `${SITE.url}/og-default.jpg`,
  }
}
