import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["tailwindcss.com", "cdn.sanity.io"],
  },
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "prisma"],
  },
};

export default nextConfig;
