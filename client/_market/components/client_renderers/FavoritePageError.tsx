"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const FavoritePageError: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] text-center p-6 animate-fadeIn">
      <AlertCircle className="size-14 sm:size-16 text-red-500 mb-4 animate-bounce" />
      <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2">
        Oops! Something went wrong
      </h1>
      <p className="text-sm sm:text-base text-neutral-500 max-w-md mb-6">
        We couldn’t load your favorite restaurants. Please try again later or
        check your connection.
      </p>
      <button
        type="button"
        onClick={() => router.refresh()}
        className="px-5 py-2 rounded-full cursor-pointer bg-red-500 text-white font-medium shadow-md hover:bg-red-600 transition-colors"
      >
        Retry
      </button>
    </div>
  );
};

export default FavoritePageError;
