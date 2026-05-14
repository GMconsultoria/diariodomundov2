import express from "express";
import { msg } from "./test";

const app = express();
app.get("/api/health", (req, res) => {
  res.json({ message: msg, timestamp: Date.now() });
});

export default function handler(req: any, res: any) {
  return app(req, res);
}
