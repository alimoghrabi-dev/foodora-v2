"use client";

import React, { useState } from "react";
import { Loader2, PlusCircle } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SaleManagementErrorPage from "../errors/SaleManagementErrorPage";
import {
  getClientMenuItems,
  getClientSaleItems,
  removeRestaurantSaleAction,
} from "@/lib/actions/client.actions";
import { formatNumber } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import SmartCountUp from "../shared/SmartCountUp";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import HandleDisplayOfNotOnSaleItems from "./HandleDisplayOfNotOnSaleItems";
import SaleItemTRCard from "../cards/SaleItemTRCard";
import { Button } from "../ui/button";
import ApplyMenuSaleForm from "../forms/ApplyMenuSaleForm";
import { refetchSessionCookie } from "@/lib/session-updates";
import { toast } from "sonner";
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

const SaleManagementQueryMapper: React.FC<{
  initialData:
    | {
        items: IItem[];
        activeSales: number;
        expiringSoonSales: number;
        upcomingSales: number;
        totalSales: number;
      }
    | undefined;
  restaurant: IRestaurant | null;
}> = ({ initialData, restaurant }) => {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState<boolean>(false);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);

  const { data, isPending, isRefetching, isError } = useQuery({
    queryKey: ["SALE_ITEMS"],
    queryFn: getClientSaleItems,
    initialData,
    refetchOnWindowFocus: false,
    refetchInterval: 15 * 60 * 1000,
    enabled: false,
  });

  const { mutate: removeMenuSaleMutation, isPending: isRemoving } = useMutation(
    {
      mutationFn: async () => {
        await removeRestaurantSaleAction();
      },
      onSuccess: async () => {
        await refetchSessionCookie();

        queryClient.fetchQuery({
          queryKey: ["SALE_ITEMS"],
          queryFn: getClientSaleItems,
        });

        queryClient.fetchQuery({
          queryKey: ["MENU_ITEMS"],
          queryFn: getClientMenuItems,
        });

        setAlertOpen(false);
        toast.success(`Sale removed successfully for ${restaurant?.name}`);
      },
      onError: () => {
        setAlertOpen(false);
        toast.error("Something went wrong while removing menu sale.");
      },
    }
  );

  const displayMessageWithTime = () => {
    if (!restaurant?.onSale) return null;

    if (!restaurant?.saleStartDate || !restaurant?.saleEndDate) {
      return "Sale willn't end until you remove it.";
    }

    const now = new Date();
    const startDate = new Date(restaurant.saleStartDate);
    const endDate = new Date(restaurant.saleEndDate);

    const getRelativeTime = (diffMs: number) => {
      const minutes = Math.round(diffMs / 60000);
      if (minutes < 1) return "less than a minute";
      if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""}`;
      const hours = Math.round(minutes / 60);
      if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""}`;
      const days = Math.round(hours / 24);
      return `${days} day${days > 1 ? "s" : ""}`;
    };

    if (startDate > now) {
      const timeUntilStart = startDate.getTime() - now.getTime();
      return `Sale will start in ${getRelativeTime(timeUntilStart)}`;
    } else {
      const timeUntilEnd = endDate.getTime() - now.getTime();
      if (timeUntilEnd <= 0) return "Sale has ended";
      return `Sale will end in ${getRelativeTime(timeUntilEnd)}`;
    }
  };

  if (isError) {
    return <SaleManagementErrorPage />;
  }

  return (
    <section className="px-6 pt-6 pb-28 lg:pb-16 xl:pb-12 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
            Sale Management
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
            View and manage item discounts and sales
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              disabled={isPending || isRefetching || restaurant?.onSale}
              className="disabled:pointer-events-none disabled:opacity-50 select-none disabled:cursor-not-allowed flex items-center bg-primary text-white rounded-md gap-1.5 transition-all hover:opacity-80 px-3.5 py-2 cursor-pointer"
            >
              <PlusCircle size={19} />
              <span className="text-[15px] font-medium">New Sale</span>
            </button>
          </DialogTrigger>
          <DialogContent aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle>Add New Sale Item</DialogTitle>
              <div className="w-24 h-px bg-neutral-300 dark:bg-neutral-800" />
            </DialogHeader>
            <HandleDisplayOfNotOnSaleItems />
          </DialogContent>
        </Dialog>
      </div>

      {isPending || isRefetching ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-transparent border">
            <Skeleton className="w-32 h-4 rounded-lg" />
            <Skeleton className="w-7 h-5 rounded-lg mt-2" />
          </div>
          <div className="p-4 rounded-xl bg-transparent border">
            <Skeleton className="w-36 h-4 rounded-lg" />
            <Skeleton className="w-7 h-5 rounded-lg mt-2" />
          </div>
          <div className="p-4 rounded-xl bg-transparent border">
            <Skeleton className="w-24 h-4 rounded-lg" />
            <Skeleton className="w-7 h-5 rounded-lg mt-2" />
          </div>
          <div className="p-4 rounded-xl bg-transparent border">
            <Skeleton className="w-36 h-4 rounded-lg" />
            <Skeleton className="w-7 h-5 rounded-lg mt-2" />
          </div>
        </div>
      ) : restaurant?.onSale ? (
        <div className="w-full px-4 py-5 rounded-xl bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800 border border-yellow-300 dark:border-yellow-600 shadow flex flex-col items-center justify-center gap-2">
          <div className="flex items-center justify-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-yellow-600 dark:text-yellow-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
              This restaurant is offering a{" "}
              <span className="font-semibold">sitewide sale</span> on all menu
              items!
            </p>
          </div>
          <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400 underline underline-offset-2">
            {displayMessageWithTime()}
          </p>
          <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                className="cursor-pointer focus-visible:ring-yellow-300 bg-yellow-600 hover:bg-yellow-700 text-white dark:bg-yellow-500 dark:hover:bg-yellow-400 dark:text-black font-medium px-4 py-2 rounded-md shadow-sm transition"
              >
                Remove Sitewide Sale
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent aria-describedby={undefined}>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will remove the sale from the whole menu.
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
                  onClick={() => removeMenuSaleMutation()}
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
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl shadow bg-white dark:bg-neutral-900">
            <p className="text-sm text-neutral-500 dark:text-neutral-300 font-medium">
              Active Sales
            </p>
            <h2 className="text-xl font-semibold">
              <SmartCountUp
                end={data?.activeSales || 0}
                formattingFn={formatNumber}
              />
            </h2>
          </div>
          <div className="p-4 rounded-xl shadow bg-white dark:bg-neutral-900">
            <p className="text-sm text-neutral-500 dark:text-neutral-300 font-medium">
              Soon to Expire Sales
            </p>
            <h2 className="text-xl font-semibold">
              <SmartCountUp
                end={data?.expiringSoonSales || 0}
                formattingFn={formatNumber}
              />
            </h2>
          </div>
          <div className="p-4 rounded-xl shadow bg-white dark:bg-neutral-900">
            <p className="text-sm text-neutral-500 dark:text-neutral-300 font-medium">
              Upcoming
            </p>
            <h2 className="text-xl font-semibold">
              <SmartCountUp
                end={data?.upcomingSales || 0}
                formattingFn={formatNumber}
              />
            </h2>
          </div>
          <div className="p-4 rounded-xl shadow bg-white dark:bg-neutral-900">
            <p className="text-sm text-neutral-500 dark:text-neutral-300 font-medium">
              Total Discounted Items
            </p>
            <h2 className="text-xl font-semibold">
              <SmartCountUp
                end={data?.totalSales || 0}
                formattingFn={formatNumber}
              />
            </h2>
          </div>
        </div>
      )}

      <div className="overflow-x-auto border rounded-xl bg-white dark:bg-neutral-950">
        <table className="w-full table-auto text-sm">
          <thead className="bg-neutral-100 dark:bg-neutral-900 text-left text-neutral-600 dark:text-neutral-400">
            <tr>
              <th className="p-4">Item</th>
              <th className="p-4">Sale Type</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Start</th>
              <th className="p-4">End</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isPending || isRefetching ? (
              <tr>
                <td colSpan={6} className="py-8">
                  <div className="flex flex-col items-center justify-center gap-2 py-8 w-full text-sm text-muted-foreground">
                    <svg
                      className="size-8 animate-spin text-primary"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    <span className="animate-pulse text-base font-medium">
                      Loading sale items...
                    </span>
                  </div>
                </td>
              </tr>
            ) : !data?.items || data.items.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-[84px] text-center text-base font-medium text-red-400 dark:text-red-300"
                >
                  {restaurant?.onSale
                    ? "Your Restaurant is on a site-wide sale"
                    : "No items on sale have been found"}
                </td>
              </tr>
            ) : (
              data.items.map((item: IItem, index: number) => (
                <SaleItemTRCard key={item._id} item={item} index={index} />
              ))
            )}
          </tbody>
        </table>
      </div>
      {!restaurant?.onSale && (
        <div className="absolute bottom-0 inset-x-0 border bg-gradient-to-t from-neutral-300/30 via-neutral-200/80 to-neutral-300/30 dark:from-neutral-950/30 dark:via-neutral-950/80 dark:to-neutral-950/30 backdrop-blur-xl p-4 rounded-xl shadow">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="text-sm text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-yellow-500 mt-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-4.75a.75.75 0 00-1.5 0v1a.75.75 0 001.5 0v-1zM10 6a.75.75 0 00-.75.75v4.5a.75.75 0 001.5 0v-4.5A.75.75 0 0010 6z"
                  clipRule="evenodd"
                />
              </svg>
              <p>
                <strong className="font-medium">Heads up:</strong> Applying a
                sale to the whole menu will{" "}
                <span className="text-red-500 font-semibold">
                  remove all existing item-level sales
                </span>
                .
              </p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  className="inline-flex cursor-pointer items-center gap-2 bg-primary text-white dark:text-neutral-50 hover:bg-primary/90 px-4 py-2 rounded-lg shadow transition-all duration-150 text-sm font-medium"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 17l-5-5m0 0l5-5m-5 5h12"
                    />
                  </svg>
                  Apply Sale to Whole Menu
                </Button>
              </DialogTrigger>
              <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                  <DialogTitle className="capitalize">
                    Apply Sale to Whole Menu
                  </DialogTitle>
                  <div className="w-32 h-px bg-neutral-300 dark:bg-neutral-900" />
                </DialogHeader>
                <ApplyMenuSaleForm setOpen={setOpen} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </section>
  );
};

export default SaleManagementQueryMapper;
