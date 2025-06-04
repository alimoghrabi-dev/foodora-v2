"use client";

import React, { useState } from "react";
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
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

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

const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState<boolean>(false);

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  return (
    <motion.div
      variants={sidebarVariants}
      animate={collapsed ? "collapsed" : "expanded"}
      className="w-full h-screen px-4 py-7 flex flex-col justify-between"
    >
      <AnimatePresence>
        <div className="w-full flex flex-col gap-y-12">
          <div
            className={cn("w-full flex items-center justify-between gap-x-4", {
              "justify-center": collapsed,
            })}
          >
            {!collapsed && (
              <motion.div
                key="nav-content"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                LOGO
              </motion.div>
            )}
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
                          className="text-neutral-800 hover:text-neutral-600/85 transition cursor-pointer"
                        />
                      ) : (
                        <TbLayoutSidebarRightExpand
                          size={24}
                          className="text-neutral-800 hover:text-neutral-600/85 transition cursor-pointer"
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
          <div className="w-full flex flex-col gap-y-2">
            {SideLinks.map((link) => {
              const isActive = link.href === pathname;

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "w-full p-2 flex items-center justify-start gap-x-3.5 rounded-sm transition-all",
                    {
                      "bg-white/70 border border-neutral-300/60": isActive,
                      "hover:bg-white/40 hover:shadow-sm": !isActive,
                      "justify-center": collapsed,
                    }
                  )}
                >
                  <link.icon size={24} className="text-neutral-600" />
                  {!collapsed && (
                    <motion.p
                      key="nav-content"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="text-neutral-700 font-medium text-[17px]"
                    >
                      {link.label}
                    </motion.p>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminSidebar;
