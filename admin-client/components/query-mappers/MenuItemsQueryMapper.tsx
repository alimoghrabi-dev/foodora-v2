"use client";

import React from "react";
import { getClientMenuItems } from "@/lib/actions/client.actions";
import { useQuery } from "@tanstack/react-query";
import MenuItemCard from "../cards/MenuItemCard";
import { Ghost } from "lucide-react";
import { Button } from "../ui/button";
import MenuItemsError from "../errors/MenuItemsError";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";

const MenuItemsQueryMapper: React.FC<{
  initialData: IItem[];
  restaurant: IRestaurant | null;
}> = ({ initialData, restaurant }) => {
  const { data, isPending, isRefetching, isError } = useQuery({
    queryKey: ["MENU_ITEMS"],
    queryFn: getClientMenuItems,
    initialData,
    refetchOnWindowFocus: false,
    enabled: false,
  });

  const saleStarted = (): boolean => {
    if (!restaurant?.onSale) return false;
    if (!restaurant.saleStartDate) return true;
    return new Date(restaurant.saleStartDate) <= new Date();
  };

  const getTimeUntilSale = (startDate?: string | Date | null) => {
    if (!startDate) return "unknown time";

    const now = new Date();
    const start = new Date(startDate);
    const diffMs = start.getTime() - now.getTime();

    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return "less than a minute";
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""}`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""}`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""}`;
  };

  if (isError) {
    return <MenuItemsError />;
  }

  return (
    <div className="w-full flex flex-col gap-y-4 pb-8">
      {restaurant?.onSale && (
        <div className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800 border border-yellow-300 dark:border-yellow-600 shadow flex items-center justify-center gap-3 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-yellow-600 dark:text-yellow-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {saleStarted() ? (
            <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
              This restaurant is offering a{" "}
              <span className="font-semibold">sitewide sale</span> on all menu
              items!
            </p>
          ) : (
            <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
              A <span className="font-semibold">sitewide sale</span> is coming
              soon! Get ready — discounts will start in{" "}
              <span className="underline">
                {getTimeUntilSale(restaurant?.saleStartDate)}
              </span>
              .
            </p>
          )}
        </div>
      )}

      {isPending || isRefetching ? (
        <div className="w-full flex flex-wrap justify-center gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="w-[325px] bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800"
            >
              <Skeleton className="w-full h-[225px] rounded-b-none" />
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="w-32 h-4" />
                  <Skeleton className="w-14 h-4" />
                </div>

                <Skeleton className="w-full h-4" />

                <div className="text-sm flex items-center gap-2 flex-wrap">
                  <Skeleton className="w-10 h-4" />
                  <Skeleton className="w-14 h-4" />
                </div>

                <div className="w-full flex items-center justify-center border-t pt-3.5">
                  <Skeleton className="w-28 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center px-6">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
            <Ghost className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            No Items Found
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Looks like there are no items in the menu yet. Start adding some to
            display here!
          </p>
          <Link href="/menu/add">
            <Button className="rounded-sm cursor-pointer">Add Menu Item</Button>
          </Link>
        </div>
      ) : (
        <div className="w-full flex flex-wrap gap-4 justify-center">
          {data.map((item: IItem) => (
            <MenuItemCard key={item._id} item={item} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuItemsQueryMapper;
