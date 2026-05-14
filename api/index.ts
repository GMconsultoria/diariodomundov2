import { createApp } from "../server/_core/index";

let app: any;

export default async function handler(req: any, res: any) {
  try {
    console.log("[Vercel] Handler started");
    if (!app) {
      console.log("[Vercel] Initializing app...");
      app = await createApp();
      console.log("[Vercel] App initialized successfully");
    }
    return app(req, res);
  } catch (error: any) {
    console.error("[Vercel] CRITICAL ERROR:", error);
    res.status(500).json({ 
      error: "Initialization Failed", 
      message: error?.message,
      stack: error?.stack,
      name: error?.name 
    });
  }
}
