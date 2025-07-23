"use client";

import { RefreshCcw } from "lucide-react";
import React from "react";

const OrdersRefreshButton: React.FC = () => {
  return (
    <button
      type="button"
      className="cursor-pointer flex items-center justify-center gap-x-2 bg-transparent hover:bg-neutral-200 dark:hover:bg-neutral-900 px-5 py-2 rounded-full transition-all"
    >
      <RefreshCcw
        size={18}
        className="text-neutral-800 dark:text-neutral-100"
      />
      <span className="text-neutral-800 dark:text-neutral-100 text-base font-medium">
        Refresh
      </span>
    </button>
  );
};

export default OrdersRefreshButton;
