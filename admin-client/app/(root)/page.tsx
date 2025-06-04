import { getUserFromCookie } from "@/lib/get-user";
import React from "react";

export default async function HomePage() {
  const user = await getUserFromCookie();

  return <div className="w-full">{JSON.stringify(user)}</div>;
}
