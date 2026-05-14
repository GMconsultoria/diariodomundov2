import { createRequire } from "module";
const require = createRequire(import.meta.url);

let app: any;

export default async function handler(req: any, res: any) {
  try {
    if (!app) {
      // Lazy load to prevent top-level initialization crashes
      const { createApp } = require("../server/_core/index.js");
      app = await createApp();
    }
    
    // Pass control to Express
    app(req, res);
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
