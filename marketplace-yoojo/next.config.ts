import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Required for the standalone Docker output
  output: "standalone",
};

export default nextConfig;
