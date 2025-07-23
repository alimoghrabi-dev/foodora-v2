"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Star, ImageOff, Sparkles, Loader2 } from "lucide-react";
import { cn, formatNumber, formatPriceWithAbbreviation } from "@/lib/utils";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import VariantDialogManagement from "../query-mappers/VariantDialogManagement";
import { motion, AnimatePresence } from "framer-motion";
import QueryWrapper from "../providers/query-wrapper";
import { MdDiscount } from "react-icons/md";
import Link from "next/link";
import ApplyItemSaleForm from "../forms/ApplyItemSaleForm";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getClientMenuItems,
  removeSaleAction,
} from "@/lib/actions/client.actions";
import { toast } from "sonner";

interface Props {
  item: IItem;
  restaurant: IRestaurant | null;
}

const IMAGE_WIDTH = 325;
const IMAGE_HEIGHT = 225;

const MenuItemCard: React.FC<Props> = ({ item, restaurant }) => {
  const queryClient = useQueryClient();

  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [saleOpen, setSaleOpen] = useState<boolean>(false);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);

  const { mutate: removeSaleMutation, isPending: isRemoving } = useMutation({
    mutationFn: async () => {
      await removeSaleAction(item._id);
    },
    onSuccess: () => {
      queryClient.fetchQuery({
        queryKey: ["MENU_ITEMS"],
        queryFn: getClientMenuItems,
      });

      setAlertOpen(false);
      toast.success(`Sale removed successfully for ${item.title}`);
    },
    onError: () => {
      setAlertOpen(false);
      toast.error("Something went wrong while removing sale.");
    },
  });

  const salePrice = (price: number) => {
    if (!restaurant) return price;

    const now = new Date();

    const isSaleActive = (startDate?: string | Date | null) => {
      if (!startDate) return true;
      return new Date(startDate) <= now;
    };

    if (item.onSale && isSaleActive(item.saleStartDate)) {
      if (item.saleType === "percentage") {
        return price - price * (item.saleAmount! / 100);
      } else {
        const result = price - item.saleAmount!;
        return result < 0 ? 0 : result;
      }
    }

    if (restaurant.onSale && isSaleActive(restaurant.saleStartDate)) {
      if (restaurant.saleType === "percentage") {
        return price - price * (restaurant.saleAmount! / 100);
      } else {
        const result = price - restaurant.saleAmount!;
        return result < 0 ? 0 : result;
      }
    }

    return price;
  };

  return (
    <div
      onMouseEnter={() => {
        if (!saleOpen && !restaurant?.onSale) setIsHovered(true);
      }}
      onMouseLeave={() => {
        if (!saleOpen && !restaurant?.onSale) setIsHovered(false);
      }}
      className={cn(
        "relative bg-white dark:bg-neutral-950 rounded-xl shadow-md border border-neutral-200 dark:border-neutral-800",
        "hover:shadow-lg hover:bg-neutral-100 hover:dark:bg-neutral-900/30 transition-all duration-300 overflow-hidden w-[325px]"
      )}
    >
      <AnimatePresence>
        {isHovered && !restaurant?.onSale ? (
          item.onSale ? (
            <motion.button
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: 16 }}
              exit={{ opacity: 0, y: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="z-20 absolute flex items-center gap-x-2 top-0 left-1/2 transform -translate-x-1/2 bg-red-600/40 text-neutral-50 font-medium px-4 py-2 rounded-xl shadow-lg shadow-neutral-900/40 cursor-pointer hover:bg-red-600/60 transition-colors backdrop-blur-md"
              onClick={() => {
                setAlertOpen(true);
                setIsHovered(false);
              }}
              type="button"
            >
              <MdDiscount size={19} />
              Remove Sale
            </motion.button>
          ) : (
            <motion.button
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: 16 }}
              exit={{ opacity: 0, y: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="z-20 absolute flex items-center gap-x-2 top-0 left-1/2 transform -translate-x-1/2 bg-primary/50 text-neutral-50 font-medium px-4 py-2 rounded-xl shadow-lg shadow-neutral-900/40 cursor-pointer hover:bg-primary/60 transition-colors backdrop-blur-md"
              onClick={() => {
                setSaleOpen(true);
                setIsHovered(false);
              }}
              type="button"
            >
              <MdDiscount size={19} />
              Apply Sale
            </motion.button>
          )
        ) : null}
      </AnimatePresence>

      <Dialog
        open={saleOpen}
        onOpenChange={(open) => {
          setSaleOpen(open);
          setIsHovered(false);
        }}
      >
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="capitalize">
              Apply Sale to {item.title}
            </DialogTitle>
            <div className="w-32 h-px bg-neutral-300 dark:bg-neutral-900" />
          </DialogHeader>
          <ApplyItemSaleForm
            title={item.title}
            itemId={item._id}
            setOpen={setSaleOpen}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent aria-describedby={undefined}>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will remove the sale from {item.title}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isRemoving}
              className="font-medium cursor-pointer"
            >
              Cancel
            </AlertDialogCancel>
            <Button
              type="button"
              onClick={() => removeSaleMutation()}
              disabled={isRemoving}
              className="w-28 font-medium bg-red-500 hover:bg-red-400 transition-all cursor-pointer"
            >
              {isRemoving ? <Loader2 className="animate-spin" /> : "Confirm"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="relative w-full h-auto z-10">
        {item.onSale && (
          <span className="absolute z-50 bottom-1 left-1 flex items-center gap-1 bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white text-[13px] font-semibold px-3 py-1 rounded-full shadow shadow-black/30 backdrop-blur-sm">
            <Sparkles size={13} />
            On Sale
          </span>
        )}

        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            width={IMAGE_WIDTH}
            height={IMAGE_HEIGHT}
            className="object-cover w-full h-auto"
            priority
          />
        ) : (
          <div
            style={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }}
            className="flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
          >
            <div className="flex flex-col items-center gap-2">
              <ImageOff size={32} />
              <span className="text-sm">No image available</span>
            </div>
          </div>
        )}

        {!item.isAvailable && (
          <div className="absolute top-2 right-2">
            <Badge variant="destructive">Unavailable</Badge>
          </div>
        )}
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <Link
            href={`/menu/${item.title}`}
            className="text-lg font-semibold text-foreground capitalize line-clamp-1 hover:opacity-80 transition-all"
          >
            {item.title}
          </Link>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star size={16} />
            <span className="text-sm font-medium">
              {item.rating ? item.rating.toFixed(1) : "0.0"}
            </span>
            <span className="text-xs text-muted-foreground">
              ({item.reviewsCount ? formatNumber(item.reviewsCount) : 0})
            </span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {item.description}
        </p>

        <div className="text-sm flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span
              className={cn("font-medium text-primary", {
                "line-through text-neutral-500 text-sm dark:text-neutral-700":
                  item.onSale || restaurant?.onSale,
              })}
            >
              {formatPriceWithAbbreviation(item.price)}
            </span>
            {item.onSale || restaurant?.onSale ? (
              <span className="font-bold text-red-600">
                {formatPriceWithAbbreviation(salePrice(item.price) || 0)}
              </span>
            ) : null}
          </div>
          {item.category?.name && (
            <Badge variant="secondary">{item.category.name}</Badge>
          )}
          {item.isEdited && (
            <Badge variant="outline" className="bg-primary text-white">
              Edited
            </Badge>
          )}
        </div>

        {item.variants?.length > 0 && (
          <div className="w-full flex items-center justify-center border-t pt-3.5">
            <Dialog>
              <DialogTrigger asChild>
                <p className="text-primary text-sm font-medium cursor-pointer hover:underline transition-all hover:opacity-85">
                  View Variants ({item.variants.length})
                </p>
              </DialogTrigger>
              <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                  <DialogTitle className="capitalize">
                    {item.title} Variants - {item.variants.length}
                  </DialogTitle>
                  <div className="w-24 h-px bg-neutral-300 dark:bg-neutral-900" />
                </DialogHeader>
                <QueryWrapper>
                  <VariantDialogManagement variants={item.variants} />
                </QueryWrapper>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuItemCard;
