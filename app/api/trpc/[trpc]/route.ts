import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@server/routers";
import type { TrpcContext } from "@server/_core/context";
import { sdk } from "@server/_core/sdk";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async (): Promise<TrpcContext> => {
      // Parse cookie from request headers for auth
      let user = null;
      try {
        const cookieHeader = req.headers.get("cookie") ?? undefined;
        const parsed = Object.fromEntries(
          (cookieHeader ?? "")
            .split(";")
            .map((c) => c.trim().split("=").map(decodeURIComponent))
            .filter(([k]) => k)
            .map(([k, ...vs]) => [k, vs.join("=")])
        );
        const sessionCookie = parsed["app_session_id"];
        const session = await sdk.verifySession(sessionCookie);
        if (session) {
          const { getUserByOpenId } = await import("@server/db");
          user = (await getUserByOpenId(session.openId)) ?? null;
        }
      } catch {
        user = null;
      }

      // Return a minimal context compatible with TrpcContext
      // req/res are typed for Express; in Next.js we pass stubs
      return {
        req: req as any,
        res: {} as any,
        user,
      };
    },
    onError: ({ path, error }) => {
      console.error(`[tRPC] Error on ${path}:`, error.message);
    },
  });

export { handler as GET, handler as POST };
