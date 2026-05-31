import { NextResponse } from "next/server";

export function GET(req: Request) {
  const url = new URL(req.url);
  const origin = url.origin;
  const response = NextResponse.redirect(`${origin}/`);
  response.cookies.delete("app_session_id");
  return response;
}
