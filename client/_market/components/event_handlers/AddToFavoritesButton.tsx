"use client";

import React, { useState } from "react";
import { HeartOff, HeartPlus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import {
  addFavoriteAction,
  removeFavoriteAction,
} from "@/_market/lib/client-actions";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const AddToFavoritesButton: React.FC<{
  restaurantId: string;
  favBtnState: "default" | "remove";
}> = ({ restaurantId, favBtnState }) => {
  const [showSparkles, setShowSparkles] = useState<boolean>(false);
  const [status, setStatus] = useState<
    "default" | "added" | "removed" | "remove"
  >(favBtnState || "default");

  const { mutate: toggleFavoriteMutation } = useMutation({
    mutationFn: async (isAdding: boolean) => {
      if (isAdding) {
        await addFavoriteAction(restaurantId);
      } else {
        await removeFavoriteAction(restaurantId);
      }

      return isAdding;
    },
    onSuccess: (isAdding: boolean) => {
      setTimeout(() => {
        setStatus(isAdding ? "remove" : "default");
      }, 900);
    },
    onError: () => {
      setStatus(favBtnState || "default");

      toast.error(
        "Something went wrong while adding restaurant to your favorites!",
        {
          style: {
            color: "#fff",
            background: "#e7000b",
          },
        }
      );
    },
  });

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    isAdding: boolean
  ) => {
    e.stopPropagation();
    e.preventDefault();

    if (isAdding) {
      setStatus("added");
    } else {
      setStatus("removed");
    }

    setShowSparkles(true);

    setTimeout(() => setShowSparkles(false), 1000);

    toggleFavoriteMutation(isAdding);
  };

  return (
    <motion.button
      type="button"
      onClick={(e) => handleClick(e, status === "remove" ? false : true)}
      title={
        status === "added"
          ? "Added!"
          : status === "remove"
          ? "Remove from Favorites"
          : "Add to Favorites"
      }
      className={cn(
        "absolute right-2 top-2 backdrop-blur-lg rounded-full p-1.5 border z-50 cursor-pointer transition-all",
        status === "added" && "bg-green-100 border-green-500",
        status === "removed" && "bg-red-200 border-red-500",
        status === "remove"
          ? "bg-red-500 border-red-500 hover:bg-red-400"
          : "bg-white/95 border-neutral-300 hover:bg-neutral-100/85"
      )}
    >
      <AnimatePresence>
        {showSparkles && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.span
                key={i}
                className={cn(
                  "absolute w-2 h-2 rounded-full",
                  status === "added" ? "bg-green-500" : "bg-red-500"
                )}
                style={{
                  top: `${Math.random() * 75}%`,
                  left: `${Math.random() * 100}%`,
                }}
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1, 0], opacity: [1, 1, 0] }}
                transition={{ duration: 1, delay: i * 0.05, ease: "easeOut" }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {status === "added" || status === "removed" ? (
        status === "added" ? (
          <HeartPlus size={17} className="text-green-700" />
        ) : (
          <HeartOff size={17} className="text-red-500" />
        )
      ) : status === "remove" ? (
        <HeartOff size={17} className="text-white" />
      ) : (
        <HeartPlus size={17} className="text-neutral-900" />
      )}
    </motion.button>
  );
};

export default AddToFavoritesButton;
