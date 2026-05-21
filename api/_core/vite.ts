import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config.js";
import { renderPageToString } from "./ssr-renderer.js";
import * as db from "../db.js";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      
      // Use SSR to inject content and meta tags
      const pageData = await getPageData(url);
      const htmlWithMeta = await renderPageToString({ url, template, dbData: pageData });
      
      const page = await vite.transformIndexHtml(url, htmlWithMeta);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath, { index: false })); // Disable automatic index.html serving

  // Serve index.html with SSR injection for all non-file routes
  app.use("*", async (req, res, next) => {
    try {
      const url = req.originalUrl;
      const templatePath = path.resolve(distPath, "index.html");
      const template = await fs.promises.readFile(templatePath, "utf-8");
      
      const pageData = await getPageData(url);
      const htmlWithMeta = await renderPageToString({ url, template, dbData: pageData });
      
      res.status(200).set({ "Content-Type": "text/html" }).send(htmlWithMeta);
    } catch (e) {
      console.error("[SSR Error in Production]", e);
      res.sendFile(path.resolve(distPath, "index.html"));
    }
  });
}

// Helper to fetch necessary data for SSR based on the URL route
async function getPageData(url: string) {
  // Extract path without query strings
  const pathname = url.split('?')[0];
  
  if (pathname === '/') {
    return { page: { title: "Diário do Mundo | Notícias Independentes", description: "Portal de notícias independente com cobertura completa de política, economia, investimentos, ciência e tecnologia." } };
  }
  
  if (pathname.startsWith('/noticias/')) {
    const slug = pathname.split('/noticias/')[1];
    if (slug) {
      const post = await db.getPostBySlug(slug);
      if (post) {
        return { post };
      }
    }
  }
  
  if (pathname === '/sobre') {
    return { page: { title: "Sobre Nós", description: "Conheça a missão, valores e a história do Diário do Mundo, seu portal independente de notícias." } };
  }
  
  if (pathname === '/contato') {
    return { page: { title: "Contato", description: "Entre em contato com a equipe do Diário do Mundo." } };
  }
  
  if (pathname === '/privacidade' || pathname === '/politica-de-privacidade') {
    return { page: { title: "Política de Privacidade", description: "Política de privacidade e proteção de dados do Diário do Mundo." } };
  }
  
  if (pathname === '/termos') {
    return { page: { title: "Termos de Uso", description: "Termos de uso do portal Diário do Mundo." } };
  }
  
  if (pathname.startsWith('/categoria/')) {
    const category = decodeURIComponent(pathname.split('/categoria/')[1] || "");
    return { page: { title: `Notícias sobre ${category}`, description: `Últimas notícias e artigos sobre ${category}.` } };
  }

  return null;
}
