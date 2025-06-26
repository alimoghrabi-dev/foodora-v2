"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function ModeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && (theme === "dark" || resolvedTheme === "dark");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "relative rounded-full transition-colors duration-300 cursor-pointer border border-neutral-200 dark:border-neutral-800",
            "hover:bg-muted hover:text-foreground",
            "focus-visible:ring-0 focus-visible:bg-muted focus-visible:text-foreground focus-visible:ring-offset-0"
          )}
          aria-label="Toggle theme"
        >
          {mounted ? (
            isDark ? (
              <Moon className="absolute h-5 w-5 transition-all" />
            ) : (
              <Sun className="absolute h-5 w-5 transition-all" />
            )
          ) : (
            <Sun className="absolute h-5 w-5 transition-all opacity-0" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-28">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <p>🌞</p> Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <p>🌙</p> Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <p>💻</p> System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
