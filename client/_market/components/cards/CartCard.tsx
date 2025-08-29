"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState } from "react";
import AnimatedBackground from "../shared/AnimatedBackground";
import { Calendar, DollarSign, Loader2, Package, Trash2 } from "lucide-react";
import { formatNumber, formatPriceWithAbbreviation } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteWholeCartAction,
  getClientUserCarts,
} from "@/_market/lib/client-actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CartCard: React.FC<{
  cart: {
    _id: string;
    restaurantId: IRestaurant;
    totalPrice: number;
    itemsCount: number;
    isAutoClosed: boolean;
    createdAt: Date;
  };
  index: number;
}> = ({ cart, index }) => {
  const queryClient = useQueryClient();

  const [oepn, setOpen] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const isClosed = cart.isAutoClosed || false;

  const { mutate: deleteCartMutation, isPending } = useMutation({
    mutationFn: async () => {
      await deleteWholeCartAction(cart._id);
    },
    onSuccess: () => {
      queryClient.fetchQuery({
        queryKey: ["MY_CARTS"],
        queryFn: getClientUserCarts,
      });

      setOpen(false);
      toast.success("Cart deleted successfully!", {
        style: {
          color: "#fff",
          background: "#0ec420",
        },
      });
    },
    onError: () => {
      setOpen(false);
      toast.error("Something went wrong while deleting cart!", {
        style: {
          color: "#fff",
          background: "#e7000b",
        },
      });
    },
  });

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative shadow-none rounded-2xl transition-all border gap-y-4 z-50 overflow-hidden
    ${
      isClosed
        ? "bg-neutral-100/70 border-neutral-300 opacity-90 hover:bg-neutral-100/70 cursor-not-allowed"
        : "hover:bg-neutral-50/70 hover:shadow-sm"
    }`}
    >
      <AnimatedBackground />
      <AlertDialog open={oepn} onOpenChange={setOpen}>
        <AlertDialogContent aria-describedby={undefined}>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will delete the cart with all its items from our
              database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isPending}
              className="font-medium cursor-pointer"
            >
              Cancel
            </AlertDialogCancel>
            <Button
              type="button"
              onClick={() => deleteCartMutation()}
              disabled={isPending}
              className="w-28 font-medium bg-red-500 hover:bg-red-400 transition-all cursor-pointer"
            >
              {isPending ? <Loader2 className="animate-spin" /> : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AnimatePresence>
        {isHovered && (
          <motion.button
            type="button"
            title="Delete cart"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.175, ease: "easeOut" }}
            className="absolute top-2 right-2 z-[80] bg-destructive p-1.5 rounded-sm text-white cursor-pointer hover:bg-destructive/85"
          >
            <Trash2 size={17} />
          </motion.button>
        )}
      </AnimatePresence>
      <CardHeader>
        <p className="text-xs text-muted-foreground underline underline-offset-2">
          Cart ID: {cart._id}
        </p>
        <CardTitle className="flex items-center gap-3 mt-1 z-50">
          <div className="size-16 relative">
            {cart.restaurantId.logo ? (
              <Image
                src={cart.restaurantId.logo}
                alt={cart.restaurantId._id}
                className="rounded-xl object-cover"
                fill
              />
            ) : (
              <div className="w-full h-full rounded-xl bg-neutral-200/50 flex items-center justify-center">
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
          <span
            className={`text-xl font-bold line-clamp-1 ${
              isClosed ? "text-neutral-500" : "text-neutral-900"
            }`}
          >
            {index + 1}#{cart.restaurantId.name}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 z-50">
        <div className="flex items-center gap-2 text-sm">
          <Package className="w-4 h-4 text-muted-foreground" />
          <span
            className={`text-sm font-medium ${
              isClosed ? "text-neutral-500" : "text-neutral-700"
            }`}
          >
            {formatNumber(cart.itemsCount)} items
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-muted-foreground" />
          <span
            className={`font-semibold ${
              isClosed ? "text-neutral-500" : "text-neutral-900"
            }`}
          >
            {formatPriceWithAbbreviation(cart.totalPrice)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span
            className={`text-sm font-medium ${
              isClosed ? "text-neutral-500" : "text-neutral-700"
            }`}
          >
            {new Date(cart.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        {isClosed && (
          <div className="px-3 py-1 inline-flex items-center justify-center rounded-full text-xs font-medium bg-red-100 text-red-600">
            Restaurant Closed
          </div>
        )}
      </CardContent>

      <CardFooter>
        {isClosed ? (
          <Link
            href={`/market/carts/${cart._id}`}
            className="w-full bg-neutral-900 z-[60] cursor-pointer text-neutral-100 hover:bg-neutral-700 text-[15px] font-semibold py-2 rounded-md text-center transition"
          >
            <AnimatePresence mode="wait">
              {isHovered ? (
                <motion.span
                  key="view"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="block"
                >
                  View Cart
                </motion.span>
              ) : (
                <motion.span
                  key="closed"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="block"
                >
                  Closed
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        ) : (
          <Link
            href={`/market/carts/${cart._id}`}
            className="w-full bg-primary text-white text-[15px] font-semibold py-2 rounded-md hover:opacity-85 select-none transition duration-100 text-center active:bg-primary/70 z-50"
          >
            View Cart
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};

export default CartCard;
