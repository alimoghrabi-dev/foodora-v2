"use client";

import React, { useState } from "react";
import { ImageOff } from "lucide-react";
import { formatPriceWithAbbreviation } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import ApplyItemSaleForm from "../forms/ApplyItemSaleForm";
import Image from "next/image";
import { MdDiscount } from "react-icons/md";

const IMAGE_WIDTH = 170;
const IMAGE_HEIGHT = 155;

const NotOnSaleItemCard: React.FC<{
  item: IItem;
}> = ({ item }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="w-full p-4 rounded-md border bg-neutral-50 dark:bg-neutral-950">
      <div className="flex items-start gap-2">
        <div
          style={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }}
          className="relative"
        >
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.title}
              className="rounded-sm object-cover"
              priority
              fill
            />
          ) : (
            <div
              style={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }}
              className="rounded-sm flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
            >
              <div className="flex flex-col items-center gap-2">
                <ImageOff size={30} />
                <span className="text-[12px] font-medium">
                  No image available
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-y-1.5">
          <span className="text-lg font-medium text-neutral-800 dark:text-neutral-100 line-clamp-1 capitalize">
            {item.title}
          </span>
          <p className="line-clamp-2 max-w-[225px] break-words text-[13px] font-normal text-neutral-600 dark:text-neutral-400">
            {item.description}
          </p>
          <p className="text-primary text-base font-medium mt-1">
            {formatPriceWithAbbreviation(item.price)}
          </p>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button
                className="mt-4 w-fit text-sm flex items-center gap-x-2 bg-primary text-neutral-50 font-medium px-3 py-2 rounded-md shadow-lg cursor-pointer hover:bg-primary/80 transition-colors"
                onClick={() => {
                  setOpen(true);
                }}
                type="button"
              >
                <MdDiscount size={18} />
                Apply Sale
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
                setOpen={setOpen}
                isSaleManagementPage
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default NotOnSaleItemCard;
