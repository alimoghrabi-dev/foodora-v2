import MenuItemsError from "@/components/errors/MenuItemsError";
import QueryWrapper from "@/components/providers/query-wrapper";
import MenuItemsQueryMapper from "@/components/query-mappers/MenuItemsQueryMapper";
import { Button } from "@/components/ui/button";
import { getMenuItems } from "@/lib/actions/server.actions";
import { Ghost, PlusCircle } from "lucide-react";
import Link from "next/link";

export default async function MenuPage() {
  const result = await getMenuItems();

  return (
    <section className="w-full flex flex-col gap-y-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
          Menu Items
        </h2>
        <Link
          href="/menu/add"
          className="gap-2 text-base font-medium text-white bg-primary hover:bg-primary/85 transition-all shadow-md flex items-center px-3 py-1.5 rounded-sm"
        >
          <PlusCircle size={20} />
          Add Menu Item
        </Link>
      </div>
      {result?.error ? (
        <MenuItemsError />
      ) : result?.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center px-6">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
            <Ghost className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            No Items Found
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Looks like there are no items in the menu yet. Start adding some to
            display here!
          </p>
          <Link href="/menu/add">
            <Button className="rounded-sm cursor-pointer">Add Menu Item</Button>
          </Link>
        </div>
      ) : (
        <QueryWrapper>
          <MenuItemsQueryMapper initialData={result?.items} />
        </QueryWrapper>
      )}
    </section>
  );
}
