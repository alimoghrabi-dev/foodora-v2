import { NextRequest, NextResponse } from "next/server";
import { sealData, unsealData } from "iron-session";
import { sessionOptions } from "./lib/session-options";
import ServerEndpoint from "./lib/server-endpoint";
import { removeSessionOnLogout } from "./lib/remove-session";

const AUTH_TOKEN_COOKIE = "Fresh_V2_Access_Token_RESTAURANT";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;
  const sealedSession = request.cookies.get(sessionOptions.cookieName)?.value;

  const response = NextResponse.next();

  if (sealedSession) {
    try {
      const sessionData = await unsealData(sealedSession, sessionOptions);

      const newSealed = await sealData(sessionData, sessionOptions);
      response.cookies.set(sessionOptions.cookieName, newSealed, {
        ...sessionOptions.cookieOptions,
        maxAge: 60 * 5,
      });
    } catch (err) {
      console.error(err);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (!token) {
    await removeSessionOnLogout();
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const apiRes = await ServerEndpoint.get("/admin-restaurant/status", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (apiRes.status !== 200) throw new Error("Invalid token");

    const user = apiRes.data;

    const sealed = await sealData(user, sessionOptions);
    response.cookies.set(sessionOptions.cookieName, sealed, {
      ...sessionOptions.cookieOptions,
      maxAge: 60 * 5,
    });

    return response;
  } catch (err) {
    console.error(err);

    const redirectResponse = NextResponse.redirect(
      new URL("/login", request.url)
    );

    await removeSessionOnLogout();

    return redirectResponse;
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
