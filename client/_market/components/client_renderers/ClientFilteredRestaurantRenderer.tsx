"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Info, Loader2 } from "lucide-react";
import { getClientFilteredRestaurants } from "@/_market/lib/client-actions";
import { formatNumber } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import RestaurantCard from "../shared/RestaurantCard";

const ClientFilteredRestaurantRenderer: React.FC<{
  initialData: string[];
  sort: string | string[] | null;
  quickFilter: string | string[] | null;
  cuisine: string | string[] | null;
  price: string | string[] | null;
  user: IUser | null;
}> = ({ initialData, sort, quickFilter, cuisine, price, user }) => {
  const [open, setOpen] = useState<boolean>(false);

  const { data, isPending, isRefetching, isError } = useQuery({
    queryKey: ["FILTERED_RESTAURANTS", sort, quickFilter, cuisine, price],
    queryFn: () =>
      getClientFilteredRestaurants(sort, quickFilter, cuisine, price),
    initialData,
    refetchOnWindowFocus: false,
    enabled: false,
  });

  if (isPending || isRefetching) {
    return (
      <div className="flex flex-col items-center justify-center h-80 w-full animate-pulse space-y-4">
        <Loader2 className="size-[70px] text-primary animate-spin" />
        <p className="text-neutral-500 font-medium text-sm">
          Fetching delicious restaurants...
        </p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-center space-y-4">
        <svg
          className="w-16 h-16 text-neutral-500 stroke-1"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <h2 className="text-lg font-semibold">No Restaurants found</h2>
        <p className="text-neutral-500 font-medium text-sm">
          Try adjusting your filters or searching something else.
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-6 sm:p-10 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-900">
        <AlertTriangle className="w-10 h-10 text-red-500 mb-4" />
        <h2 className="text-base sm:text-xl font-semibold text-red-700 dark:text-red-300">
          Something went wrong
        </h2>
        <p className="text-[13px] sm:text-base text-red-600 dark:text-red-400 mt-2 max-w-md">
          {`We couldn't load the filtered restaurants. Please try again later or
          adjust your filters.`}
        </p>
      </div>
    );
  }

  return (
    <section className="w-full flex flex-col gap-y-4">
      <div className="w-full flex items-center justify-start gap-x-2.5">
        <h2 className="text-2xl font-medium text-neutral-900">
          {formatNumber(data.length)}{" "}
          {data.length === 1 ? "Restaurant" : "Restaurants"} found
        </h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Info
              size={22}
              className="text-neutral-600 hover:text-neutral-800 transition cursor-pointer"
            />
          </DialogTrigger>
          <DialogContent
            aria-describedby={undefined}
            className="p-6 rounded-xl"
          >
            <DialogHeader>
              <DialogTitle className="text-xl">
                How we rank information
              </DialogTitle>
            </DialogHeader>
            <div className="w-full flex flex-col gap-y-4">
              <p className="text-neutral-800 text-sm font-normal">
                Below, you will see a selection tailored to you, based on your
                delivery address, your distance to a restaurant or shop, and its
                popularity, as indicated by click and order history from other
                foodora users. We also sort options basedon your previous orders
                and app usage history to optimize your experience. Where
                available you will see different options to change sorting.
              </p>
              <span className="text-neutral-800 text-sm font-normal">
                We form partnerships with partner restaurants and shops to
                promote them on foodora. What you see may thus include paid
                placements, which are always clearly marked as such.
              </span>
              <p className="text-neutral-800 text-sm font-normal">
                You will see paid placements based on your
              </p>
              <ol className="pl-6 list-disc flex flex-col gap-y-2.5">
                <li className="text-neutral-800 text-sm font-normal">
                  Chosen delivery address
                </li>
                <li className="text-neutral-800 text-sm font-normal">
                  Previous orders on foodora
                </li>
                <li className="text-neutral-800 text-sm font-normal">
                  Interactions with the foodora platform (like your previous
                  searches and menu viewings)
                </li>
              </ol>
              <p className="text-neutral-800 text-sm font-normal">
                We may also show you curated lists of restaurants and shops,
                which may be filtered based on cuisine or assortment type, your
                order history, selected delivery address, promotional offers,
                user ratings, and similar criteria. Curated lists are named to
                suggest the filtering applied to them. If a curated list
                contains paid placements, these will also be clearly marked.
              </p>
            </div>
            <DialogFooter className="w-full flex items-center justify-end">
              <Button
                type="button"
                onClick={() => setOpen(false)}
                className="bg-primary py-6 px-5 text-base font-medium"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {data.map((restaurant: IRestaurant) => (
          <RestaurantCard
            key={restaurant._id}
            restaurant={restaurant}
            user={user}
          />
        ))}
      </div>
    </section>
  );
};

export default ClientFilteredRestaurantRenderer;
