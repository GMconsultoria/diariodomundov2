import { createApp } from "../server/_core/index";
import type { Request, Response } from "express";

let app: any;

export default async function handler(req: Request, res: Response) {
  if (!app) {
    app = await createApp();
  }
  return app(req, res);
}
