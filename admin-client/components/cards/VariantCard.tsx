"use client";

import React, { Fragment, useState } from "react";
import { formatPriceWithAbbreviation } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import EditVariantForm from "../forms/EditVariantForm";
import { Button } from "../ui/button";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteVariant,
  getClientMenuItems,
} from "@/lib/actions/client.actions";

const VariantCard: React.FC<{
  variant: {
    _id: string;
    name: string;
    price: number;
    isAvailable: boolean;
  };
  setToast: React.Dispatch<
    React.SetStateAction<{
      type: "success" | "error";
      message: string;
    }>
  >;
}> = ({ variant, setToast }) => {
  const queryClient = useQueryClient();

  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const { mutate: deleteMutation, isPending } = useMutation({
    mutationFn: async () => {
      await deleteVariant(variant._id);
    },
    onSuccess: () => {
      queryClient.fetchQuery({
        queryKey: ["MENU_ITEMS"],
        queryFn: getClientMenuItems,
      });

      setIsDeleting(false);

      setToast({
        type: "success",
        message: "Variant deleted successfully",
      });
    },
    onError: () => {
      setIsDeleting(false);
      setToast({
        type: "error",
        message: "Something went wrong, please try again.",
      });
    },
  });

  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 backdrop-blur-sm p-4 shadow transition-all hover:shadow-md dark:bg-muted/60">
      {isDeleting ? (
        <div className="w-full relative grid grid-cols-2 gap-x-2.5">
          {isPending && (
            <div className="absolute -inset-0.5 rounded-sm bg-red-400 dark:bg-red-900 flex items-center justify-center">
              <Loader2
                size={21}
                className="animate-spin opacity-100 dark:opacity-75 text-white"
              />
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsDeleting(false)}
            className="cursor-pointer w-full px-8 py-[13px] text-sm font-medium rounded-sm border border-input bg-transparent text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => deleteMutation()}
            className="cursor-pointer w-full px-8 py-[13px] text-sm font-medium rounded-sm bg-red-500 dark:bg-red-600 text-white hover:bg-red-600 hover:dark:bg-red-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      ) : (
        <Fragment>
          <div className="flex flex-col gap-1">
            <span className="text-base font-semibold text-foreground capitalize">
              {variant.name}
            </span>
            <span className="text-sm text-muted-foreground">
              {formatPriceWithAbbreviation(variant.price)} •{" "}
              <span
                className={`${
                  variant.isAvailable
                    ? "text-green-500"
                    : "text-destructive dark:text-red-400"
                } font-medium`}
              >
                {variant.isAvailable ? "Available" : "Unavailable"}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="border cursor-pointer rounded-full hover:bg-blue-500/10 dark:hover:bg-blue-400/10"
                  aria-label="Edit Variant"
                >
                  <Pencil className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </Button>
              </DialogTrigger>
              <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                  <DialogTitle className="capitalize">
                    Edit Variant - {variant.name}
                  </DialogTitle>
                  <div className="w-20 h-px bg-neutral-300 dark:bg-neutral-900" />
                </DialogHeader>
                <EditVariantForm
                  variant={variant}
                  setEditOpen={setEditOpen}
                  setToast={setToast}
                />
              </DialogContent>
            </Dialog>

            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsDeleting(true)}
              className="border cursor-pointer rounded-full hover:bg-red-500/10 dark:hover:bg-red-400/10"
              aria-label="Delete Variant"
            >
              <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
            </Button>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default VariantCard;
