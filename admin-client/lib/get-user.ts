import { cookies } from "next/headers";
import { unsealData } from "iron-session";
import { sessionOptions } from "../lib/session-options";

export async function getRestaurantSession() {
  const sealed = (await cookies()).get("restaurant_session")?.value;
  if (!sealed) return null;
  try {
    return (await unsealData(sealed, sessionOptions)) as IRestaurant;
  } catch {
    return null;
  }
}
