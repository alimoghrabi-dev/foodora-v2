"use client";

import React from "react";
import { getClientUserCarts } from "@/_market/lib/client-actions";
import { useQuery } from "@tanstack/react-query";
import CartsPageError from "./CartsPageError";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart } from "lucide-react";
import CartCard from "../cards/CartCard";
import Link from "next/link";

const CartsPageClientMapper: React.FC<{
  initialData: {
    _id: string;
    restaurantId: string;
    totalPrice: number;
    itemsCount: number;
    createdAt: Date;
  }[];
}> = ({ initialData }) => {
  const {
    data: carts,
    isPending,
    isRefetching,
    isError,
  } = useQuery({
    queryKey: ["MY_CARTS"],
    queryFn: getClientUserCarts,
    initialData,
    refetchOnWindowFocus: false,
    enabled: false,
  });

  if (isPending || isRefetching) {
    return (
      <div className="flex flex-col gap-6">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 border rounded-xl p-4 shadow"
            >
              <Skeleton className="h-16 w-16 rounded-lg" />

              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-5 w-40 rounded-md" />
                <Skeleton className="h-4 w-24 rounded-md" />
              </div>

              <Skeleton className="h-6 w-12 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!carts || carts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-5">
        <div className="p-5 sm:p-6 bg-muted rounded-full shadow-sm">
          <ShoppingCart className="size-11 sm:size-12 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <h2 className="text-lg sm:text-xl font-semibold">
            Your cart is empty
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            Looks like you haven’t added anything yet. Start exploring and add
            your favorite meals!
          </p>
        </div>

        <Link
          href="/market"
          className="bg-primary text-sm font-semibold rounded-md px-4 py-2 text-white hover:opacity-85 transition"
        >
          Browse Restaurants
        </Link>
      </div>
    );
  }

  if (isError) {
    return <CartsPageError />;
  }

  return (
    <section className="w-full flex flex-col gap-4">
      <h1 className="font-black text-[32px] sm:text-[36px] md:text-[38px] lg:text-[40px] text-neutral-900">
        My Carts
      </h1>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 p-0.5">
        {carts.map(
          (
            cart: {
              _id: string;
              restaurantId: IRestaurant;
              totalPrice: number;
              itemsCount: number;
              isAutoClosed: boolean;
              createdAt: Date;
            },
            index: number
          ) => (
            <CartCard key={cart._id} cart={cart} index={index} />
          )
        )}
      </div>
    </section>
  );
};

export default CartsPageClientMapper;
