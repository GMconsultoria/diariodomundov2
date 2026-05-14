import handler from "./api/index";
import express from "express";

const app = express();

app.all("*", async (req, res) => {
  try {
    await handler(req as any, res as any);
  } catch (err) {
    console.error("Crash during handler:", err);
    res.status(500).send("Crash");
  }
});

app.listen(3001, () => {
  console.log("Mock Vercel server on 3001");
});
