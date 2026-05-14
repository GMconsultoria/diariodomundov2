export default async function handler(req: any, res: any) {
  const status: any = {
    start: true,
    modules: {}
  };

  try {
    status.modules.express = !!(await import("express"));
    status.modules.axios = !!(await import("axios"));
    status.modules.drizzle = !!(await import("drizzle-orm"));
    status.modules.postgres = !!(await import("postgres"));
    status.modules.helmet = !!(await import("helmet"));
    status.modules.env = !!(await import("../server/_core/env.js"));
    status.modules.db = !!(await import("../server/db.js"));
    status.modules.routers = !!(await import("../server/routers.js"));
    
    res.json({ ok: true, status });
  } catch (error: any) {
    res.status(500).json({ ok: false, status, error: error.message, stack: error.stack });
  }
}
