import express from "express";
import compression from "compression";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../routers.js";
import { createContext } from "./context.js";
const COOKIE_NAME = "app_session_id";
import { ENV } from "./env.js";
import * as db from "../db.js";
import { getSessionCookieOptions, sdk } from "./sdk.js";
import { sql } from "drizzle-orm";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

let cachedSitemap: string | null = null;
let sitemapCacheTime: number = 0;
const SITEMAP_CACHE_TTL = 5 * 60 * 1000; // 5 minutos

function getQueryParam(req: any, name: string): string {
  const val = req.query[name];
  return typeof val === "string" ? val : "";
}

export async function createApp() {
  const app = express();

  // Performance: Enable Gzip compression
  app.use(compression());

  // Confia no proxy da Vercel para capturar o IP real
  app.set("trust proxy", 1);

  // Security: Global Hardening with Helmet
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": ["'self'", "data:", "https:", "https://*.unsplash.com", "https://*.google.com"],
        "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://*.google.com", "https://*.gstatic.com"],
        "connect-src": ["'self'", "https:", "wss:", "ws:"],
        "frame-src": ["'self'", "https://*.google.com"],
        "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        "font-src": ["'self'", "https://fonts.gstatic.com"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));

  // Rate Limiting: General protection
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests from this IP, please try again after 15 minutes",
  });
  app.use("/api", limiter);

  // Specialized Limiter for Contact Form (Spam protection)
  const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 contact submissions per hour
    message: "Muitas mensagens enviadas. Por favor, tente novamente mais tarde.",
  });
  app.use("/api/trpc/contact.submit", contactLimiter);

  // Rate Limiting para incrementView
  const incrementViewLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // Limit each IP to 100 view increments per minute
    skip: () => process.env.NODE_ENV === "development",
  });
  app.use("/api/trpc/posts.incrementView", incrementViewLimiter);

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // API Routes MUST be registered BEFORE serveStatic to avoid 404/SPA interception in production
  console.log("[Server] Registering API routes...");

  // Run database migrations for the new contact_messages table
  const shouldRunMigrations = process.env.NODE_ENV !== 'production' || process.env.RUN_MIGRATIONS === 'true';

  if (shouldRunMigrations) {
    try {
      const database = await db.getDb();
      if (database) {
        console.log("[Migration] Ensuring contact_messages table exists...");
        await database.execute(sql.raw(`
          CREATE TABLE IF NOT EXISTS "contact_messages" (
            "id" SERIAL PRIMARY KEY,
            "name" varchar(255) NOT NULL,
            "email" varchar(320) NOT NULL,
            "subject" varchar(255) NOT NULL,
            "message" text NOT NULL,
            "read" boolean NOT NULL DEFAULT false,
            "created_at" timestamp DEFAULT CURRENT_TIMESTAMP
          )
        `));
      }
    } catch (err: any) {
      console.error("[Migration] Error during migration:", err.message);
    }
  }

  // TRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
      onError: ({ path, error }) => {
        console.error(`[TRPC] Error on ${path}:`, error);
      },
    })
  );

  // Sitemap generator
  app.get("/sitemap.xml", async (req, res) => {
    const now = Date.now();
    if (cachedSitemap && (now - sitemapCacheTime < SITEMAP_CACHE_TTL)) {
      res.header("Content-Type", "application/xml");
      res.send(cachedSitemap);
      return;
    }

    try {
      const protocol = req.headers["x-forwarded-proto"] || req.protocol;
      const origin = ENV.baseUrl || `${protocol}://${req.get('host')}`;
      const posts = await db.getAllPostsForSitemap();
      
      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
      
      // Home
      xml += `  <url><loc>${origin}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>\n`;
      
      // Static Pages
      ['/sobre', '/politica-de-privacidade', '/contato', '/termos'].forEach(page => {
        xml += `  <url><loc>${origin}${page}</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>\n`;
      });
      
      // Categories
      const CATEGORIES = ["Política", "Economia", "Investimentos", "Ciência e Tecnologia", "Curiosidade"];
      CATEGORIES.forEach(category => {
        const slug = category.toLowerCase().replace(/ /g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        xml += `  <url><loc>${origin}/categoria/${encodeURIComponent(slug)}</loc><changefreq>daily</changefreq><priority>0.7</priority></url>\n`;
      });
      
      // Posts
      posts.forEach(post => {
        const date = new Date(post.publishedAt || post.createdAt).toISOString();
        xml += `  <url><loc>${origin}/noticias/${post.slug}</loc><lastmod>${date}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n`;
      });
      
      xml += `</urlset>`;
      
      // Cache
      cachedSitemap = xml;
      sitemapCacheTime = now;

      res.header("Content-Type", "application/xml");
      res.header("Cache-Control", "public, max-age=86400");
      res.send(xml);
    } catch (e) {
      res.status(500).send("Error generating sitemap");
    }
  });

  app.get("/robots.txt", (req, res) => {
    const protocol = req.headers["x-forwarded-proto"] || req.protocol;
    const origin = ENV.baseUrl || `${protocol}://${req.get('host')}`;
    res.type("text/plain");
    res.send(`User-agent: *
Disallow: /admin/
Disallow: /api/
Allow: /

User-agent: Googlebot
Allow: /

Sitemap: ${origin}/sitemap.xml
Host: ${origin.replace(/^https?:\/\//, '')}`);
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ ok: true, timestamp: Date.now(), env: process.env.NODE_ENV });
  });

  app.get("/api/version", (req, res) => {
    res.json({ version: "v1.3.0-stable" });
  });

  // OAuth Routes (Native Google OAuth 2.0)
  const loginHandler = (req: express.Request, res: express.Response) => {
    try {
      const clientId = ENV.googleClientId;
      
      if (!clientId) {
        console.error("[OAuth] Missing GOOGLE_CLIENT_ID in ENV.");
        return res.status(500).json({ 
          error: "Login configuration error",
          details: "O administrador precisa configurar o GOOGLE_CLIENT_ID no servidor."
        });
      }

      const protocol = req.headers["x-forwarded-proto"] || req.protocol;
      const origin = ENV.baseUrl || `${protocol}://${req.get("host")}`;
      const redirectUri = `${origin}/api/oauth/callback`;
      const returnTo = (req.query.returnTo as string) || "/";

      const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      authUrl.searchParams.set("client_id", clientId);
      authUrl.searchParams.set("redirect_uri", redirectUri);
      authUrl.searchParams.set("response_type", "code");
      authUrl.searchParams.set("scope", "email profile");
      authUrl.searchParams.set("state", JSON.stringify({ returnTo }));

      return res.redirect(302, authUrl.toString());
    } catch (error) {
      console.error("[OAuth] Redirect failed:", error);
      return res.status(500).json({ error: "Login failed to initialize" });
    }
  };

  app.get("/api/auth/login", loginHandler);
  app.get("/api/oauth/callback", async (req: express.Request, res: express.Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    try {
      const protocol = req.headers["x-forwarded-proto"] || req.protocol;
      const origin = ENV.baseUrl || `${protocol}://${req.get("host")}`;
      const redirectUri = `${origin}/api/oauth/callback`;

      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: ENV.googleClientId,
          client_secret: ENV.googleClientSecret,
          code,
          grant_type: "authorization_code",
          redirect_uri: redirectUri
        })
      });
      const tokenData = await tokenRes.json();
      if (!tokenRes.ok) throw new Error(tokenData.error_description || tokenData.error || "Token exchange failed");

      // 2. Fetch User Profile from Google
      const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });
      const googleUser = await userRes.json();
      if (!userRes.ok) throw new Error("Failed to fetch user info");
      
      // 3. Save or update user in database
      await db.upsertUser({
        openId: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        role: "reader"
      });

      // 4. Create local session (cookie-based)
      const sessionToken = await sdk.createSessionToken(googleUser.id, { name: googleUser.name });
      const cookieOptions = getSessionCookieOptions();
      
      res.cookie(COOKIE_NAME, sessionToken, cookieOptions);

      // 5. Redirect back to original page
      let returnTo = "/";
      try {
        if (state) {
          const parsedState = JSON.parse(state);
          returnTo = parsedState.returnTo || "/";
        }
      } catch (e) {}

      return res.redirect(302, returnTo);
    } catch (error: any) {
      console.error("[OAuth] Callback failed:", error.response?.data || error.message);
      return res.status(500).send("Login failed during authentication callback.");
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie(COOKIE_NAME, getSessionCookieOptions());
    return res.json({ success: true });
  });

  app.get("/api/auth/me", createContext, (req: any, res: express.Response) => {
    return res.json({ user: req.user || null });
  });

  return app;
}
