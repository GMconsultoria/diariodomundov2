import express from "express";

const app = express();
app.get("/api/health", (req, res) => {
  res.json({ message: "Express is working in api/index.ts", timestamp: Date.now() });
});

export default function handler(req: any, res: any) {
  return app(req, res);
}
