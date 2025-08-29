/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

const ipCache = new Map<string, { ts: number; data: any }>();
const IP_CACHE_TTL = 1000 * 60 * 10;

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const ipParam = url.searchParams.get("ip");
    const cacheKey = ipParam || "me";

    const hit = ipCache.get(cacheKey);
    if (hit && Date.now() - hit.ts < IP_CACHE_TTL)
      return NextResponse.json(hit.data);

    const endpoint = ipParam
      ? `https://ipapi.co/${ipParam}/json/`
      : `https://ipapi.co/json/`;

    const res = await fetch(endpoint, {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      return NextResponse.json(
        { error: "IP provider error", detail: txt },
        { status: res.status }
      );
    }

    const data = await res.json();
    ipCache.set(cacheKey, { ts: Date.now(), data });
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("IP lookup error:", err);
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
