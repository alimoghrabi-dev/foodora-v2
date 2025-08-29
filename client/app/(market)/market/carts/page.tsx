import CartsPageClientMapper from "@/_market/components/client_renderers/CartsPageClientMapper";
import CartsPageError from "@/_market/components/client_renderers/CartsPageError";
import { getUserCarts } from "@/_market/lib/server-actions";
import QueryWrapper from "@/components/providers/query-wrapper";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Foodora | Carts",
};

export default async function CartPage() {
  const result = await getUserCarts();

  if (result?.error) {
    return <CartsPageError />;
  }

  return (
    <ScrollArea className="w-full max-h-[82.5vh]">
      <QueryWrapper>
        <CartsPageClientMapper initialData={result?.carts} />
      </QueryWrapper>
    </ScrollArea>
  );
}
