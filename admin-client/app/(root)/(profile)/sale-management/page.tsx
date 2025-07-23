import SaleManagementErrorPage from "@/components/errors/SaleManagementErrorPage";
import QueryWrapper from "@/components/providers/query-wrapper";
import SaleManagementQueryMapper from "@/components/query-mappers/SaleManagementQueryMapper";
import { getOnSaleItems } from "@/lib/actions/server.actions";
import { getRestaurantSession } from "@/lib/get-user";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Foodora Admin | Sale Management",
};

export default async function SaleManagementPage() {
  const restaurant = await getRestaurantSession();
  const result = await getOnSaleItems();

  if (result?.error) {
    return <SaleManagementErrorPage />;
  }

  return (
    <QueryWrapper>
      <SaleManagementQueryMapper
        initialData={result?.data}
        restaurant={restaurant}
      />
    </QueryWrapper>
  );
}
