"use client";

import React, { Fragment, useMemo } from "react";
import AddToFavoritesButton from "../event_handlers/AddToFavoritesButton";
import ImageRender from "@/components/shared/ImageRender";
import { BadgePercent, Clock4, Dot, Sparkles, Star } from "lucide-react";
import { cn, formatNumber, formatPriceWithAbbreviation } from "@/lib/utils";
import Link from "next/link";

const RestaurantCard: React.FC<{
  restaurant: IRestaurant;
  user: IUser | null;
}> = ({ restaurant, user }) => {
  const isClosed = restaurant.isAutoClosed || restaurant.isClosed;

  const favBtnState = useMemo(() => {
    const userFavorites = user?.favorites || [];

    return userFavorites.includes(restaurant._id) ? "remove" : "default";
  }, [user?.favorites, restaurant._id]);

  return (
    <Link
      href={`/market/restaurant/${restaurant._id}`}
      className={cn(
        "relative select-none w-full flex flex-col rounded-lg border border-neutral-300/75 cursor-pointer group overflow-hidden",
        {
          "opacity-80": isClosed,
        }
      )}
    >
      {restaurant.onSale && restaurant.saleAmount && (
        <div className="absolute top-2 left-2 bg-primary px-2 py-1 rounded-md flex items-center gap-x-1 z-30">
          <BadgePercent size={17} className="text-primary fill-white" />
          <p className="text-[13px] font-medium text-white">
            {restaurant.saleType === "percentage"
              ? `${restaurant.saleAmount}% OFF`
              : `Enjoy Up to ${formatPriceWithAbbreviation(
                  restaurant.saleAmount
                )} OFF`}
          </p>
        </div>
      )}

      {isClosed && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/15">
          <div className="flex flex-col items-center gap-1 animate-fade-in">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white opacity-90"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 17a1 1 0 100-2 1 1 0 000 2zm6-6V9a6 6 0 10-12 0v2a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2zM8 9a4 4 0 118 0v2H8V9z"
              />
            </svg>
            <p className="text-white text-[20px] font-semibold tracking-wide uppercase shadow-sm">
              Closed
            </p>
            <p className="text-neutral-200 text-[13px] font-light">
              Opens soon. Stay tuned!
            </p>
          </div>
        </div>
      )}
      <AddToFavoritesButton
        restaurantId={restaurant._id}
        favBtnState={favBtnState}
      />
      <div className="w-full h-[250px] relative rounded-t-lg overflow-hidden">
        <ImageRender
          src={restaurant.coverImage}
          alt={restaurant.name}
          className={cn(
            "rounded-t-lg object-cover group-hover:scale-105 transition-transform duration-300",
            {
              grayscale: isClosed,
            }
          )}
          fill
        />
      </div>
      <div className="w-full flex flex-col gap-y-0.5 px-3 py-2.5 bg-white">
        <div className="w-full flex items-center justify-between gap-x-2">
          <span
            title={restaurant.name}
            className="text-neutral-900 capitalize font-medium text-lg truncate"
          >
            {restaurant.name}
          </span>
          <div className="flex items-center gap-x-1.5">
            <Star size={14} className="text-primary fill-primary" />
            <span className="flex items-center gap-x-0.5 text-[15px]">
              <p className="font-medium text-neutral-800">
                {restaurant.rating || "0.0"}
              </p>
              <p className="text-neutral-700 font-normal">
                ({formatNumber(restaurant.ratingCount) || "0"})
              </p>
            </span>
          </div>
        </div>
        <div className="w-full flex items-center justify-start">
          <span className="text-[13px] font-normal text-neutral-700 capitalize flex items-center">
            {restaurant.pricingDescription} <Dot size={16} />{" "}
            {restaurant.cuisine}
          </span>
        </div>
        <div className="w-full flex items-center justify-start">
          <div className="flex items-center">
            <span className="flex items-center gap-x-1">
              <Clock4 size={14} className="text-neutral-700" />
              <p className="text-[13px] text-neutral-700 font-medium">
                {`${restaurant.deliveryTimeRange[0]}-${restaurant.deliveryTimeRange[1]} min`}
              </p>
            </span>
            {restaurant.freeDeliveryFirstOrder && (
              <Fragment>
                <Dot size={16} />
                <Sparkles size={14} className="text-primary mr-1" />
                <p className="text-primary font-semibold text-[13px] truncate">
                  Free delivery for first order
                </p>
              </Fragment>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
