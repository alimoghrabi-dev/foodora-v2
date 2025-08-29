import CartPageClientMapper from "@/_market/components/client_renderers/CartPageClientMapper";
import CartPageError from "@/_market/components/client_renderers/CartPageError";
import { getCartById } from "@/_market/lib/server-actions";
import QueryWrapper from "@/components/providers/query-wrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Foodora | Your Cart",
};

export default async function CartPage({
  params,
}: {
  params: Promise<{ cartId: string }>;
}) {
  const { cartId } = await params;

  const result = await getCartById(cartId);

  if (result?.error) {
    return <CartPageError />;
  }

  return (
    <QueryWrapper>
      <CartPageClientMapper initialData={result?.cart} cartId={cartId} />
    </QueryWrapper>
  );
}
