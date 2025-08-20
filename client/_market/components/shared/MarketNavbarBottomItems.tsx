"use client";

import React from "react";
import { navbarBottomLinks } from "@/constants/constants";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const MarketNavbarBottomItems: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-x-4 h-1/2">
      {navbarBottomLinks.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.label}
            href={link.href}
            className={cn(
              "relative group px-4 h-full text-neutral-600 rounded-sm transition-all duration-300 ease-in-out flex items-center justify-center gap-x-2",
              isActive
                ? "text-neutral-900 cursor-default"
                : "hover:text-neutral-900 hover:bg-neutral-200/50"
            )}
          >
            <link.icon size={22} />
            <span className="text-base font-medium">{link.label}</span>
            <div className="absolute bottom-0 inset-x-0 flex items-center justify-center">
              <div
                className={cn(
                  "w-10 h-[4px] opacity-0 rounded-full bg-neutral-800 transition-all duration-300 ease-in-out",
                  isActive ? "opacity-100 w-full" : "group-hover:opacity-100"
                )}
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default MarketNavbarBottomItems;
