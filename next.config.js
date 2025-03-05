/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  reactStrictMode: true,
  // Add this to prevent hydration errors related to Grammarly extensions
  experimental: {
    optimizeCss: true,
    optimizeServerReact: true,
  },
  // Add custom webpack config to handle serialization errors
  webpack: (config) => {
    config.infrastructureLogging = {
      level: "error",
    };
    return config;
  },
};

module.exports = nextConfig;
