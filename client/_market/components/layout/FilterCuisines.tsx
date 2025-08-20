"use client";

import React, { useState } from "react";
import CuisinesSearchBar from "../search_bars/CuisinesSearchBar";
import { useQuery } from "@tanstack/react-query";
import { getClientAllCuisines } from "@/_market/lib/client-actions";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter, useSearchParams } from "next/navigation";

const MAX_VISIBLE = 9;

const FilterCuisines: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showAll, setShowAll] = useState<boolean>(false);

  const query = searchParams.get("cuisine-query");

  const { data, isPending, isRefetching, isError } = useQuery({
    queryKey: ["CUISINES_FILTER", query],
    queryFn: () => getClientAllCuisines(query),
    refetchOnWindowFocus: false,
  });

  const handleClick = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`/market?${params.toString()}`);
  };

  if (isPending || isRefetching) {
    return (
      <div className="w-full flex flex-col gap-y-3">
        <Skeleton className="rounded-md w-24 h-5" />
        <Skeleton className="w-full rounded-full h-8" />
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="w-36 h-6 rounded-md" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full py-4 text-sm font-medium text-center text-red-500">
        Something went wrong while loading cuisines.
      </div>
    );
  }

  const cuisines = data || [];
  const visibleCuisines = showAll ? cuisines : cuisines.slice(0, MAX_VISIBLE);

  return (
    <div className="w-full flex flex-col gap-y-3">
      <span className="text-[15px] font-medium text-neutral-700">Cuisines</span>
      <CuisinesSearchBar />

      {visibleCuisines.map((cuisine: string) => {
        const isActive = searchParams.get("cuisine") === cuisine;

        return (
          <div
            key={cuisine}
            onClick={() => handleClick("cuisine", cuisine)}
            className="w-fit flex items-center gap-x-2 group"
          >
            <Checkbox
              checked={isActive}
              className="cursor-pointer size-[20px] group-hover:border-neutral-400 transition"
            />
            <span className="text-base capitalize font-medium text-neutral-800 cursor-pointer group-hover:text-neutral-600 transition">
              {cuisine}
            </span>
          </div>
        );
      })}

      {cuisines.length === 0 ? (
        <div className="w-full py-4 text-sm font-medium text-center text-neutral-600">
          No cuisines found
        </div>
      ) : (
        cuisines.length > MAX_VISIBLE && (
          <button
            type="button"
            className="w-fit flex items-start gap-x-1.5 cursor-pointer hover:text-neutral-950 transition rounded-sm text-sm font-medium text-gray-700"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? "Show Less" : "Show More"}
            {showAll ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        )
      )}
    </div>
  );
};

export default FilterCuisines;
