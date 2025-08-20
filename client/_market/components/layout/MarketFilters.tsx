import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import FilterSortBy from "./FilterSortBy";
import FilterCuisines from "./FilterCuisines";
import QueryWrapper from "@/components/providers/query-wrapper";
import FilterPrice from "./FilterPrice";
import QuickFilter from "./QuickFilter";
import ClearAllButton from "./ClearAllButton";

const MarketFilters: React.FC = () => {
  return (
    <div className="w-80 hidden lg:flex h-[calc(100vh-172px)] border border-neutral-300 rounded-2xl overflow-hidden mt-2">
      <ScrollArea className="w-full h-full px-5">
        <div className="w-full flex flex-col gap-y-5 py-4">
          <div className="w-full flex items-center justify-between gap-x-3">
            <h4 className="text-lg font-bold text-neutral-900">Filter</h4>
            <ClearAllButton />
          </div>
          <FilterSortBy />
          <QuickFilter />
          <QueryWrapper>
            <FilterCuisines />
          </QueryWrapper>
          <FilterPrice />
        </div>
      </ScrollArea>
    </div>
  );
};

export default MarketFilters;
