import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/laceter-api/:path*",
        destination: "https://www.laceter.com/api/:path*",
      },
      {
        source: "/laceter-api-payment/:path*",
        destination: "https://www.laceter.com/api-payment-feetchy/:path*",
      },
      {
        source: "/uploads/:path*",
        destination: "https://www.laceter.com/uploads/:path*",
      },
    ];
  },
};

export default nextConfig;
