/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export only during `npm run build` (NODE_ENV=production).
  // Dev server runs without it so dynamic routes and rewrites work normally.
  ...(isProd ? { output: 'export' } : {}),

  trailingSlash: true,

  // Rewrite /people/<slug> → /people/ shell so the dev server works the
  // same way nginx does in production. Ignored when output: 'export'.
  async rewrites() {
    return [
      { source: '/people/:slug+', destination: '/people/' },
    ];
  },

  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'image.tmdb.org' },
      { protocol: 'https', hostname: 'i.scdn.co' },
      { protocol: 'https', hostname: '**.musicbrainz.org' },
      { protocol: 'https', hostname: '**.cloudfront.net' },
    ],
  },
};

module.exports = nextConfig;
