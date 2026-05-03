/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.1.160'],

  // Static export only during `npm run build` (NODE_ENV=production).
  // Dev server runs without it so dynamic routes and rewrites work normally.
  ...(isProd ? { output: 'export' } : {}),

  trailingSlash: true,

  // Rewrites are ignored when output: 'export' (production).
  // In dev they mirror what nginx does in production:
  //   - /who/* proxied to the external API (so relative-URL API calls work)
  //   - /people/<slug> → /people/ shell for client-side slug parsing
  async rewrites() {
    return [
      { source: '/who/:path*', destination: 'https://w.chunkyapi.com/who/:path*' },
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
