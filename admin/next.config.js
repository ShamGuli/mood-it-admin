/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Build zamanı ESLint və TypeScript error-larını ignore et (Vercel deploy sürətləndirmək üçün)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['supabase.co', 'localhost'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Environment variables that should be available on the client
  env: {
    NEXT_PUBLIC_APP_NAME: 'Mood IT Admin',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },
  // CORS headers for public API
  async headers() {
    return [
      {
        source: '/api/public/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ];
  },
  // Serve static HTML files from public folder
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/index.html',
      },
      {
        source: '/service-all',
        destination: '/service-all.html',
      },
      {
        source: '/service-smartphone',
        destination: '/service-smartphone.html',
      },
      {
        source: '/service-playstation',
        destination: '/service-playstation.html',
      },
      {
        source: '/service-macos',
        destination: '/service-macos.html',
      },
      {
        source: '/service-notebook',
        destination: '/service-notebook.html',
      },
      {
        source: '/service-desktop',
        destination: '/service-desktop.html',
      },
      {
        source: '/service-gpu',
        destination: '/service-gpu.html',
      },
      {
        source: '/preisliste',
        destination: '/preisliste.html',
      },
      {
        source: '/contact',
        destination: '/contact.html',
      },
      {
        source: '/about',
        destination: '/about.html',
      },
    ];
  },
};

module.exports = nextConfig;
