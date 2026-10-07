import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/strategy/pdf": ["./src/fonts/**"],
  },
};

export default nextConfig;
