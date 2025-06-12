const nextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "form-wise-app.vercel.app",
          },
        ],
        permanent: true,
        destination: "https://www.formwise.fr/:path*",
      },
    ];
  },
  images: {
    domains: ["tailwindcss.com", "cdn.sanity.io"],
  },
  experimental: {
    serverExternalPackages: ["@prisma/client", "prisma"],
  },
};

export default nextConfig;
