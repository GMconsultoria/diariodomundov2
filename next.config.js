import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: true },
  // Turbopack (Next.js 16 default bundler) – mirrors the webpack extensionAlias below
  // so that `.js` imports resolve to `.ts` / `.tsx` source files.
  turbopack: {
    root: process.cwd(),
    resolveAlias: {
      '../db.js': './api/db.ts',
      '../drizzle/schema.js': './drizzle/schema.ts',
      '../../drizzle/schema.js': './drizzle/schema.ts',
      './_core/sdk.js': './api/_core/sdk.ts',
      './_core/env.js': './api/_core/env.ts',
      './env.js': './api/_core/env.ts',
      './sdk.js': './api/_core/sdk.ts',
      './trpc.js': './api/_core/trpc.ts',
      './context.js': './api/_core/context.ts',
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**.googleapis.com" },
    ],
  },
  webpack: (config) => {
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
      '.jsx': ['.jsx', '.tsx'],
    };
    return config;
  },
};

export default nextConfig;
