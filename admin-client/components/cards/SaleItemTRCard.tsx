"use client";

import { formatDateWithTime, formatPriceWithAbbreviation } from "@/lib/utils";
import React, { useState } from "react";
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
import { Button } from "../ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getClientSaleItems,
  removeSaleAction,
} from "@/lib/actions/client.actions";
import { toast } from "sonner";

const SaleItemTRCard: React.FC<{
  item: IItem;
  index: number;
}> = ({ item, index }) => {
  const queryClient = useQueryClient();

  const [alertOpen, setAlertOpen] = useState<boolean>(false);

  const { mutate: removeSaleMutation, isPending: isRemoving } = useMutation({
    mutationFn: async () => {
      await removeSaleAction(item._id);
    },
    onSuccess: () => {
      queryClient.fetchQuery({
        queryKey: ["SALE_ITEMS"],
        queryFn: getClientSaleItems,
      });

      setAlertOpen(false);
      toast.success(`Sale removed successfully for ${item.title}`);
    },
    onError: () => {
      setAlertOpen(false);
      toast.error("Something went wrong while removing sale.");
    },
  });

  return (
    <tr
      key={item._id}
      className="border-t border-neutral-200 dark:border-neutral-800"
    >
      <td className="p-4 capitalize font-medium">
        {index + 1}# {item.title}
      </td>
      <td className="p-4 capitalize">{item.saleType}</td>
      <td className="p-4 text-[15px] font-medium text-red-600 dark:text-red-500">
        {item.saleType === "fixed"
          ? formatPriceWithAbbreviation(item.saleAmount || 0)
          : `${item.saleAmount}%`}
      </td>
      <td className="p-4 text-neutral-600 dark:text-neutral-400">
        {item.saleStartDate ? (
          formatDateWithTime(item.saleStartDate)
        ) : (
          <span className="italic">—</span>
        )}
      </td>
      <td className="p-4 text-neutral-600 dark:text-neutral-400">
        {item.saleEndDate ? (
          formatDateWithTime(item.saleEndDate)
        ) : (
          <span className="italic">—</span>
        )}
      </td>
      <td className="p-4 text-right">
        <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              size="icon"
              className="cursor-pointer bg-red-500 hover:bg-red-400"
              title="Remove Sale"
            >
              <Trash2 size={18} />
            </Button>
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
                {isRemoving ? <Loader2 className="animate-spin" /> : "Confirm"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </td>
    </tr>
  );
};

export default SaleItemTRCard;
