import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Star, ImageOff } from "lucide-react";
import { cn, formatNumber, formatPriceWithAbbreviation } from "@/lib/utils";
import Link from "next/link";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import VariantDialogManagement from "../query-mappers/VariantDialogManagement";
import QueryWrapper from "../providers/query-wrapper";

interface Props {
  item: IItem;
}

const MenuItemCard: React.FC<Props> = ({ item }) => {
  const IMAGE_WIDTH = 325;
  const IMAGE_HEIGHT = 225;

  return (
    <div
      className={cn(
        "bg-white dark:bg-neutral-950 rounded-xl shadow-md border border-neutral-200 dark:border-neutral-800",
        "hover:shadow-lg transition-all duration-300 overflow-hidden w-[325px]"
      )}
    >
      <div className="relative w-full h-auto">
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
          <span className="font-medium text-primary">
            {formatPriceWithAbbreviation(item.price)}
          </span>
          <Badge variant="secondary">{item.category.name}</Badge>
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
