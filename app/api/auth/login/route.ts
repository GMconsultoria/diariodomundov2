import { NextResponse } from "next/server";
import { ENV } from "@server/_core/env";

export function GET(req: Request) {
  const url = new URL(req.url);
  const returnTo = url.searchParams.get("returnTo") || "/";

  if (!ENV.googleClientId) {
    return NextResponse.json({ error: "Login configuration error" }, { status: 500 });
  }

  const origin = ENV.baseUrl || url.origin;
  const redirectUri = `${origin}/api/auth/callback`;

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", ENV.googleClientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "email profile");
  authUrl.searchParams.set("state", JSON.stringify({ returnTo }));

  return NextResponse.redirect(authUrl.toString());
}
