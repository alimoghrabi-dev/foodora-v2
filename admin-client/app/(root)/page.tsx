import React from "react";
import NotPublishedBanner from "@/components/banners/NotPublishedBanner";
import { getRestaurantSession } from "@/lib/get-user";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Foodora Admin | Dashboard",
};

export default async function HomePage() {
  const restaurant = await getRestaurantSession();

  return (
    <div className="w-full">
      {!restaurant?.isPublished && <NotPublishedBanner />}
    </div>
  );
}
