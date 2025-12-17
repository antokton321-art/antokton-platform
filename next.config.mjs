/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['firebase']
  }
};

export default nextConfig;