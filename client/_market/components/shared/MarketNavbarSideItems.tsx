"use client";

import React, { Fragment } from "react";
import { usePathname } from "next/navigation";
import { Heart, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const MarketNavbarSideItems: React.FC<{
  user: IUser | null;
}> = ({ user }) => {
  const pathname = usePathname();

  const isCartDisabled = user?.carts?.length === 0 || !user?.carts;
  const cartsLength = user?.carts?.length || 0;

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
        href="/market/carts"
        title="Carts"
        className={cn(
          "size-10 relative rounded-full flex items-center justify-center transition-all duration-200 ease-in-out",
          pathname === "/market/carts"
            ? "bg-neutral-700 cursor-default"
            : "hover:bg-neutral-200/50",
          {
            "pointer-events-none opacity-60 bg-neutral-200/50 cursor-not-allowed":
              isCartDisabled,
          }
        )}
      >
        <ShoppingBag
          size={21}
          className={cn("text-neutral-800", {
            "text-white": pathname === "/market/carts",
          })}
        />
        {cartsLength > 0 && (
          <div className="absolute size-5 rounded-full flex items-center justify-center ring-2 ring-white -top-1 -right-2 bg-neutral-600 text-xs font-bold text-white">
            {cartsLength > 9 ? "+9" : cartsLength}
          </div>
        )}
      </Link>
    </Fragment>
  );
};

export default MarketNavbarSideItems;
