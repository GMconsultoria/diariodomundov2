import express from "express";
import compression from "compression";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../server/routers.js";
import { createContext } from "../server/_core/context.js";
import { ENV } from "../server/_core/env.js";
import * as db from "../server/db.js";
import { sql } from "drizzle-orm";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import axios from "axios";
import { COOKIE_NAME, ONE_YEAR_MS } from "../shared/const.js";
import { getSessionCookieOptions, sdk } from "../server/_core/sdk.js";

let app: any;

export default async function handler(req: any, res: any) {
  try {
    if (!app) {
      const server = express();
      
      server.use(compression());
      server.set("trust proxy", 1);
      
      // Minimal Helmet for Vercel
      server.use(helmet({
        contentSecurityPolicy: false, // Disable CSP temporarily to ensure no blocked scripts
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

          const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
            client_id: ENV.googleClientId,
            client_secret: ENV.googleClientSecret,
            code,
            grant_type: "authorization_code",
            redirect_uri: redirectUri
          });

          const userResponse = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` }
          });

          const googleUser = userResponse.data;
          await db.upsertUser({
            openId: googleUser.id,
            email: googleUser.email,
            name: googleUser.name,
            avatarUrl: googleUser.picture,
            role: "user"
          });

          const session = await sdk.createSession(googleUser.id);
          res.cookie(COOKIE_NAME, session.id, getSessionCookieOptions());

          let returnTo = "/";
          try { if (state) returnTo = JSON.parse(state).returnTo || "/"; } catch (e) {}
          return res.redirect(302, returnTo);
        } catch (error: any) {
          console.error("[OAuth] Error:", error.message);
          return res.status(500).send("Login failed");
        }
      });

      server.get("/api/health", (req: any, res: any) => {
        res.json({ ok: true, consolidated: true, timestamp: Date.now() });
      });

      app = server;
    }
    
    return app(req, res);
  } catch (error: any) {
    console.error("[Vercel] Handler error:", error);
    res.status(500).json({ error: "Internal server error", message: error.message });
  }
}
