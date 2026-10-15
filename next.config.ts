import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * `npm run dev` writes to `.next-dev`, while `npm run build` / `npm start`
   * use `.next`. That means you can keep the dev server running while testing
   * a production build (or vice versa) without one wiping the other's files.
   */
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
