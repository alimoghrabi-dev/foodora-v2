import MenuItemErrorPage from "@/components/errors/MenuItemErrorPage";
import QueryWrapper from "@/components/providers/query-wrapper";
import MenuItemPageQueryMapper from "@/components/query-mappers/MenuItemPageQueryMapper";
import { getMenuItemByName } from "@/lib/actions/server.actions";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getRestaurantSession } from "@/lib/get-user";

export const metadata: Metadata = {
  title: "Foodora Admin | Menu Item",
};

export default async function SingleMenuPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const restaurant = await getRestaurantSession();

  const { name } = await params;

  if (!name) {
    redirect("/menu");
  }

  const result = await getMenuItemByName(name);

  if (result?.error) {
    return <MenuItemErrorPage />;
  }

  return (
    <QueryWrapper>
      <MenuItemPageQueryMapper
        initialData={result?.item}
        restaurant={restaurant}
      />
    </QueryWrapper>
  );
}
