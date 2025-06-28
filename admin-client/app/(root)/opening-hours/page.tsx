import OpeningHoursForm from "@/components/forms/OpeningHoursForm";
import QueryWrapper from "@/components/providers/query-wrapper";
import { getRestaurantSession } from "@/lib/get-user";
import { redirect } from "next/navigation";

export default async function OpeningHoursPage() {
  const restaurant = await getRestaurantSession();

  if (!restaurant?.isPublished) {
    redirect("/");
  }

  return (
    <div className="w-full flex flex-col gap-y-8">
      <h2 className="text-xl sm:text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
        Opening Hours Updater
      </h2>
      <QueryWrapper>
        <OpeningHoursForm openingHours={restaurant.openingHours} />
      </QueryWrapper>
    </div>
  );
}
