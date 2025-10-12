import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone'
};

module.exports = {
  outputFileTracingRoot: __dirname,
};

export default nextConfig;