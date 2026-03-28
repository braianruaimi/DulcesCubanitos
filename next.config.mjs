/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/CubanitosDulces',
  assetPrefix: '/CubanitosDulces/',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
