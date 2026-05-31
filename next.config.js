/** @type {import('next').NextConfig} */

const securityHeaders = [
  // Impede clickjacking — a página não pode ser embutida em iframe de outros domínios
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Impede MIME sniffing (vetor de XSS via upload)
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Controla referrer enviado em requisições externas
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Força HTTPS por 1 ano (apenas em produção — a Vercel já garante, mas é boa prática declarar)
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  // Permissões de APIs do browser — desativar o que não é usado
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  // Content Security Policy — restringe fontes de scripts e recursos
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Scripts: próprio domínio + Google (Analytics, AdSense, OAuth) + inline do Next.js
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://pagead2.googlesyndication.com https://adservice.google.com https://accounts.google.com",
      // Estilos: próprio domínio + inline (Tailwind/CSS-in-JS)
      "style-src 'self' 'unsafe-inline'",
      // Imagens: próprio domínio + fontes externas permitidas (Unsplash, Cloudinary, Google favicons)
      "img-src 'self' data: https://res.cloudinary.com https://images.unsplash.com https://www.google.com https://lh3.googleusercontent.com https://pagead2.googlesyndication.com",
      // Fontes: apenas próprio domínio
      "font-src 'self'",
      // Conectar (fetch/XHR): próprio domínio + Google + Cloudinary
      "connect-src 'self' https://www.googletagmanager.com https://analytics.google.com https://pagead2.googlesyndication.com https://accounts.google.com",
      // Frames: Google AdSense usa iframes para anúncios
      "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
      // Outros
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join("; "),
  },
];

const nextConfig = {
  reactStrictMode: true,
  // ATENÇÃO: ignoreBuildErrors: true oculta erros TypeScript no build.
  // Recomendado mudar para false após resolver os erros de tipo existentes.
  typescript: { ignoreBuildErrors: true },

  async headers() {
    return [
      {
        // Aplicar em todas as rotas públicas
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  // Turbopack (Next.js 16 default bundler)
  turbopack: {
    root: process.cwd(),
    resolveAlias: {
      "../db.js": "./api/db.ts",
      "../drizzle/schema.js": "./drizzle/schema.ts",
      "../../drizzle/schema.js": "./drizzle/schema.ts",
      "./_core/sdk.js": "./api/_core/sdk.ts",
      "./_core/env.js": "./api/_core/env.ts",
      "./env.js": "./api/_core/env.ts",
      "./sdk.js": "./api/_core/sdk.ts",
      "./trpc.js": "./api/_core/trpc.ts",
      "./context.js": "./api/_core/context.ts",
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
      ".js": [".js", ".ts", ".tsx"],
      ".jsx": [".jsx", ".tsx"],
    };
    return config;
  },
};

export default nextConfig;
