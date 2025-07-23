import MenuItemErrorPage from "@/components/errors/MenuItemErrorPage";
import QueryWrapper from "@/components/providers/query-wrapper";
import MenuItemEditorQueryMapper from "@/components/query-mappers/MenuItemEditorQueryMapper";
import { getMenuItemByName } from "@/lib/actions/server.actions";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Foodora Admin | Edit Menu Item",
};

export default async function SingleMenuPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
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
      <MenuItemEditorQueryMapper initialData={result?.item} />
    </QueryWrapper>
  );
}
