export default function handler(req: any, res: any) {
  res.json({ 
    message: "Hello from minimal Vercel handler", 
    timestamp: Date.now(),
    env: process.env.NODE_ENV
  });
}
