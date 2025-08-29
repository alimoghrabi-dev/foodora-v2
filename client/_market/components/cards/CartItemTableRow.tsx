"use client";

import React, { useMemo, useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  calculateItemTotal,
  cn,
  formatNumber,
  formatPriceWithAbbreviation,
} from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";
import { debounce } from "lodash";
import { motion } from "motion/react";
import Image from "next/image";
import {
  getClientCartById,
  removeItemFromCart,
  updateItemQuantityAction,
} from "@/_market/lib/client-actions";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

const CartItemTableRow: React.FC<{
  item: {
    itemId: IMenuItem;
    quantity: number;
    variants: {
      name: string;
      optionName: string;
      optionId: string;
      price: number;
    }[];
    addons: {
      addonId: string;
      name: string;
      price: number;
    }[];
  };
  index: number;
  cartId: string;
}> = ({ item, index, cartId }) => {
  const queryClient = useQueryClient();

  const [quantity, setQuantity] = useState<number>(item.quantity || 1);

  const totalPriceWithVariantsAndAddons = calculateItemTotal(
    item.itemId.price,
    item.quantity,
    item.variants,
    item.addons
  );

  const isItemOnSale = item.itemId.onSale || false;

  const totalPriceWithVariantsAndAddonsAndSale = useMemo(() => {
    if (!item.itemId.onSale) return totalPriceWithVariantsAndAddons;

    if (item.itemId.saleType === "fixed") {
      const discount = item.itemId.saleAmount!;
      return Math.max(totalPriceWithVariantsAndAddons - discount, 0);
    }

    if (item.itemId.saleType === "percentage") {
      const discount =
        (totalPriceWithVariantsAndAddons * item.itemId.saleAmount!) / 100;
      return Math.max(totalPriceWithVariantsAndAddons - discount, 0);
    }

    return totalPriceWithVariantsAndAddons;
  }, [
    item.itemId.onSale,
    item.itemId.saleType,
    item.itemId.saleAmount,
    totalPriceWithVariantsAndAddons,
  ]);

  const { mutate: removeItemMutation, isPending: isRemoving } = useMutation({
    mutationFn: async () => {
      await removeItemFromCart(cartId, item.itemId._id);
    },
    onSuccess: () => {
      queryClient.fetchQuery({
        queryKey: ["CART", cartId],
        queryFn: () => getClientCartById(cartId),
      });
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong", {
        style: {
          color: "#fff",
          background: "#e7000b",
        },
      });
    },
  });

  const { mutate: updateQuantityMutation, isPending } = useMutation({
    mutationFn: async (newQuantity: number) => {
      await updateItemQuantityAction(cartId, item.itemId._id, newQuantity);
    },
    onSuccess: () => {
      queryClient.fetchQuery({
        queryKey: ["CART", cartId],
        queryFn: () => getClientCartById(cartId),
      });
    },
    onError: (error) => {
      setQuantity(item.quantity || 1);
      toast.error(error.message || "Something went wrong", {
        style: {
          color: "#fff",
          background: "#e7000b",
        },
      });
    },
  });

  const debouncedQuantityChange = useMemo(
    () =>
      debounce((newQuantity: number) => {
        updateQuantityMutation(newQuantity);
      }, 750),
    [updateQuantityMutation]
  );

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
    debouncedQuantityChange(newQuantity);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <TableRow className="border-neutral-200/75 hover:bg-neutral-50/75 cursor-pointer">
          <TableCell className="w-[896px] max-w-4xl">
            <div className="flex gap-x-2 items-start">
              <div className="w-20 h-[70px] relative">
                {item.itemId.imageUrl ? (
                  <Image
                    src={item.itemId.imageUrl}
                    alt={item.itemId.title}
                    className="rounded-lg object-cover"
                    fill
                  />
                ) : (
                  <div className="w-full h-full rounded-lg bg-neutral-200/50 flex items-center justify-center">
                    <Image
                      src="/icons/secondary-logo.png"
                      alt="logo"
                      className="object-cover"
                      width={42}
                      height={42}
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-y-1.5 py-0.5">
                <div className="flex items-center gap-x-2">
                  <h5 className="text-base font-semibold text-neutral-800 capitalize line-clamp-1">
                    {index + 1}#{item.itemId.title}
                  </h5>
                  {isItemOnSale && (
                    <div className="px-2 py-0.5 rounded-full bg-primary text-white text-[12px] font-medium">
                      ON SALE
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-y-px">
                  {item.variants.length > 0 && (
                    <p
                      className="text-[13px] text-neutral-600 line-clamp-1 font-normal"
                      title={item.variants
                        .map((v) => `${v.name}: ${v.optionName}`)
                        .join(", ")}
                    >
                      {item.variants
                        .map((v) => `${v.name}: ${v.optionName}`)
                        .join(", ")}
                    </p>
                  )}

                  {item.addons.length > 0 && (
                    <p
                      className="text-[13px] text-neutral-600 line-clamp-1 font-normal"
                      title=""
                    >
                      Addons:{" "}
                      {item.addons.map((addon) => addon.name).join(", ")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </TableCell>
          <TableCell className="text-right font-semibold text-neutral-950 px-8">
            {formatPriceWithAbbreviation(item.itemId.price)}
          </TableCell>

          <TableCell className="text-right px-8">
            <div className="w-full flex items-center justify-end">
              {isPending ? (
                <div className="flex items-center">
                  <Loader2 size={14} className="animate-spin opacity-75" />
                </div>
              ) : (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-x-1 px-2 py-1 border border-neutral-300/80 rounded-full bg-white cursor-default"
                >
                  <button
                    type="button"
                    disabled={quantity === 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleQuantityChange(quantity - 1);
                    }}
                    className="disabled:opacity-50 disabled:pointer-events-none cursor-pointer text-neutral-900 hover:text-neutral-500 transition"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-[28px] font-medium text-center">
                    {formatNumber(quantity)}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleQuantityChange(quantity + 1);
                    }}
                    className="disabled:opacity-50 disabled:pointer-events-none cursor-pointer text-neutral-900 hover:text-neutral-500 transition"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              )}
            </div>
          </TableCell>
          <TableCell className="text-right">
            <div className="flex items-center justify-end gap-3">
              {isRemoving || isPending ? (
                <div className="p-2">
                  <Loader2 size={16} className="animate-spin text-red-600" />
                </div>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        whileTap={{ scale: 0.9, rotate: 5 }}
                        onClick={() => removeItemMutation()}
                        className="p-2 rounded-full cursor-pointer bg-red-50 hover:bg-red-100 transition-colors text-red-600"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent className="text-[13px] font-medium">
                      <p>Remove Item</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <div className="flex flex-col gap-y-1">
                {isItemOnSale && (
                  <span className="text-primary font-semibold text-sm">
                    {formatPriceWithAbbreviation(
                      totalPriceWithVariantsAndAddonsAndSale
                    )}
                  </span>
                )}
                <span
                  className={cn("font-semibold text-neutral-950 text-sm", {
                    "line-through text-[13px] text-neutral-700 font-medium":
                      isItemOnSale,
                  })}
                >
                  {formatPriceWithAbbreviation(totalPriceWithVariantsAndAddons)}
                </span>
              </div>
            </div>
          </TableCell>
        </TableRow>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-neutral-950 capitalize">
            {item.itemId.title}
          </DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CartItemTableRow;
