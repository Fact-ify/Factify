import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg"],
  async redirects() {
    return [
      { source: "/signin", destination: "/verify", permanent: false },
      { source: "/signup", destination: "/verify", permanent: false },
      { source: "/reset-password", destination: "/verify", permanent: false },
    ];
  },
  images: {
    remotePatterns: [
      { hostname: "avatars.githubusercontent.com" },
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "picsum.photos" },
      { hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
