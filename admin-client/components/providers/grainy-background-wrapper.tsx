"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export default function GrainyBackgroundWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const grainyClass = mounted
    ? resolvedTheme === "dark"
      ? "grainy-dark"
      : "grainy"
    : "bg-neutral-100/90 dark:bg-neutral-900/90";

  return (
    <div className={cn("w-full flex h-screen overflow-hidden", grainyClass)}>
      {children}
    </div>
  );
}
