import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // O package-lock.json vazio na raiz do monorepo faria o Turbopack adotá-la como raiz.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
