/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/DulcesCubanitos',
  assetPrefix: '/DulcesCubanitos/',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
