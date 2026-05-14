import "dotenv/config";
import { createApp } from "../server/_core/index";

let app: any;
let initPromise: Promise<any> | null = null;

async function getApp() {
  if (app) return app;
  if (!initPromise) {
    initPromise = createApp().then((expressApp) => {
      app = expressApp;
      return app;
    }).catch((err) => {
      console.error("[Vercel] Failed to initialize app:", err);
      initPromise = null;
      throw err;
    });
  }
  return initPromise;
}

export default async function handler(req: any, res: any) {
  try {
    const expressApp = await getApp();
    return expressApp(req, res);
  } catch (error: any) {
    console.error("[Vercel] Handler error:", error);
    res.status(500).json({ error: "Internal server error", message: error?.message });
  }
}
