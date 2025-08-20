import PublishRestaurantForm from "@/components/forms/PublishRestaurantForm";
import QueryWrapper from "@/components/providers/query-wrapper";
import { getRestaurantSession } from "@/lib/get-user";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Foodora Admin | Publish Your Restaurant",
};

export default async function PublishPage() {
  const restaurant = await getRestaurantSession();

  if (!restaurant || restaurant.isPublished) {
    redirect("/login");
  }

  return (
    <div className="w-full flex flex-col gap-y-8">
      <h2 className="text-xl sm:text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
        Publish Your Restaurant
      </h2>
      <QueryWrapper>
        <PublishRestaurantForm
          name={restaurant.name}
          description={restaurant.description}
          cuisine={restaurant.cuisine}
          isEmailVerified={restaurant.isEmailVerified}
        />
      </QueryWrapper>
    </div>
  );
}
