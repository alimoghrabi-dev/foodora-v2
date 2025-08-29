"use client";

import React, { Fragment, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, formatNumber, formatPriceWithAbbreviation } from "@/lib/utils";
import ItemVariantFetcher from "../client_renderers/ItemVariantFetcher";
import { Button } from "@/components/ui/button";
import { CheckCircle, ChevronDown, Loader2, Minus, Plus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { addItemToCart } from "@/_market/lib/client-actions";
import ItemAddonFetcher from "../client_renderers/ItemAddonFetcher";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddToCartButton from "./AddToCartButton";
import { refetchSessionCookie } from "@/lib/session-updates";

const MAX_VISIBLE = 4;

const AddToCartDialog: React.FC<{
  item: IMenuItem;
}> = ({ item }) => {
  const itemVariants = item.variants || [];
  const itemAddons = item.addons || [];

  const [open, setOpen] = useState<boolean>(false);
  const [selectedVariants, setSelectedVariants] = useState<
    {
      variantId: string;
      name: string;
      optionId: string;
      optionName: string;
      price: number;
    }[]
  >([]);

  const [selectedAddons, setSelectedAddons] = useState<
    {
      addonId: string;
      name: string;
      price: number;
    }[]
  >([]);

  const [quantity, setQuantity] = useState<number>(1);
  const [success, setSuccess] = useState<boolean>(false);
  const [showAll, setShowAll] = useState<boolean>(false);

  const [status, setStatus] = useState<"default" | "added">("default");

  const visibleAddons = showAll ? itemAddons : itemAddons.slice(0, MAX_VISIBLE);

  const handleVariantChange = (
    variantId: string,
    variantName: string,
    optionId: string,
    optionName: string,
    price: number
  ) => {
    setSelectedVariants((prev) => {
      const filtered = prev.filter((v) => v.variantId !== variantId);
      return [
        ...filtered,
        { variantId, name: variantName, optionId, optionName, price },
      ];
    });
  };

  const handleAddonChange = (
    addonId: string,
    addonName: string,
    price: number
  ) => {
    setSelectedAddons((prev) => {
      const exists = prev.some((v) => v.addonId === addonId);
      if (exists) {
        return prev.filter((v) => v.addonId !== addonId);
      } else {
        return [...prev, { addonId, name: addonName, price }];
      }
    });
  };

  const isButtonDisabled = itemVariants.some(
    (variant) =>
      variant.isRequired &&
      !selectedVariants.some((v) => v.variantId === variant._id)
  );

  const { mutate: addToCartMutation, isPending } = useMutation({
    mutationFn: async () => {
      await addItemToCart(item._id, {
        restaurantId: item.restaurantId,
        quantity,
        selectedVariants,
        selectedAddons,
      });
    },
    onSuccess: async () => {
      await refetchSessionCookie();

      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        setSelectedVariants([]);
        setSelectedAddons([]);
        setQuantity(1);
        setOpen(false);
      }, 2250);

      setStatus("default");
    },
    onError: () => {
      setOpen(false);

      setStatus("default");
      toast.error("Something went wrong while adding item to cart!", {
        style: { color: "#fff", background: "#e7000b" },
      });
    },
  });

  const handleCartButtonClick = () => {
    addToCartMutation();
  };

  return (
    <Fragment>
      <AddToCartButton
        itemVariantsLength={itemVariants.length}
        itemAddonsLength={itemAddons.length}
        setOpen={setOpen}
        handleCartButtonClick={handleCartButtonClick}
        status={status}
        setStatus={setStatus}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="capitalize">{item.title}</DialogTitle>
          </DialogHeader>
          <div className="w-full h-px bg-neutral-300/50" />

          <Fragment>
            <ScrollArea className="w-full max-h-[62.5vh] pr-2">
              <div className="w-full flex flex-col gap-y-4">
                <span className="text-base font-bold text-primary">
                  {formatPriceWithAbbreviation(item.price)}
                </span>
                <p className="text-neutral-600 font-normal text-sm">
                  {item.description}
                </p>
              </div>
              <div className="mt-5 w-full flex flex-col gap-y-4">
                {itemVariants.map((variant) => (
                  <ItemVariantFetcher
                    key={variant._id}
                    variant={variant}
                    selectedOption={
                      selectedVariants.find((v) => v.variantId === variant._id)
                        ?.optionId
                    }
                    onChange={handleVariantChange}
                  />
                ))}
              </div>
              <div className="mt-5 w-full flex flex-col gap-y-4 pb-1">
                <h4 className="text-lg font-semibold text-neutral-900">
                  Addons - {formatNumber(itemAddons.length) || 0}
                </h4>
                {visibleAddons.map((addon) => (
                  <ItemAddonFetcher
                    key={addon._id}
                    addon={addon}
                    selectedAddons={selectedAddons.map((a) => a.addonId)}
                    onChange={handleAddonChange}
                  />
                ))}

                {itemAddons.length > MAX_VISIBLE && (
                  <button
                    type="button"
                    className="w-fit flex items-center gap-x-1.5 cursor-pointer hover:bg-primary/10 text-green-900 px-2 py-1 rounded-md transition-all text-sm font-medium"
                    onClick={() => setShowAll((prev) => !prev)}
                  >
                    <ChevronDown
                      size={18}
                      className={cn("transition duration-150", {
                        "rotate-180": showAll,
                      })}
                    />

                    {showAll
                      ? "Show less"
                      : `View ${formatNumber(
                          itemAddons.length - MAX_VISIBLE
                        )} more`}
                  </button>
                )}
              </div>
            </ScrollArea>
            <div className="w-full border-t border-neutral-300/50 flex items-center gap-x-3 pt-2.5">
              <div className="flex items-center gap-x-2">
                <button
                  type="button"
                  disabled={quantity === 1}
                  onClick={() => {
                    if (quantity === 1) return;

                    setQuantity((prev) => prev - 1);
                  }}
                  className="disabled:cursor-not-allowed disabled:opacity-50 p-1 rounded-full border border-neutral-400/80 bg-white cursor-pointer hover:border-neutral-400/70 hover:bg-neutral-200/50 transition-all"
                >
                  <Minus size={18} className="text-neutral-900" />
                </button>
                <span className="text-[16px] w-4 flex items-center justify-center font-semibold text-neutral-900 transition-all">
                  {formatNumber(quantity)}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="disabled:cursor-not-allowed disabled:opacity-50 p-1 rounded-full border border-neutral-400/80 bg-white cursor-pointer hover:border-neutral-400/70 hover:bg-neutral-200/50 transition-all"
                >
                  <Plus size={18} className="text-neutral-900" />
                </button>
              </div>
              <Button
                type="button"
                disabled={isButtonDisabled || isPending}
                onClick={() => handleCartButtonClick()}
                className={cn(
                  "flex-1 text-[16px] rounded-sm font-semibold py-[22px] relative overflow-hidden disabled:bg-neutral-600",
                  {
                    "pointer-events-none cursor-not-allowed": success,
                  }
                )}
              >
                <AnimatePresence mode="wait">
                  {isPending ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <Loader2 className="animate-spin" />
                    </motion.div>
                  ) : success ? (
                    <motion.div
                      key="success"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 215,
                        damping: 18,
                      }}
                      className="flex items-center justify-center gap-x-2 text-white"
                    >
                      <CheckCircle size={24} />
                      <span>Added Successfully!</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="default"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center justify-center"
                    >
                      Add to Cart
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </Fragment>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default AddToCartDialog;
