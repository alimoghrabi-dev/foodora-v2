"use client";

import React, { useEffect, useRef, useState } from "react";
import MenuSearchbarInPage from "../search_bars/MenuSearchbarInPage";
import { useQuery } from "@tanstack/react-query";
import { getClientRestaurantCategories } from "@/_market/lib/client-actions";
import CategoryMenuCard from "../cards/CategoryMenuCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import RestaurantPageMenuItems from "./RestaurantPageMenuItems";

const RestaurantPageMenu: React.FC<{
  restaurantId: string;
  user: IUser | null;
}> = ({ restaurantId, user }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [activatedCategory, setActivatedCategory] = useState<{
    _id: string;
    name: string;
  } | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(false);

  const {
    data: categories,
    isPending,
    isRefetching,
    isError,
  } = useQuery({
    queryKey: ["RESTAURANT_CATEGORIES", restaurantId],
    queryFn: () => getClientRestaurantCategories(restaurantId),
    refetchOnWindowFocus: false,
  });

  const updateScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft + container.clientWidth < container.scrollWidth
    );
  };

  useEffect(() => {
    updateScrollButtons();
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      container.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [categories]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollAmount = 200;

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (isError) {
    return (
      <div className="w-full text-center text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-20">
        ⚠️ Oops! Something went wrong while loading the menu.
        <br />
        Please try refreshing the page or check your connection.
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-y-8">
      <div
        className="w-full flex flex-col sm:flex-row items-center justify-between gap-x-8 gap-y-4 px-4 pt-2 border-b border-neutral-200"
        style={{
          boxShadow: "0 8px 20px rgb(0 0 0 / 0.035)",
        }}
      >
        <MenuSearchbarInPage />
        {isPending || isRefetching ? (
          <div className="w-[25rem] sm:w-[20rem] md:w-[30rem] lg:w-[40rem] xl:w-[52.5rem] 2xl:w-[60rem] 3xl:w-[78.5rem]">
            <div className="flex gap-x-2.5 overflow-hidden py-1">
              {Array.from({ length: 8 }).map((_, outerIdx) => (
                <Skeleton
                  key={outerIdx}
                  className="w-[130px] h-[50px] shrink-0"
                >
                  <span className="text-transparent select-none block w-full">
                    {"Loading Category ".repeat(2)}
                  </span>
                </Skeleton>
              ))}
            </div>
          </div>
        ) : (
          <div className="relative w-[25rem] sm:w-[20rem] md:w-[30rem] lg:w-[40rem] xl:w-[52.5rem] 2xl:w-[60rem] 3xl:w-[78.5rem]">
            {canScrollLeft && (
              <button
                type="button"
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-30 border border-neutral-300 backdrop-blur-2xl cursor-pointer hover:scale-105 p-[5px] bg-white rounded-full shadow-md hover:bg-neutral-100/85 transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-neutral-800" />
              </button>
            )}

            {canScrollRight && (
              <button
                type="button"
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-30 border border-neutral-300 backdrop-blur-2xl cursor-pointer hover:scale-105 p-[5px] bg-white rounded-full shadow-md hover:bg-neutral-100/85 transition-all"
              >
                <ChevronRight className="w-5 h-5 text-neutral-800" />
              </button>
            )}

            <div
              ref={scrollContainerRef}
              className="flex gap-x-0.5 overflow-x-hidden scroll-smooth px-12 pt-2"
            >
              {categories.map(
                (category: {
                  _id: string;
                  name: string;
                  itemCount: number;
                }) => (
                  <CategoryMenuCard
                    key={category._id}
                    category={category}
                    activatedCategory={activatedCategory}
                    setActivatedCategory={setActivatedCategory}
                  />
                )
              )}
            </div>
          </div>
        )}
      </div>
      <RestaurantPageMenuItems
        restaurantId={restaurantId}
        activatedCategory={activatedCategory}
        user={user}
      />
    </div>
  );
};

export default RestaurantPageMenu;
