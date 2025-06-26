import PublishRestaurantForm from "@/components/forms/PublishRestaurantForm";
import { getRestaurantSession } from "@/lib/get-user";
import { redirect } from "next/navigation";

export default async function PublishPage() {
  const restaurant = await getRestaurantSession();

  if (!restaurant) {
    redirect("/login");
  }

  return (
    <div className="w-full flex flex-col gap-y-8">
      <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
        Publish Your Restaurant
      </h2>
      <PublishRestaurantForm
        name={restaurant.name}
        description={restaurant.description}
        cuisine={restaurant.cuisine}
        isEmailVerified={restaurant.isEmailVerified}
      />
    </div>
  );
}
