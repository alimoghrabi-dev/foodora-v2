"use client";

import React, { Fragment, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TbLayoutSidebarRightExpand,
  TbLayoutSidebarLeftExpand,
} from "react-icons/tb";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { SideLinks } from "@/constants/constants";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Loader2, LogOut } from "lucide-react";
import { logout } from "@/lib/actions/client.actions";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";

const sidebarVariants = {
  expanded: {
    width: 224,
    transition: {
      type: "spring",
      duration: 0.4,
      bounce: 0.2,
    },
  },
  collapsed: {
    width: 80,
    transition: {
      type: "spring",
      duration: 0.4,
      bounce: 0.2,
    },
  },
};

const contentVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.1,
      duration: 0.3,
    },
  },
  exit: { opacity: 0, x: -10, transition: { duration: 0.2 } },
};

const AdminSidebar: React.FC<{
  logo: string | undefined;
  restaurantFirstNameLetter: string;
  isPublished: boolean;
}> = ({ logo, restaurantFirstNameLetter, isPublished }) => {
  const pathname = usePathname();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState<boolean>(false);

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  const { mutate: logoutMutation, isPending } = useMutation({
    mutationFn: async () => {
      await logout();
    },
    onSuccess: () => {
      router.push("/");
    },
    onError: () => {
      toast.error("Something went wrong while logging out. Please try again.");
    },
  });

  return (
    <motion.div
      variants={sidebarVariants}
      initial={false}
      animate={collapsed ? "collapsed" : "expanded"}
      className="w-full h-screen px-4 py-7 hidden sm:flex"
    >
      <AnimatePresence>
        <div className="w-full h-full flex flex-col justify-between">
          <div className="w-full flex flex-col gap-y-12">
            <div
              className={cn(
                "w-full flex items-center justify-between gap-x-4",
                {
                  "justify-center": collapsed,
                }
              )}
            >
              {!collapsed ? (
                !logo ? (
                  <motion.div
                    key="nav-content"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="size-10 rounded-full shadow bg-primary text-neutral-100 font-semibold uppercase text-xl flex items-center justify-center"
                  >
                    {restaurantFirstNameLetter}
                  </motion.div>
                ) : (
                  <motion.div
                    key="nav-content"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="size-10 rounded-full relative shadow"
                  >
                    <Image
                      src={logo}
                      alt="logo"
                      fill
                      priority
                      className="object-cover rounded-full"
                    />
                  </motion.div>
                )
              ) : null}
              <TooltipProvider delayDuration={100} skipDelayDuration={50}>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <button type="button" onClick={toggleSidebar}>
                      <motion.div
                        key={collapsed ? "collapsed" : "expanded"}
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {collapsed ? (
                          <TbLayoutSidebarLeftExpand
                            size={24}
                            className="text-neutral-800 dark:text-neutral-200 hover:text-neutral-600/85 hover:dark:text-neutral-300/90 transition cursor-pointer"
                          />
                        ) : (
                          <TbLayoutSidebarRightExpand
                            size={24}
                            className="text-neutral-800 dark:text-neutral-200 hover:text-neutral-600/85 hover:dark:text-neutral-300/90 transition cursor-pointer"
                          />
                        )}
                      </motion.div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="px-2 py-[5px]" side="right">
                    <p>{collapsed ? "Expand" : "Collapse"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="w-full flex flex-col gap-y-1">
              {SideLinks.map((link) => {
                const isActive = link.href === pathname;

                return (
                  <TooltipProvider key={link.label}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={link.href}
                          className={cn(
                            "w-full p-2 flex items-center justify-start border border-transparent gap-x-3.5 rounded-sm transition-all",
                            {
                              "bg-white/70 dark:bg-neutral-950 border-neutral-300/60 dark:border-neutral-900":
                                isActive,
                              "hover:bg-white/40 hover:dark:bg-neutral-800/40 hover:shadow-sm":
                                !isActive,
                              "justify-center": collapsed,
                              "pointer-events-none opacity-50":
                                link.isDisabledByPublish && !isPublished,
                            }
                          )}
                        >
                          <link.icon
                            size={24}
                            className="text-neutral-600 dark:text-neutral-300"
                          />
                          {!collapsed && (
                            <motion.p
                              key="nav-content"
                              variants={contentVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              className="text-neutral-700 dark:text-neutral-300 font-medium text-[17px]"
                            >
                              {link.label}
                            </motion.p>
                          )}
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent
                        className={cn("px-2 py-[5px]", {
                          hidden: !collapsed,
                        })}
                        side="right"
                      >
                        <p>{link.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          </div>
          <div className="w-full flex flex-col gap-y-2">
            <button
              type="button"
              onClick={() => logoutMutation()}
              disabled={isPending}
              className={cn(
                "w-full p-2 flex items-center justify-start gap-x-3.5 outline-none bg-white/70 dark:bg-neutral-950 border border-neutral-300/60 dark:border-neutral-900 rounded-sm transition-all cursor-pointer hover:bg-neutral-100 hover:border-neutral-300 hover:dark:bg-neutral-950/75 disabled:opacity-60",
                {
                  "justify-center": collapsed || isPending,
                }
              )}
            >
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Fragment>
                  <LogOut
                    size={24}
                    className="text-neutral-700 dark:text-neutral-200"
                  />
                  {!collapsed && (
                    <motion.p
                      key="nav-b-content"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="text-neutral-800 dark:text-neutral-200 font-medium text-[17px]"
                    >
                      Log out
                    </motion.p>
                  )}
                </Fragment>
              )}
            </button>
          </div>
        </div>
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminSidebar;
