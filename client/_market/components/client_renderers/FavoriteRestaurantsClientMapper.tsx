"use client";

import { getClientFavoriteRestaurants } from "@/_market/lib/client-actions";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import FavoritePageError from "./FavoritePageError";
import RestaurantCard from "../shared/RestaurantCard";
import Image from "next/image";
import Link from "next/link";

const FavoriteRestaurantsClientMapper: React.FC<{
  initialData: IRestaurant[];
  user: IUser | null;
}> = ({ initialData, user }) => {
  const {
    data: favorites,
    isPending,
    isRefetching,
    isError,
  } = useQuery({
    queryKey: ["FAVORITE_RESTAURANTS"],
    queryFn: getClientFavoriteRestaurants,
    initialData,
    refetchOnWindowFocus: false,
    enabled: false,
  });

  if (isPending || isRefetching) {
    return <div></div>;
  }

  if (favorites.length === 0 || !favorites) {
    return (
      <div className="w-full min-h-[65vh] flex flex-col items-center justify-center">
        <div className="size-36 md:size-40 relative">
          <Image
            src="/icons/no-favorites-fo.svg"
            alt="no-favs"
            className="object-contain"
            fill
          />
        </div>
        <span className="text-neutral-900 font-bold text-lg md:text-xl">
          No Favourites Saved
        </span>
        <p className="text-sm md:text-base font-normal text-neutral-800 mt-1.5">
          You’ll see all your favorites here, to make ordering even faster.
        </p>
        <Link
          href="/market"
          className="px-4 md:px-5 py-2 md:py-3 border border-neutral-600 text-[15px] md:text-base font-medium rounded-md mt-4 text-neutral-800 hover:bg-neutral-100 transition-all"
        >
          {`Let's find some favourites`}
        </Link>
      </div>
    );
  }

  if (isError) {
    return <FavoritePageError />;
  }

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {favorites.map((restaurant: IRestaurant) => (
        <RestaurantCard
          key={restaurant._id}
          restaurant={restaurant}
          user={user}
        />
      ))}
    </div>
  );
};

export default FavoriteRestaurantsClientMapper;
