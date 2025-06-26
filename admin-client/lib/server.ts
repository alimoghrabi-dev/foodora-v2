"use server";

import { headers } from "next/headers";
import { parse } from "cookie";

export const getCurrentToken = async () => {
  const headersList = await headers();
  const rawCookie = headersList.get("cookie") || "";
  const cookies = parse(rawCookie);

  return cookies["Fresh_V2_Access_Token_RESTAURANT"] || null;
};
