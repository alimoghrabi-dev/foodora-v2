"use client";

import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

const sparkles = Array.from({ length: 10 });

const AddToCartButton: React.FC<{
  itemVariantsLength: number;
  itemAddonsLength: number;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleCartButtonClick: () => void;
  status: "default" | "added";
  setStatus: React.Dispatch<React.SetStateAction<"default" | "added">>;
}> = ({
  itemVariantsLength,
  itemAddonsLength,
  setOpen,
  handleCartButtonClick,
  status,
  setStatus,
}) => {
  const [showSparkles, setShowSparkles] = useState<boolean>(false);

  const triggerSparkles = () => {
    setShowSparkles(true);
    setTimeout(() => setShowSparkles(false), 600);
  };

  return (
    <TooltipProvider delayDuration={100} skipDelayDuration={50}>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                if (itemVariantsLength > 0 || itemAddonsLength > 0) {
                  setOpen(true);
                } else {
                  setStatus("added");
                  handleCartButtonClick();
                  triggerSparkles();
                }
              }}
              className={cn(
                "size-[32px] cursor-pointer hover:scale-105 transition-all hover:bg-neutral-200/75 backdrop-blur-2xl bg-white rounded-full border border-neutral-400/80 shadow-md flex items-center justify-center",
                {
                  "bg-green-50 border-green-500 cursor-default pointer-events-none":
                    status === "added",
                }
              )}
            >
              {status === "added" ? (
                <Plus size={17} className="text-green-700" />
              ) : (
                <Plus size={17} className="text-neutral-900" />
              )}
            </button>

            <AnimatePresence>
              {showSparkles &&
                sparkles.map((_, i) => {
                  const angle = (i / sparkles.length) * Math.PI * 2;
                  const x = Math.cos(angle) * 40;
                  const y = Math.sin(angle) * 40;

                  return (
                    <motion.span
                      key={i}
                      initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                      animate={{ x, y, scale: 1, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 0.5,
                        ease: "easeOut",
                      }}
                      className="absolute top-[13px] left-[13px] w-2 h-2 rounded-full bg-green-400 shadow-lg"
                    />
                  );
                })}
            </AnimatePresence>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="font-medium">
            {status === "added" ? "Added to cart" : "Add to cart"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AddToCartButton;
