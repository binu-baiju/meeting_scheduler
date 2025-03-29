import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

export async function middleware(req: NextRequest) {
  console.log("hello");
  const session = await auth();

  console.log("sessionfrom middleware", session);

  if (!session) {
    // console.log("hello from no session");
    // console.log(req.url);
    // return NextResponse.redirect(new URL("/login", req.url));
    // const newUrl = new URL("/login", req.nextUrl.origin);
    // return Response.redirect(newUrl);
  }

  return NextResponse.next();
}
