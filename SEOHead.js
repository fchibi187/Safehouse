import Head from 'next/head'

/**
 * SEOHead – drop into any page with a `seo` prop built by buildSEO().
 *
 * Usage:
 *   import SEOHead from '../components/SEOHead'
 *   import { buildSEO } from '../lib/seo'
 *
 *   export default function MyPage() {
 *     const seo = buildSEO({ title: 'Shop', canonical: '/shop' })
 *     return <><SEOHead seo={seo} /><main>…</main></>
 *   }
 */
export default function SEOHead({ seo = {}, schema = null }) {
  const {
    title,
    description,
    canonical,
    ogImage,
    twitterHandle,
    locale,
    themeColor,
    noIndex = false,
  } = seo

  return (
    <Head>
      {/* ── Primary ── */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="theme-color" content={themeColor} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonical} />

      {/* ── Viewport / PWA ── */}
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="LinaRoos" />

      {/* ── Open Graph ── */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content="LinaRoos" />

      {/* ── Twitter Card ── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* ── Favicon / icons ── */}
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* ── Fonts preconnect ── */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* ── JSON-LD ── */}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
    </Head>
  )
}
