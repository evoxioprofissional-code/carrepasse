import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Existe um package-lock.json na pasta do usuário; fixa a raiz no projeto.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
