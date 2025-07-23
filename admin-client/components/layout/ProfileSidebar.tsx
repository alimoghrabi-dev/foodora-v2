"use client";

import React, { Fragment } from "react";
import { ProfileSideLinks } from "@/constants/constants";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useIsMediumUp } from "@/hooks/useIsMediumUp";
import Link from "next/link";
import { cn } from "@/lib/utils";

const ProfileSidebar: React.FC = () => {
  const pathname = usePathname();
  const isMdUp = useIsMediumUp();

  return (
    <nav className="h-20 md:h-full w-full md:w-20 border rounded-lg bg-neutral-100/80 dark:bg-neutral-950">
      <div className="flex flex-row md:flex-col items-center gap-1.5 p-3">
        {ProfileSideLinks.map((link, index) => {
          const isActive = link.href === pathname;

          return (
            <Fragment key={index}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={link.href}
                      className={cn(
                        "w-fit p-4 flex items-center justify-center border border-transparent gap-x-3.5 rounded-sm transition-all",
                        {
                          "bg-white dark:bg-neutral-900 border-neutral-300/60 dark:border-neutral-900":
                            isActive,
                          "hover:bg-white/90 hover:dark:bg-neutral-800/40 hover:shadow-sm":
                            !isActive,
                        }
                      )}
                    >
                      <link.icon
                        size={22}
                        className="text-neutral-600 dark:text-neutral-300"
                      />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent
                    className="px-2 py-[5px]"
                    side={isMdUp ? "right" : "top"}
                  >
                    <p>{link.label}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {index !== ProfileSideLinks.length - 1 && (
                <div className="w-px md:w-full h-12 md:h-px bg-neutral-300 dark:bg-neutral-900" />
              )}
            </Fragment>
          );
        })}
      </div>
    </nav>
  );
};

export default ProfileSidebar;
