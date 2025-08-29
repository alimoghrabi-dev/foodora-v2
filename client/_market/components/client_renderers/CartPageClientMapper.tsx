"use client";

import React from "react";
import { getClientCartById } from "@/_market/lib/client-actions";
import { useQuery } from "@tanstack/react-query";
import CartPageError from "./CartPageError";
import {
  calculateItemTotal,
  calculateItemTotalWithSale,
  cn,
  formatNumber,
  formatPriceWithAbbreviation,
} from "@/lib/utils";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CartItemTableRow from "../cards/CartItemTableRow";
import CartPageLoading from "../shared/CartPageLoading";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const CartPageClientMapper: React.FC<{
  initialData: ICart & {
    isAutoClosed: boolean;
    isPublished: boolean;
    restaurantName: string;
    restaurantOnSale: boolean;
    restaurantSaleType: "fixed" | "percentage" | null;
    restaurantSaleAmount: number;
    restaurantSaleStartDate: Date | null;
    restaurantSaleEndDate: Date | null;
  };
  cartId: string;
}> = ({ initialData, cartId }) => {
  const {
    data: cart,
    isPending,
    isRefetching,
    isError,
  } = useQuery<
    ICart & {
      isAutoClosed: boolean;
      isPublished: boolean;
      restaurantName: string;
      restaurantOnSale: boolean;
      restaurantSaleType: "fixed" | "percentage" | null;
      restaurantSaleAmount: number;
      restaurantSaleStartDate: Date | null;
      restaurantSaleEndDate: Date | null;
    }
  >({
    queryKey: ["CART", cartId],
    queryFn: () => getClientCartById(cartId),
    initialData,
    refetchOnWindowFocus: false,
    enabled: false,
  });

  const getSubtotal = (): number => {
    let subtotal = 0;

    if (cart.restaurantOnSale) {
      subtotal = cart.items.reduce((sum, item) => {
        return (
          sum +
          calculateItemTotal(
            item.itemId.price,
            item.quantity,
            item.variants,
            item.addons
          )
        );
      }, 0);

      if (cart.restaurantSaleType === "percentage") {
        const discount = (subtotal * (cart.restaurantSaleAmount || 0)) / 100;
        subtotal = Math.max(subtotal - discount, 0);
      }

      if (cart.restaurantSaleType === "fixed") {
        const discount = cart.restaurantSaleAmount || 0;
        subtotal = Math.max(subtotal - discount, 0);
      }
    } else {
      subtotal = cart.items.reduce((sum, item) => {
        return sum + calculateItemTotalWithSale(item);
      }, 0);
    }

    return subtotal;
  };

  if (isPending || isRefetching) {
    return <CartPageLoading />;
  }

  if (isError) {
    return <CartPageError />;
  }

  return (
    <section className="w-full flex flex-col items-center gap-y-5 pb-6">
      <div className="flex flex-col items-center gap-y-2">
        <div className="w-full flex items-center justify-center">
          <h1 className="font-black text-[24px] sm:text-[32px] text-neutral-900 text-center">
            <strong className="text-primary">
              {cart.restaurantName ?? "Restaurant"}
            </strong>{" "}
            Cart{" "}
            {`(${formatNumber(cart?.items.length) || 0} ${
              cart?.items.length === 1 ? "item" : "items"
            })`}
          </h1>
        </div>
        {cart.isAutoClosed || !cart.isPublished ? (
          <div className="relative w-fit px-4 sm:px-5 flex items-center gap-x-1.5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-red-500 via-rose-600 to-red-700 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-red-400/40 overflow-hidden">
            <AlertCircle className="mb-[2px] size-4 sm:size-5" /> Restaurant is
            {!cart.isPublished ? " unavailable" : " closed"}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
          </div>
        ) : null}
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-neutral-200/75">
            <TableHead className="w-[896px] max-w-4xl">Item</TableHead>
            <TableHead className="text-right px-8">Price</TableHead>
            <TableHead className="text-right px-8">Quantity</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cart.items.map((item, index) => (
            <CartItemTableRow
              key={index}
              item={item}
              index={index}
              cartId={cart._id}
            />
          ))}
        </TableBody>
      </Table>
      <div className="w-full flex justify-end">
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="w-full flex items-center justify-between gap-x-8 py-2.5 border-b border-neutral-300">
            <div className="flex items-center gap-x-2">
              <span className="text-neutral-800 font-medium text-[15px]">
                Subtotal
              </span>
              {cart.restaurantOnSale && (
                <div className="px-2 py-0.5 text-xs text-white bg-primary rounded-full font-medium">
                  ON SALE
                </div>
              )}
            </div>
            <p
              className={cn("text-[15px] font-semibold text-neutral-900", {
                "text-primary": cart.restaurantOnSale,
              })}
            >
              {formatPriceWithAbbreviation(getSubtotal())}
            </p>
          </div>
          <div className="w-full flex justify-start md:justify-end mt-3">
            <div className="flex flex-col items-center">
              <Button
                type="button"
                disabled={cart.isAutoClosed || !cart.isPublished}
                className="w-56 lg:w-80 disabled:cursor-not-allowed rounded-sm bg-neutral-950 text-white text-base font-semibold py-6 hover:bg-neutral-800 transition-all"
              >
                {cart.isAutoClosed
                  ? "Restaurant is Closed"
                  : !cart.isPublished
                  ? "Restaurant is Unavailable"
                  : "Continue to Checkout"}
              </Button>
              {cart.isAutoClosed || !cart.isPublished ? (
                <p className="mt-1 text-xs font-medium text-red-400 text-center break-words max-w-56 lg:max-w-80">
                  You cannot checkout while the restaurant is closed or
                  unavailable.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartPageClientMapper;
