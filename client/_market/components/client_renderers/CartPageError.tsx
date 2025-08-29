"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

const CartPageError: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-3 px-4">
      <AlertTriangle className="size-11 sm:size-12 text-red-500 animate-pulse" />
      <h2 className="text-lg sm:text-xl font-semibold text-red-600">
        Oops! Failed to fetch your cart
      </h2>
      <p className="text-sm text-muted-foreground text-center max-w-sm">
        Something went wrong while fetching your cart. Please try again in a
        moment.
      </p>
      <Button
        type="button"
        onClick={() => router.refresh()}
        className="flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Retry
      </Button>
    </div>
  );
};

export default CartPageError;
