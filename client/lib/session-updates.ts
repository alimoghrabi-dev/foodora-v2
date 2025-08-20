"use server";

import { sealData } from "iron-session";
import { sessionOptions } from "./session-options";
import { getCurrentToken } from "./server";
import { cookies } from "next/headers";
import { removeSessionOnLogout } from "./remove-session";
import ServerEndpoint from "./server-endpoint";

export async function refetchSessionCookie() {
  try {
    const { success } = await removeSessionOnLogout();

    if (!success) throw new Error("Failed to remove session cookie");

    const token = await getCurrentToken();
    const cookieStore = cookies();

    const apiRes = await ServerEndpoint.get("/auth/status", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (apiRes.status !== 200) throw new Error("Invalid token");

    const user = apiRes.data;

    const sealed = await sealData(user, sessionOptions);

    (await cookieStore).set({
      name: sessionOptions.cookieName,
      value: sealed,
      maxAge: 60 * 5,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  } catch (error) {
    console.error("Failed to refetch session cookie:", error);
    throw error;
  }
}
