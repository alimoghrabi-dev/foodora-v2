"use client";

import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const MenuItemsError: React.FC = () => {
  const router = useRouter();

  return (
    <section className="w-full h-[60vh] flex flex-col justify-center items-center text-center px-4">
      <div className="max-w-md">
        <h1 className="text-4xl sm:text-5xl font-bold text-red-600 mb-4">
          Oops!
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 mb-3.5 font-normal text-center">
          Something went wrong while loading your menu items.
        </p>

        <div className="flex justify-center gap-4">
          <Button
            onClick={() => router.refresh()}
            className="bg-neutral-700 hover:bg-neutral-600 rounded-sm cursor-pointer text-base"
          >
            Try Again
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MenuItemsError;
