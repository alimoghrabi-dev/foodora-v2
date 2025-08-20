"use client";

import React, { Fragment } from "react";
import { usePathname } from "next/navigation";
import { Heart, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const MarketNavbarSideItems: React.FC = () => {
  const pathname = usePathname();

  return (
    <Fragment>
      <Link
        href="/market/favorites"
        title="Favorites"
        className={cn(
          "size-10 rounded-full flex items-center justify-center transition-all duration-200 ease-in-out",
          pathname === "/market/favorites"
            ? "bg-primary/75 cursor-default"
            : "hover:bg-neutral-200/50"
        )}
      >
        <Heart
          size={21}
          className={cn("text-neutral-800", {
            "text-white fill-white": pathname === "/market/favorites",
          })}
        />
      </Link>
      <Link
        href="/market/cart"
        title="Carts"
        className={cn(
          "size-10 rounded-full flex items-center justify-center transition-all duration-200 ease-in-out",
          pathname === "/market/cart"
            ? "bg-neutral-700 cursor-default"
            : "hover:bg-neutral-200/50"
        )}
      >
        <ShoppingBag
          size={21}
          className={cn("text-neutral-800", {
            "text-white": pathname === "/market/cart",
          })}
        />
      </Link>
    </Fragment>
  );
};

export default MarketNavbarSideItems;
