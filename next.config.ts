import withPWA from 'next-pwa'

const nextConfig = {
  reactStrictMode: true,
  // ...other Next.js config,
  dest: 'public',
  register: true,
  skipWaiting: true,
  // ...other pwa config
}

export default withPWA(nextConfig)
