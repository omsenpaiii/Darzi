import type { NextConfig } from 'next';
const config: NextConfig = {
  poweredByHeader: false,
  async redirects() { return [{ source: '/wardrobe', destination: '/our-work', permanent: true }, { source: '/contact', destination: '/contact-us', permanent: true }]; },
  async headers() { return [{ source: '/:path*', headers: [{ key: 'X-Content-Type-Options', value: 'nosniff' }, { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }, { key: 'Permissions-Policy', value: 'camera=(self), microphone=(), geolocation=()' }, { key: 'X-Frame-Options', value: 'DENY' }] }]; }
};
export default config;
