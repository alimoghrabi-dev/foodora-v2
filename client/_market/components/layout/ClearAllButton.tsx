"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

const ClearAllButton: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const hasParams = Array.from(searchParams.entries()).length > 0;

  const handleClear = () => {
    router.push("/market");
  };

  if (!hasParams) return null;

  return (
    <button
      type="button"
      onClick={handleClear}
      className="text-sm font-medium text-neutral-700 hover:text-neutral-600 hover:underline hover:underline-offset-2 transition cursor-pointer"
    >
      Clear all
    </button>
  );
};

export default ClearAllButton;
