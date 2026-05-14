export default async function handler(req: any, res: any) {
  try {
    const { createApp } = await import("../server/_core/index");
    
    // Only initialize the app once per container
    if (!(global as any)._app) {
      (global as any)._app = await createApp();
    }
    
    const expressApp = (global as any)._app;
    return expressApp(req, res);
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
