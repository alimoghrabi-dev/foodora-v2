import QueryWrapper from "@/components/providers/query-wrapper";
import OrdersManagementSearchInput from "@/components/search-inputs/OrdersManagementSearchInput";
import OrdersRefreshButton from "@/components/shared/OrdersRefreshButton";
import { getRestaurantSession } from "@/lib/get-user";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
  const restaurant = await getRestaurantSession();

  if (!restaurant?.isPublished) {
    redirect("/");
  }

  return (
    <QueryWrapper>
      <section className="w-full flex flex-col gap-y-2">
        <div className="w-full flex flex-col justify-start items-start gap-y-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
            Orders Management
          </h2>
          <div className="w-full flex items-center justify-between gap-x-4">
            <OrdersManagementSearchInput />
            <OrdersRefreshButton />
          </div>
        </div>
      </section>
    </QueryWrapper>
  );
}
