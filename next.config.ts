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
    ];
  },
};

export default nextConfig;
