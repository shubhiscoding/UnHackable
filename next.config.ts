import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['assets.aceternity.com', 'lh3.googleusercontent.com'], // Add the domain here
  },
};

export default nextConfig;
