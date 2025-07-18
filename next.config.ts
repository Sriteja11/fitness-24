import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */  // Optional: Adds TypeScript type safety for Next.js config
const nextConfig = {
  reactStrictMode: true,
  // ...other Next.js config (e.g., images, webpack customizations, etc.)
};

export default withPWA({
  dest: 'public',        // PWA-specific: Destination for generated files like sw.js and workbox-*.js
  register: true,        // PWA-specific: Auto-register the service worker
  skipWaiting: true,     // PWA-specific: Skip waiting phase for immediate SW activation
  // ...other PWA config (e.g., disable: process.env.NODE_ENV === 'development' to turn off in dev mode)
})(nextConfig);
