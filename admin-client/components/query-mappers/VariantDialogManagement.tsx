import React, { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import VariantCard from "../cards/VariantCard";
import { cn } from "@/lib/utils";

const VariantDialogManagement: React.FC<{
  variants: {
    _id: string;
    name: string;
    price: number;
    isAvailable: boolean;
  }[];
}> = ({ variants }) => {
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  }>({
    type: "success",
    message: "",
  });

  useEffect(() => {
    if (toast.message) {
      setTimeout(() => {
        setToast({ type: "success", message: "" });
      }, 3500);
    }
  }, [toast]);

  if (!variants || variants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
        <div className="text-4xl">🧩</div>
        <p className="mt-2 text-sm">No variants added yet.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="w-full max-h-[50vh] pr-3">
      {toast.message && (
        <p
          className={cn(
            "w-full mb-1.5 text-center text-sm font-medium",
            toast.type === "success"
              ? "text-green-500"
              : "text-destructive dark:text-red-400"
          )}
        >
          {toast.message}
        </p>
      )}
      <div className="grid gap-2 mt-0.5">
        {variants.map((variant) => (
          <VariantCard
            key={variant._id}
            variant={variant}
            setToast={setToast}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default VariantDialogManagement;
