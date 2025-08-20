"use client";

import React from "react";
import { formatPriceWithAbbreviation } from "@/lib/utils";
import ImageRender from "@/components/shared/ImageRender";
import Image from "next/image";
import AddToCartDialog from "../event_handlers/AddToCartDialog";

const RestaurantPageMenuItemCard: React.FC<{
  item: IMenuItem;
  user: IUser | null;
}> = ({ item, user }) => {
  return (
    <div className="w-full p-4 border border-neutral-300 bg-neutral-50 rounded-xl flex flex-col gap-y-6 group overflow-hidden cursor-pointer hover:bg-primary/5 transition-all">
      <div className="flex justify-between gap-x-6">
        <div className="flex flex-col gap-y-1.5">
          <h2 className="text-base font-medium text-neutral-900 capitalize">
            {item.title}
          </h2>
          <p className="text-primary font-semibold text-[17px]">
            {formatPriceWithAbbreviation(item.price)}
          </p>
          <p className="mt-1 text-neutral-600 font-normal text-sm max-w-[150px] lg:max-w-[250px] xl:max-w-[150px] 2xl:max-w-[275px] break-words line-clamp-3">
            {item.description}
          </p>
        </div>
        {item.imageUrl ? (
          <div className="w-[165px] h-[150px] relative flex-shrink-0 overflow-hidden rounded-lg">
            <ImageRender
              src={item.imageUrl}
              alt={item.title}
              fill
              className="rounded-lg shadow-md group-hover:scale-110 transition-all"
            />
          </div>
        ) : (
          <div className="w-[165px] h-[150px] flex items-center justify-center rounded-lg shadow-md bg-gradient-to-br from-neutral-100 via-neutral-200 to-neutral-300 group-hover:from-neutral-200 group-hover:via-neutral-300 group-hover:to-neutral-400 transition-colors duration-500">
            <Image
              src="/icons/secondary-logo.png"
              alt="logo"
              className="object-cover"
              width={76}
              height={76}
            />
          </div>
        )}
      </div>
      <div className="flex gap-x-6 justify-between">
        <p className="mt-0.5 text-neutral-700 font-normal text-sm">
          <strong>Ingredients:</strong> {item.ingredients.join(", ")}
        </p>
        <AddToCartDialog item={item} user={user} />
      </div>
    </div>
  );
};

export default RestaurantPageMenuItemCard;
