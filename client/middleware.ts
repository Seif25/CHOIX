import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getTokenPayload } from "./public/util";
import { actions } from "./public/state/state";
import { Poll } from "./public/types/poll.types";

export async function middleware(request: NextRequest) {
  // GET PATHNAME
  const { pathname } = request.nextUrl;
  console.log(`Middleware running for ${pathname}`);

  // GET TOKEN
  console.log(`Checking for token...`);
  const token = request.cookies.get("accessToken");

  if (!token && pathname !== "/") {
    console.log("No token found. Redirecting to home page...");
    return NextResponse.redirect("http://localhost:3000/");
  }

  if (token) {
    const value = token.value;

    const { exp: tokenExp } = getTokenPayload(value);
    const currentTimeInSeconds = Date.now() / 1000;

    // CHECK IF TOKEN IS EXPIRED
    if (tokenExp < currentTimeInSeconds - 10) {
      request.cookies.delete("accessToken");
      console.log(`Token expiring in 10 seconds. Redirecting to home page...`);
      return NextResponse.redirect("http://localhost:3000/");
    }
    // TOKEN NOT EXPIRED
    // HANDLING REDIRECTS
    else {
      actions.setPollAccessToken(value);
      const socket = await actions.initializeSocket();

      if (socket.connected) {
        console.log(`Socket initialized.`);
        if (actions.getSocketConnected() && !actions.getVotingStarted() && pathname !== "/waiting") {
          console.log(`Redirecting to waiting page...`);
          return NextResponse.redirect(`http://localhost:3000/waiting`);
        } else if (actions.getSocketConnected() && actions.getVotingStarted() && pathname !== "/vote") {
          console.log(`Redirecting to voting page...`);
          return NextResponse.redirect(`http://localhost:3000/vote`);
        }
      } else {
        console.log(`Failed to initialize socket. Redirecting to home page...`);
        return NextResponse.redirect("http://localhost:3000/");
      }
    }
  }
}

export const config = {
  matcher: ["/", "/waiting", "/vote", "/results"],
};
