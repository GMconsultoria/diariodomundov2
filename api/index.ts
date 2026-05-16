import express from "express";
import compression from "compression";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers.js";
import { createContext } from "./_core/context.js";
import { ENV } from "./_core/env.js";
import * as db from "./db.js";
import { sql } from "drizzle-orm";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
const COOKIE_NAME = "app_session_id";
import { getSessionCookieOptions, sdk } from "./_core/sdk.js";

let app: any;

export default async function handler(req: any, res: any) {
  try {
    if (!app) {
      const server = express();
      
      server.use(compression());
      server.set("trust proxy", 1);
      
      // Minimal Helmet for Vercel
      server.use(helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://*.google.com", "https://*.gstatic.com", "https://pagead2.googlesyndication.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https:"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            frameSrc: ["'self'", "https://*.google.com"],
          },
        },
        crossOriginEmbedderPolicy: false,
      }));

      server.use(express.json({ limit: "50mb" }));
      server.use(express.urlencoded({ limit: "50mb", extended: true }));

      // TRPC
      server.use(
        "/api/trpc",
        createExpressMiddleware({
          router: appRouter,
          createContext,
        })
      );

      // OAuth Routes
      server.get("/api/auth/login", (req: any, res: any) => {
        const clientId = ENV.googleClientId;
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
      });

      server.get("/api/oauth/callback", async (req: any, res: any) => {
        const code = req.query.code as string;
        const state = req.query.state as string;

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

          const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: { Authorization: `Bearer ${tokenData.access_token}` }
          });
          const userResponse_data = await userResponse.json();
          if (!userResponse.ok) throw new Error("Failed to fetch user info");

          const googleUser = userResponse_data;
          await db.upsertUser({
            openId: googleUser.id,
            email: googleUser.email,
            name: googleUser.name,
            role: "reader"
          });

          const sessionToken = await sdk.createSessionToken(googleUser.id, { name: googleUser.name });
          res.cookie(COOKIE_NAME, sessionToken, getSessionCookieOptions());

          let returnTo = "/";
          try { if (state) returnTo = JSON.parse(state).returnTo || "/"; } catch (e) {}
          return res.redirect(302, returnTo);
        } catch (error: any) {
          const pgCode = error.code ? `[Code: ${error.code}] ` : '';
          const cause = error.cause ? ` | Cause: ${error.cause.message || error.cause}` : '';
          const detail = error.detail || error.message;
          console.error("[OAuth] Error:", error);
          return res.status(500).send(`Login failed: ${pgCode}${detail}${cause}`);
        }

      });

      server.get("/api/health", async (req, res) => {
      try {
        const dbStatus = await db.getDb().then(() => "connected").catch(e => `db_error: ${e.message}`);
        res.json({ 
          ok: true, 
          env: process.env.NODE_ENV,
          db: dbStatus,
          timestamp: new Date().toISOString()
        });
      } catch (err: any) {
        res.status(500).json({ 
          ok: false, 
          error: err.message,
          stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
      }
    });

      app = server;
    }
    
    return app(req, res);
  } catch (error: any) {
    console.error("[Vercel] Handler error:", error);
    res.status(500).json({ error: "Internal server error", message: error.message });
  }
}
