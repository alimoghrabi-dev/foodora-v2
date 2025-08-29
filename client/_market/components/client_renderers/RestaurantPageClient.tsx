"use client";

import React, { Fragment, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getClientRestaurantById } from "@/_market/lib/client-actions";
import {
  AlertTriangle,
  Clock4,
  Dot,
  Info,
  Loader2,
  Sparkles,
  Star,
} from "lucide-react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ImageRender from "@/components/shared/ImageRender";
import { formatNumber } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AddToFavoritesButtonInPage from "../event_handlers/AddToFavoritesButtonInPage";
import RestaurantPageMenu from "./RestaurantPageMenu";

const RestaurantPageClient: React.FC<{
  initialData: IRestaurant;
  user: IUser | null;
}> = ({ initialData, user }) => {
  const params = useParams();

  const {
    data: restaurant,
    isPending,
    isRefetching,
    isError,
  } = useQuery<IRestaurant>({
    queryKey: ["RESTAURANT", params?._id as string],
    queryFn: () => getClientRestaurantById(params?._id as string),
    initialData,
    refetchOnWindowFocus: false,
    enabled: false,
  });

  const favBtnState = useMemo(() => {
    const userFavorites = user?.favorites || [];

    return userFavorites.includes(restaurant._id) ? "remove" : "default";
  }, [user?.favorites, restaurant._id]);

  useEffect(() => {
    document.title = `Foodora | ${restaurant.name}`;
  }, [restaurant.name]);

  if (isPending || isRefetching) {
    return (
      <div className="min-h-[60vh] w-full flex flex-col items-center justify-center text-center px-4">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Loading restaurant...
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-md">
            Hang tight! We’re fetching the best dishes and details for you.
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[60vh] w-full flex flex-col items-center justify-center text-center px-4">
        <div className="flex flex-col items-center gap-4">
          <AlertTriangle size={48} className="text-red-500 animate-pulse" />
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
            Oops! Something went wrong.
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-md">
            {`We couldn't load the restaurant details right now. It might not
            exist or there was a server issue.`}
          </p>
          <Link
            href="/market"
            className="mt-4 inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition"
          >
            Back to Market
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full max-h-[calc(100vh-152px)]">
      <div className="w-full flex flex-col gap-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/market"
                className="relative text-neutral-600 font-medium text-sm after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:scale-x-0 after:origin-left after:bg-neutral-800 after:transition-transform after:duration-300 hover:after:scale-x-100"
              >
                Restaurant List
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm font-semibold text-neutral-900 capitalize">
                {restaurant.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="w-full flex items-end justify-between gap-x-8">
          <div className="flex items-center gap-x-6">
            <div className="relative size-48">
              {restaurant.logo ? (
                <ImageRender
                  src={restaurant.logo}
                  alt="logo-res"
                  className="object-cover rounded-xl shadow"
                  fill
                />
              ) : (
                <div className="w-full h-full bg-neutral-200/70 shadow rounded-xl flex items-center justify-center uppercase text-neutral-800 font-bold text-5xl">
                  {restaurant.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="h-[172px] flex flex-col justify-between gap-4">
              <span className="text-neutral-600 font-normal text-[15px] flex items-center">
                <Dot size={14} />
                {restaurant.cuisine}
              </span>
              <div className="flex flex-col">
                <h3 className="tracking-tight text-[26px] font-black text-neutral-900">
                  {restaurant.name}
                </h3>
                <div className="flex items-center gap-x-0.5">
                  {restaurant.freeDeliveryFirstOrder && (
                    <Fragment>
                      <Sparkles size={14} className="text-primary mr-1" />
                      <p className="text-primary font-semibold text-[13px] truncate">
                        Free delivery for first order
                      </p>
                      <Dot size={14} />
                    </Fragment>
                  )}
                  <span className="flex items-center gap-x-1">
                    <Clock4 size={14} className="text-neutral-700" />
                    <p className="text-[13px] text-neutral-700 font-medium">
                      {`${restaurant.deliveryTimeRange[0]}-${restaurant.deliveryTimeRange[1]} min`}
                    </p>
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-x-5">
                <div className="flex items-center gap-x-1.5">
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        type="button"
                        className="text-neutral-900 px-2 py-1.5 rounded-md text-sm font-medium mt-0.5 cursor-pointer hover:bg-neutral-200/40 transition-all duration-200 ease-in-out"
                      >
                        See reviews
                      </button>
                    </DialogTrigger>
                    <DialogContent aria-describedby={undefined}></DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        type="button"
                        className="teext-neutral-900 px-2 py-1.5 flex items-center gap-x-1.5 rounded-md text-sm font-medium mt-0.5 cursor-pointer hover:bg-neutral-200/40 transition-all duration-200 ease-in-out"
                      >
                        <Info size={18} className="mb-0.5" />
                        More info
                      </button>
                    </DialogTrigger>
                    <DialogContent aria-describedby={undefined}></DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
          <AddToFavoritesButtonInPage
            restaurantId={restaurant._id}
            favBtnState={favBtnState}
          />
        </div>
        <RestaurantPageMenu restaurantId={restaurant._id} />
      </div>
    </section>
  );
};

export default RestaurantPageClient;
