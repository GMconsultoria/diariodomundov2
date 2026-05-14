import express from "express";

export async function createApp() {
  const app = express();
  
  app.get("/api/health", (req, res) => {
    res.json({ ok: true, minimal: true, timestamp: Date.now() });
  });

  return app;
}
