"use client";

import React from "react";
import { Search } from "lucide-react";

const MenuSearchbarInPage: React.FC = () => {
  return (
    <div className="w-full sm:w-fit relative px-px group">
      <input
        type="text"
        placeholder="Search in menu"
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        className="w-full rounded-full bg-neutral-200/70 px-4 py-2 pl-9 text-sm outline-none placeholder:text-neutral-500 font-medium group-hover:ring group-hover:ring-neutral-400/60 focus-visible:ring focus-visible:ring-primary transition-all"
      />
      <Search
        size={17}
        className="text-neutral-600 absolute left-3.5 top-1/2 -translate-y-1/2 group-hover:text-neutral-900 transition"
      />
    </div>
  );
};

export default MenuSearchbarInPage;
