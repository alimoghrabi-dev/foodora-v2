import React from "react";
import { getRestaurantSession } from "@/lib/get-user";
import NotPublishedBanner from "@/components/banners/NotPublishedBanner";

export default async function HomePage() {
  const restaurant = await getRestaurantSession();

  return (
    <div className="w-full">
      {!restaurant?.isPublished && <NotPublishedBanner />}
    </div>
  );
}
