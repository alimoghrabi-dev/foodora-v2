"use client";

import React from "react";
import { cn } from "@/lib/utils";

const CategoryMenuCard: React.FC<{
  category: {
    _id: string;
    name: string;
    itemCount: number;
  };
  activatedCategory: {
    _id: string;
    name: string;
  } | null;
  setActivatedCategory: React.Dispatch<
    React.SetStateAction<{ _id: string; name: string } | null>
  >;
}> = ({ category, activatedCategory, setActivatedCategory }) => {
  const isActive = category._id.toString() === activatedCategory?._id;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (!isActive) {
      setActivatedCategory({
        _id: category._id.toString(),
        name: category.name,
      });
    } else {
      setActivatedCategory(null);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "relative group px-6 cursor-pointer py-3 h-full hover:bg-neutral-200/50 text-neutral-600 rounded-sm transition-all duration-300 ease-in-out flex items-center justify-center gap-x-2",
        isActive ? "text-neutral-900" : "hover:text-neutral-900"
      )}
    >
      <span className="text-base font-medium capitalize flex items-center gap-x-1">
        {category.name}
        <p className="text-sm">
          ({category.itemCount >= 9 ? "9+" : category.itemCount || 0})
        </p>
      </span>
      <div className="absolute bottom-0 inset-x-0 flex items-center justify-center">
        <div
          className={cn(
            "w-10 h-[4px] opacity-0 rounded-full bg-neutral-800 transition-all duration-300 ease-in-out",
            isActive ? "opacity-100 w-full" : "group-hover:opacity-100"
          )}
        />
      </div>
    </button>
  );
};

export default CategoryMenuCard;
