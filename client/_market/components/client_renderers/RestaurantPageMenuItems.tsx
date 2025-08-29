"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getClientRestaurantMenuItems } from "@/_market/lib/client-actions";
import RestaurantPageMenuItemCard from "../cards/RestaurantPageMenuItemCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Ghost } from "lucide-react";

const RestaurantPageMenuItems: React.FC<{
  restaurantId: string;
  activatedCategory: {
    _id: string;
    name: string;
  } | null;
}> = ({ restaurantId, activatedCategory }) => {
  const {
    data: items,
    isPending,
    isRefetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["RESTAURANT_MENU_ITEMS", restaurantId, activatedCategory?._id],
    queryFn: () =>
      getClientRestaurantMenuItems(restaurantId, activatedCategory?._id),
    refetchOnWindowFocus: false,
  });

  if (isPending || isRefetching) {
    return (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="w-full rounded-xl p-4 border border-neutral-200 flex flex-col gap-4"
          >
            <div className="flex justify-between gap-x-6">
              <div className="flex flex-col gap-y-1.5">
                <Skeleton className="w-36 h-4 rounded-full" />

                <Skeleton className="w-12 h-4 rounded-full" />
                <Skeleton className="w-full mt-2 h-4 rounded-full" />
                <Skeleton className="w-20 h-4 rounded-full" />
              </div>
              <Skeleton className="w-[165px] h-[150px] rounded-lg flex-shrink-0" />
            </div>
            <div className="flex gap-x-6 justify-between">
              <Skeleton className="w-44 h-4 rounded-full" />
              <Skeleton className="size-8 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-16 text-center gap-y-4">
        <Ghost size={58} className="text-neutral-700" />
        <h2 className="text-lg md:text-xl font-semibold text-neutral-700">
          No items found
        </h2>
        <p className="text-sm text-neutral-500 max-w-md">
          There are no menu items listed under this category yet. Please check
          another category or come back later.
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-[300px] flex flex-col items-center justify-center text-center px-4">
        <div className="text-5xl mb-4">😵</div>
        <h2 className="text-lg font-semibold text-neutral-800 mb-2">
          Oops! Something went wrong.
        </h2>
        <p className="text-sm text-neutral-600 mb-6 max-w-md">
          {` We couldn't load the menu items right now. This might be due to a network issue or server problem.`}
        </p>
        <button
          type="button"
          onClick={() => {
            refetch();
          }}
          className="px-4 py-2 bg-neutral-800 text-white rounded-md hover:bg-neutral-700 transition cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="w-full flex flex-col gap-y-8">
      {activatedCategory && (
        <h4 className="text-xl md:text-2xl font-semibold text-neutral-800 capitalize px-2">
          {activatedCategory.name}
        </h4>
      )}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((item: IMenuItem) => (
          <RestaurantPageMenuItemCard key={item._id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default RestaurantPageMenuItems;
