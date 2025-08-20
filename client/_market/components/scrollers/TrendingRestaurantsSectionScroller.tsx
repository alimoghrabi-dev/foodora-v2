import React from "react";
import QueryWrapper from "@/components/providers/query-wrapper";
import TrendingRestaurantsSectionScrollerClient from "./TrendingRestaurantsSectionScrollerClient";

const TrendingRestaurantsSectionScroller = () => {
  return (
    <QueryWrapper>
      <TrendingRestaurantsSectionScrollerClient />
    </QueryWrapper>
  );
};

export default TrendingRestaurantsSectionScroller;
