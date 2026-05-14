import { createApp } from "../server/_core/index.js";

let app: any;

export default async function handler(req: any, res: any) {
  try {
    if (!app) {
      app = await createApp();
    }
    return app(req, res);
  } catch (error: any) {
    console.error("[Vercel] Handler error:", error);
    res.status(500).json({ 
      error: "Internal server error", 
      message: error?.message,
      stack: error?.stack,
      name: error?.name 
    });
  }
}
