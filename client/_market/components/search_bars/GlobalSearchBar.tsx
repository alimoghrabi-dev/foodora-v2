"use client";

import React, { Fragment, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn, sanitizeInput } from "@/lib/utils";
import { Search } from "lucide-react";

const GlobalSearchBar: React.FC = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <Fragment>
      <AnimatePresence>
        {isFocused && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsFocused(false)}
            className="fixed inset-0 z-[10000] bg-black/25 backdrop-blur-[2px] cursor-pointer"
          />
        )}
      </AnimatePresence>
      <div
        className={cn("relative w-full", {
          "z-[100001]": isFocused,
        })}
      >
        <div
          className={cn(
            "flex items-center border border-neutral-200/30 rounded-full px-4 h-16 bg-neutral-200/30 transition-all",
            isFocused
              ? "ring-2 ring-primary bg-white"
              : "hover:border-neutral-300"
          )}
        >
          <AnimatePresence>
            {!query && (
              <motion.span
                key="icon"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="text-neutral-500 mr-2.5"
              >
                <Search size={22} />
              </motion.span>
            )}
          </AnimatePresence>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(sanitizeInput(e.target.value))}
            onFocus={() => setIsFocused(true)}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            placeholder="Search for restaurants, cuisines, and dishes"
            className="w-full h-full text-neutral-800 font-medium bg-transparent outline-none text-[15px] placeholder:text-neutral-500 placeholder:font-medium transition-all"
          />
        </div>

        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="absolute mt-2 w-full bg-white border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg p-4"
            >
              {query ? (
                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                  Searching for: <span className="font-semibold">{query}</span>
                </p>
              ) : (
                <p className="text-sm text-neutral-400">
                  Start typing to search...
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Fragment>
  );
};

export default GlobalSearchBar;
