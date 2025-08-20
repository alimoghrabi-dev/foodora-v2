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

const AddToFavoritesButtonInPage: React.FC<{
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

  const buttonColors = {
    default: "border-neutral-500 text-neutral-800 hover:bg-neutral-100",
    added: "border-green-500 text-green-700 bg-green-100",
    removed: "border-red-500 text-neutral-50 bg-red-400",
    remove: "border-red-300 text-red-500 bg-neutral-50 hover:bg-red-50",
  };

  return (
    <motion.button
      type="button"
      disabled={status === "added"}
      onClick={(e) => handleClick(e, status === "remove" ? false : true)}
      title={
        status === "added"
          ? "Added to Favorites"
          : status === "remove"
          ? "Remove from Favorites"
          : "Add to Favorites"
      }
      className={`relative px-5 py-2.5 border rounded-md hidden lg:flex items-center gap-x-2.5 transition-colors cursor-pointer ${
        buttonColors[status]
      } ${status === "added" ? "pointer-events-none cursor-default" : ""}`}
      whileTap={{ scale: 0.95 }}
      animate={{
        scale: status === "added" || status === "removed" ? 1.1 : 1,
        transition: { type: "spring", stiffness: 300, damping: 15 },
      }}
    >
      {status === "added" ? (
        <HeartPlus size={21} />
      ) : status === "remove" ? (
        <HeartOff size={21} />
      ) : status === "removed" ? (
        <HeartOff size={21} />
      ) : (
        <HeartPlus size={21} />
      )}

      <p className="text-base font-medium">
        {status === "added"
          ? "Added to Favorites!"
          : status === "remove"
          ? "Remove from Favorites"
          : status === "removed"
          ? "Removed from Favorites"
          : "Add to Favorites"}
      </p>

      <AnimatePresence>
        {showSparkles && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.span
                key={i}
                className={cn(
                  "absolute w-2 h-2 bg-green-600 rounded-full",
                  status === "added" ? "bg-green-600" : "bg-red-600"
                )}
                style={{
                  top: `${Math.random() * 75}%`,
                  left: `${Math.random() * 100}%`,
                }}
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1, 0], opacity: [1, 1, 0] }}
                transition={{
                  duration: 1,
                  delay: i * 0.05,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default AddToFavoritesButtonInPage;
