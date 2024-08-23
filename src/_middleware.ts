import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { startTelegramBotInDev } from "./lib/telegram/start";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  console.log("mw");
  //   // await startTelegramBotInDev();
  return NextResponse.next(); //NextResponse.redirect(new URL("/home", request.url));
}

// // See "Matching Paths" below to learn more
export const config = {
  matcher: "/",
};
