import CuisinesSectionScroller from "@/_market/components/scrollers/CuisinesSectionScroller";
import TrendingRestaurantsSectionScroller from "@/_market/components/scrollers/TrendingRestaurantsSectionScroller";
import GlobalSearchBar from "@/_market/components/search_bars/GlobalSearchBar";
import FilteredRestaurantRenderer from "@/_market/components/server_renderers/FilteredRestaurantRenderer";
import { Fragment } from "react";

interface MarketPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MarketPage({ searchParams }: MarketPageProps) {
  const resolvedSearchParams = await searchParams;

  const sort = resolvedSearchParams.sort || null;
  const quickFilter = resolvedSearchParams.quick_filter || null;
  const cuisine = resolvedSearchParams.cuisine || null;
  const price = resolvedSearchParams.price || null;

  const hasSearch = !!(sort || quickFilter || cuisine || price);

  return (
    <div className="flex-1 flex flex-col gap-y-8 p-2">
      <GlobalSearchBar />
      {hasSearch ? (
        <FilteredRestaurantRenderer
          sort={sort}
          quickFilter={quickFilter}
          cuisine={cuisine}
          price={price}
        />
      ) : (
        <Fragment>
          <div className="w-full flex flex-col gap-y-4">
            <CuisinesSectionScroller />
          </div>
          <div className="w-full flex flex-col gap-y-4">
            <TrendingRestaurantsSectionScroller />
          </div>
        </Fragment>
      )}
    </div>
  );
}
