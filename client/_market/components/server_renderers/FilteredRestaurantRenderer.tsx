import React from "react";
import ClientFilteredRestaurantRenderer from "../client_renderers/ClientFilteredRestaurantRenderer";
import QueryWrapper from "@/components/providers/query-wrapper";
import { getFilteredRestaurants } from "@/_market/lib/server-actions";
import { AlertTriangle } from "lucide-react";
import { getUserSession } from "@/lib/get-user";

const FilteredRestaurantRenderer: React.FC<{
  sort: string | string[] | null;
  quickFilter: string | string[] | null;
  cuisine: string | string[] | null;
  price: string | string[] | null;
}> = async ({ sort, quickFilter, cuisine, price }) => {
  const user = await getUserSession();

  const result = await getFilteredRestaurants(
    sort,
    quickFilter,
    cuisine,
    price
  );

  if (result?.error) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-6 sm:p-10 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-900">
        <AlertTriangle className="w-10 h-10 text-red-500 mb-4" />
        <h2 className="text-base sm:text-xl font-semibold text-red-700 dark:text-red-300">
          Something went wrong
        </h2>
        <p className="text-[13px] sm:text-base text-red-600 dark:text-red-400 mt-2 max-w-md">
          {`We couldn't load the filtered restaurants. Please try again later or
          adjust your filters.`}
        </p>
      </div>
    );
  }

  return (
    <QueryWrapper>
      <ClientFilteredRestaurantRenderer
        initialData={result?.restaurants}
        sort={sort}
        quickFilter={quickFilter}
        cuisine={cuisine}
        price={price}
        user={user}
      />
    </QueryWrapper>
  );
};

export default FilteredRestaurantRenderer;
