/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

type CacheEntry = { ts: number; data: any };

const CACHE_TTL = 1000 * 60 * 60;
const cache = new Map<string, CacheEntry>();

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const lat = url.searchParams.get("lat");
    const lon = url.searchParams.get("lon");

    if (!lat || !lon)
      return NextResponse.json(
        { error: "lat & lon required" },
        { status: 400 }
      );

    const key = `${lat},${lon}`;
    const hit = cache.get(key);
    if (hit && Date.now() - hit.ts < CACHE_TTL) {
      return NextResponse.json(hit.data);
    }

    const USER_AGENT =
      process.env.GEO_USER_AGENT ||
      `my-app/1.0 (${process.env.CONTACT_EMAIL || "amoghrabi168@gmail.com"})`;
    const REFERER =
      process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL || null;

    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
      lat
    )}&lon=${encodeURIComponent(lon)}&addressdetails=1`;

    const headers: Record<string, string> = {
      Accept: "application/json",
      "User-Agent": USER_AGENT,
    };

    if (REFERER) headers["Referer"] = REFERER;

    const res = await fetch(nominatimUrl, { headers });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      return NextResponse.json(
        { error: "Nominatim error", detail: txt },
        { status: res.status }
      );
    }

    const data = await res.json();
    cache.set(key, { ts: Date.now(), data });

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Reverse geocode error:", err);
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
