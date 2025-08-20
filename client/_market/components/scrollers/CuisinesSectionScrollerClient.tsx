"use client";

import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { getClientAllCuisines } from "@/_market/lib/client-actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

const CuisinesSectionScrollerClient: React.FC<{
  initialData: string[];
}> = ({ initialData }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isLeftDisabled, setIsLeftDisabled] = useState(true);
  const [isRightDisabled, setIsRightDisabled] = useState(false);

  const { data, isPending, isRefetching, isError } = useQuery({
    queryKey: ["CUISINES"],
    queryFn: () => getClientAllCuisines(),
    initialData,
    refetchOnWindowFocus: false,
    enabled: false,
  });

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -125 : 125;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (el) {
      setIsLeftDisabled(el.scrollLeft <= 0);
      setIsRightDisabled(el.scrollLeft + el.clientWidth >= el.scrollWidth - 5);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollButtons();

    const handleScroll = () => updateScrollButtons();

    el.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, []);

  if (isError) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-2 py-10 bg-red-50 border border-red-200 rounded-xl text-center">
        <AlertTriangle className="h-8 w-8 text-red-500" />
        <h3 className="text-lg font-semibold text-red-700">
          Failed to load cuisines
        </h3>
        <p className="text-sm text-red-500">
          Something went wrong while fetching the list of cuisines.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1500px]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-2xl font-medium text-neutral-900">Cuisines</h3>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => scroll("left")}
            className="rounded-full"
            disabled={isLeftDisabled || isPending || isRefetching}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll("right")}
            className="rounded-full"
            disabled={isRightDisabled || isPending || isRefetching}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
      {isPending || isRefetching ? (
        <div className="flex items-center gap-2.5 p-1">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="w-28 h-10 rounded-full" />
          ))}
        </div>
      ) : (
        <div ref={scrollRef} className="w-full overflow-x-hidden scroll-smooth">
          <div className="flex gap-2.5 w-max p-1">
            {data?.map((cuisine: string, index: number) => (
              <Link
                key={index}
                href={`/market/cuisine/${cuisine}`}
                className="text-base font-medium border border-primary/30 bg-white rounded-full px-5 py-1.5 capitalize hover:bg-primary/5 backdrop-blur-md hover:scale-105 text-primary transition-all"
              >
                {cuisine}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CuisinesSectionScrollerClient;
