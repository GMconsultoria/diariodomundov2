import { NextResponse } from "next/server";
import { ENV } from "@server/_core/env";
import { sdk, getSessionCookieOptions } from "@server/_core/sdk";
import { upsertUser } from "@server/db";

/** Garante que returnTo seja apenas um path relativo do próprio site (evita open redirect). */
function sanitizeReturnTo(value: unknown): string {
  if (typeof value !== "string") return "/";
  // Aceitar apenas paths relativos que começam com "/"
  // Rejeitar qualquer coisa com "://" (URL absoluta) ou início com "//"
  if (!value.startsWith("/") || value.startsWith("//")) return "/";
  // Rejeitar paths que contêm protocolos embutidos ou caracteres suspeitos
  if (/[<>"'\\]/.test(value)) return "/";
  return value;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code") ?? "";
  const state = url.searchParams.get("state") ?? "";
  const origin = process.env.NODE_ENV === "development" ? url.origin : (ENV.baseUrl || url.origin);
  const redirectUri = `${origin}/api/oauth/callback`;

  try {
    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: ENV.googleClientId,
        client_secret: ENV.googleClientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) throw new Error(tokenData.error_description || "Token exchange failed");

    // Fetch user profile
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const googleUser = await userRes.json();
    if (!userRes.ok) throw new Error("Failed to fetch user info");

    // Upsert user in DB
    await upsertUser({
      openId: googleUser.id,
      email: googleUser.email,
      name: googleUser.name,
      role: "reader",
    });

    // Create session token
    const sessionToken = await sdk.createSessionToken(googleUser.id, { name: googleUser.name });
    const cookieOptions = getSessionCookieOptions();

    // Sanitizar returnTo para evitar open redirect
    let rawReturnTo = "/";
    try {
      if (state) rawReturnTo = JSON.parse(state).returnTo || "/";
    } catch {}
    const returnTo = sanitizeReturnTo(rawReturnTo);

    const response = NextResponse.redirect(`${origin}${returnTo}`);
    response.cookies.set("app_session_id", sessionToken, {
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      path: cookieOptions.path,
      maxAge: 60 * 60 * 24 * 365,
    });

    return response;
  } catch (error: any) {
    console.error("[OAuth] Callback failed:", error.message);
    return new Response("Login failed during authentication callback.", { status: 500 });
  }
}
