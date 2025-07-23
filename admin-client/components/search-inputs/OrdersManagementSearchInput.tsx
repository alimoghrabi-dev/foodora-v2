"use client";

import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

const OrdersManagementSearchInput: React.FC = () => {
  return (
    <div className="w-full md:max-w-xl bg-neutral-200 dark:bg-black/60 rounded-full pl-4 flex items-center gap-x-3 hover:bg-neutral-200/65 dark:hover:bg-neutral-950 focus-within:ring-1 focus-within:ring-neutral-500 dark:focus-within:ring-neutral-800 transition-all">
      <FaMagnifyingGlass
        size={15}
        className="text-neutral-800 dark:text-neutral-100"
      />
      <input
        type="text"
        placeholder="Search for orders..."
        className="flex-1 bg-transparent text-[15px] py-2 font-medium placeholder:font-normal outline-none placeholder:text-neutral-800 dark:placeholder:text-neutral-400"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
      />
    </div>
  );
};

export default OrdersManagementSearchInput;
