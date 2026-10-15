import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * `npm run dev` writes to `.next-dev`, while `npm run build` / `npm start`
   * use `.next`. That means you can keep the dev server running while testing
   * a production build (or vice versa) without one wiping the other's files.
   */
  distDir: process.env.NEXT_DIST_DIR || ".next",

  /**
   * The machine this runs on has an unrelated package-lock.json one folder up
   * (in the user profile), which makes Next infer the wrong workspace root and
   * print a warning on every start. Pin file tracing to this project instead.
   */
  outputFileTracingRoot: path.resolve(__dirname),
};

export default nextConfig;
