"use client";

import { getClientNotOnSaleItems } from "@/lib/actions/client.actions";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import NotOnSaleItemCard from "../cards/NotOnSaleItemCard";

const HandleDisplayOfNotOnSaleItems: React.FC = () => {
  const {
    data: items,
    isPending,
    isRefetching,
    isError,
  } = useQuery({
    queryKey: ["NOT_ONSALE_ITEMS"],
    queryFn: getClientNotOnSaleItems,
    refetchOnWindowFocus: false,
  });

  if (isPending || isRefetching) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 animate-fade-in">
          <div className="w-12 h-12 rounded-full border-4 border-t-transparent border-red-500 animate-spin" />
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Fetching items, hang tight...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="text-4xl">⚠️</span>
          <p className="text-lg font-semibold text-red-600 dark:text-red-400">
            Failed to load items
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Something went wrong. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  if (!isPending && !isRefetching && items.length === 0) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="text-4xl">🛒</span>
          <p className="text-lg font-semibold text-neutral-700 dark:text-neutral-100">
            No items found
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="w-full max-h-[60vh] flex flex-col gap-y-4">
      {items.map((item: IItem) => (
        <NotOnSaleItemCard key={item._id} item={item} />
      ))}
    </ScrollArea>
  );
};

export default HandleDisplayOfNotOnSaleItems;
