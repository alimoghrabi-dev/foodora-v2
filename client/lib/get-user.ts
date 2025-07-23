import { cookies } from "next/headers";
import { unsealData } from "iron-session";
import { sessionOptions } from "../lib/session-options";

export async function getUserSession() {
  const sealed = (await cookies()).get("user_session")?.value;
  if (!sealed) return null;
  try {
    return (await unsealData(sealed, sessionOptions)) as IUser;
  } catch {
    return null;
  }
}
