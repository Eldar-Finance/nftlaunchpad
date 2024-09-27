/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@multiversx/sdk-dapp'],
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    config.externals.push('pino-pretty', 'lokijs', 'encoding', {
      bufferutil: 'bufferutil',
      'utf-8-validate': 'utf-8-validate'
    });

    return config;
  },
  reactStrictMode: true,
  images: {
    domains: ['ipfs.io', 'media.xoxno.com'],
  },
};

module.exports = nextConfig;
