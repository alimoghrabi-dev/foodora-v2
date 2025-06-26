"use server";

import { cookies } from "next/headers";
import { sealData, unsealData } from "iron-session";
import { sessionOptions } from "../lib/session-options";

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
