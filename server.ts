import { createApp } from "./api/_core/index.js";
import { createServer } from "http";

async function startServer() {
  console.log("[Server] Version: 1.3.0-stable");
  const app = await createApp();
  const server = createServer(app);

  if (process.env.NODE_ENV === "development") {
    const { setupVite } = await import("./api/_core/vite.js");
    await setupVite(app, server);
  } else {
    console.log("[Server] Setting up static file serving");
    const { serveStatic } = await import("./api/_core/vite.js");
    serveStatic(app);
  }

  const port = parseInt(process.env.PORT || "3000");

  server.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer().catch(console.error);
