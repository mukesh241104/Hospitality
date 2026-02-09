import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'photos.hotelbeds.com',
        pathname: '/giata/**',
      },
    ],
  },
};

export default nextConfig;
