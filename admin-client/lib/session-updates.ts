"use server";

import { cookies } from "next/headers";
import { sealData, unsealData } from "iron-session";
import { sessionOptions } from "../lib/session-options";
import ServerEndpoint from "./server-endpoint";
import { getCurrentToken } from "./server";
import { removeSessionOnLogout } from "./remove-session";

export async function updateEmailVerifiedInCookie() {
  const cookieStore = cookies();
  const sealed = (await cookieStore).get(sessionOptions.cookieName)?.value;

  if (!sealed) return;

  try {
    const session = (await unsealData(sealed, sessionOptions)) as IRestaurant;

    session.isEmailVerified = true;

    const newSealed = await sealData(session, sessionOptions);

    (await cookieStore).set(sessionOptions.cookieName, newSealed, {
      ...sessionOptions.cookieOptions,
      maxAge: 60 * 5,
    });
  } catch (error) {
    console.error("Failed to update session cookie:", error);
  }
}

export async function refetchSessionCookie() {
  try {
    const { success } = await removeSessionOnLogout();

    if (!success) throw new Error("Failed to remove session cookie");

    const token = await getCurrentToken();
    const cookieStore = cookies();

    const apiRes = await ServerEndpoint.get("/admin-restaurant/status", {
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
