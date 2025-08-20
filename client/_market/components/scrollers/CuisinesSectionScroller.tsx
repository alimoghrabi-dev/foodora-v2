import React from "react";
import QueryWrapper from "@/components/providers/query-wrapper";
import CuisinesSectionScrollerClient from "./CuisinesSectionScrollerClient";
import { getAllCuisines } from "@/_market/lib/server-actions";
import { AlertTriangle } from "lucide-react";

const CuisinesSectionScroller = async () => {
  const result = await getAllCuisines();

  if (result?.error) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-2 py-10 bg-red-50 border border-red-200 rounded-xl text-center">
        <AlertTriangle className="h-8 w-8 text-red-500" />
        <h3 className="text-lg font-semibold text-red-700">
          Failed to load cuisines
        </h3>
        <p className="text-sm text-red-500">
          Something went wrong while fetching the list of cuisines.
        </p>
      </div>
    );
  }

  return (
    <QueryWrapper>
      <CuisinesSectionScrollerClient initialData={result?.cuisines} />
    </QueryWrapper>
  );
};

export default CuisinesSectionScroller;
