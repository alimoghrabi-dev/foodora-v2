"use client";

import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteMenuItem,
  getClientMenuItemByName,
  getClientMenuItems,
  removeSaleAction,
} from "@/lib/actions/client.actions";
import { Button, buttonVariants } from "../ui/button";
import { Pencil, Trash2, Star, Loader2, Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import Image from "next/image";
import Link from "next/link";
import { cn, formatPriceWithAbbreviation } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import MenuItemErrorPage from "../errors/MenuItemErrorPage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import QueryWrapper from "../providers/query-wrapper";
import VariantDialogManagement from "./VariantDialogManagement";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TbDiscountOff } from "react-icons/tb";
import { MdDiscount } from "react-icons/md";
import ApplyItemSaleForm from "../forms/ApplyItemSaleForm";

const MenuItemPageQueryMapper: React.FC<{
  initialData: IItem;
  restaurant: IRestaurant | null;
}> = ({ initialData, restaurant }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [saleOpen, setSaleOpen] = useState<boolean>(false);

  const saleStarted = (item: IItem | IRestaurant): boolean => {
    if (!item.onSale) return false;
    if (!item.saleStartDate) return true;
    return new Date(item.saleStartDate) <= new Date();
  };

  const {
    data: item,
    isPending,
    isRefetching,
    isError,
  } = useQuery<IItem>({
    queryKey: ["MENU_ITEM", initialData?._id],
    queryFn: () => getClientMenuItemByName(initialData?.title),
    initialData,
    refetchOnWindowFocus: false,
    enabled: false,
  });

  const shouldPulse = () => {
    const itemPulse = item.onSale && !saleStarted(item);
    const restaurantPulse = restaurant?.onSale && !saleStarted(restaurant);
    return itemPulse || restaurantPulse;
  };

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

  const { mutate: deleteItemMutation, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      await deleteMenuItem(item._id);
    },
    onSuccess: () => {
      queryClient.fetchQuery({
        queryKey: ["MENU_ITEMS"],
        queryFn: getClientMenuItems,
      });

      setDeleteOpen(false);
      toast.success("Menu item deleted successfully.");
      router.push("/menu");
    },
    onError: () => {
      toast.error("Something went wrong while deleting the menu item.");
    },
  });

  const { mutate: removeSaleMutation, isPending: isRemoving } = useMutation({
    mutationFn: async () => {
      await removeSaleAction(item._id);
    },
    onSuccess: () => {
      queryClient.fetchQuery({
        queryKey: ["MENU_ITEM", item._id],
        queryFn: () => getClientMenuItemByName(item.title),
      });

      setAlertOpen(false);
      toast.success(`Sale removed successfully for ${item.title}`);
    },
    onError: () => {
      setAlertOpen(false);
      toast.error("Something went wrong while removing sale.");
    },
  });

  if (isError) {
    return <MenuItemErrorPage />;
  }

  if (isPending || isRefetching) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4 animate-fade-in">
        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary font-bold text-xs">
            Loading
          </div>
        </div>
        <h2 className="text-xl font-semibold text-foreground">
          Fetching Menu Item
        </h2>
        <p className="mt-2 text-muted-foreground max-w-md">
          Please wait while we load the latest menu item details. This will only
          take a moment.
        </p>
      </div>
    );
  }

  return (
    <section className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-x-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground capitalize line-clamp-1">
              {item.title}
            </h1>

            {item.onSale || restaurant?.onSale ? (
              <span
                className={cn(
                  "flex items-center gap-1 bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white text-[14px] font-semibold px-3 py-1 rounded-full shadow shadow-black/30 backdrop-blur-sm",
                  {
                    "animate-pulse": shouldPulse(),
                  }
                )}
              >
                <Sparkles size={14} />
                {saleStarted(item) || saleStarted(restaurant as IRestaurant)
                  ? "On Sale"
                  : "Starting Soon"}
              </span>
            ) : null}
          </div>
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
          <p className="text-sm text-muted-foreground">{item.description}</p>
        </div>
        <div className="flex gap-2">
          {restaurant?.onSale ? null : item.onSale ? (
            <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    buttonVariants({
                      size: "icon",
                      className:
                        "rounded-full border bg-transparent hover:bg-red-500/20 cursor-pointer",
                    })
                  )}
                  aria-label="Remove Sale"
                  title="Remove Sale"
                >
                  <TbDiscountOff className="w-5 h-5 text-red-600" />
                </button>
              </AlertDialogTrigger>
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
                    {isRemoving ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Confirm"
                    )}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Dialog open={saleOpen} onOpenChange={setSaleOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    buttonVariants({
                      size: "icon",
                      className:
                        "rounded-full border bg-transparent hover:bg-indigo-500/10 cursor-pointer",
                    })
                  )}
                  aria-label="Apply Sale"
                  title="Apply Sale"
                >
                  <MdDiscount className="w-5 h-5 text-indigo-600" />
                </button>
              </DialogTrigger>
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
          )}

          <Link
            href={`/menu/edit/${item.title}`}
            className={cn(
              buttonVariants({
                size: "icon",
                className:
                  "rounded-full border bg-transparent hover:bg-primary/20 cursor-pointer",
              })
            )}
            aria-label="Edit"
            title="Edit Item"
          >
            <Pencil className="w-5 h-5 text-primary" />
          </Link>
          <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full border hover:bg-red-500/10 dark:hover:bg-red-400/10 cursor-pointer"
                aria-label="Delete"
                title="Delete Item"
              >
                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent aria-describedby={undefined}>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your menu item and remove it from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  disabled={isDeleting}
                  className="font-medium cursor-pointer"
                >
                  Cancel
                </AlertDialogCancel>
                <Button
                  type="button"
                  onClick={() => deleteItemMutation()}
                  disabled={isDeleting}
                  className="w-40 font-medium bg-red-500 hover:bg-red-400 transition-all cursor-pointer"
                >
                  {isDeleting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Permanently Delete"
                  )}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {item.imageUrl && (
        <div className="w-[325px] h-[275px] rounded-lg overflow-hidden relative shadow flex items-center justify-start">
          <Image
            src={item.imageUrl}
            alt={item.title}
            className="w-full object-cover h-full"
            priority
            fill
          />
        </div>
      )}

      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {item.category?.name && (
            <Badge variant="outline" className="text-sm">
              Category: {item.category.name}
            </Badge>
          )}

          {item.tags.map((tag: string, index: number) => (
            <Badge
              key={index}
              className="text-xs bg-blue-100 dark:bg-blue-900/30 text-neutral-800 dark:text-neutral-50"
            >
              #{tag}
            </Badge>
          ))}
        </div>

        <p className="text-sm text-muted-foreground">
          <strong className="text-neutral-500 dark:text-neutral-400">
            Ingredients:
          </strong>{" "}
          {item.ingredients.join(", ")}
        </p>
      </div>

      {item.variants?.length > 0 && (
        <div>
          <div className="w-full flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg text-foreground">
              Variants - {item.variants.length}
            </h3>
            <Dialog>
              <DialogTrigger asChild>
                <p
                  role="button"
                  tabIndex={0}
                  className="inline-block text-sm font-medium text-primary hover:underline hover:text-primary/90 cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-primary-light"
                >
                  {`--> Manage Variants <--`}
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
          <ScrollArea className="max-h-[200px] pr-2">
            <div className="grid gap-3">
              {item.variants.map(
                (v: {
                  _id: string;
                  name: string;
                  price: number;
                  isAvailable: boolean;
                }) => (
                  <div
                    key={v._id}
                    className="flex items-center justify-between rounded-md border p-3 bg-muted/30 dark:bg-muted/40"
                  >
                    <span className="font-medium capitalize">{v.name}</span>
                    <span className="text-sm text-muted-foreground">
                      ${v.price.toFixed(2)} •{" "}
                      {v.isAvailable ? (
                        <span className="text-green-500 font-medium">
                          Available
                        </span>
                      ) : (
                        <span className="text-red-500 font-medium">
                          Unavailable
                        </span>
                      )}
                    </span>
                  </div>
                )
              )}
            </div>
          </ScrollArea>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t mt-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500" />
          {item.rating.toFixed(1)} ({item.reviewsCount} reviews)
        </span>
        <span>
          Status:{" "}
          {item.isAvailable ? (
            <span className="text-green-500 font-medium">Available</span>
          ) : (
            <span className="text-red-500 font-medium">Unavailable</span>
          )}
        </span>
      </div>
    </section>
  );
};

export default MenuItemPageQueryMapper;
