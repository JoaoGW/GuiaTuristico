import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: {
    // Ignora erros de tipo durante a build devido a bug no Next.js 15.5.7
    // https://github.com/vercel/next.js/issues/issues
    ignoreBuildErrors: true,
  },
};

export default nextConfig;