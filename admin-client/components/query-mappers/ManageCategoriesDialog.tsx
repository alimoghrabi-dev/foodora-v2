"use client";

import React, { Fragment, useEffect, useState } from "react";
import { getCategories } from "@/lib/actions/client.actions";
import { useQuery } from "@tanstack/react-query";
import {
  Ghost,
  RefreshCw,
  Plus,
  ArrowBigLeft,
  AlertCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import CreateCategoryForm from "../forms/CreateCategoryForm";
import CategoryCard from "../cards/CategoryCard";
import { ScrollArea } from "../ui/scroll-area";

const ManageCategoriesDialog: React.FC = () => {
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    data: categories,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["CATEGORIES"],
    queryFn: getCategories,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage(null);
      }, 6500);
    }
  }, [errorMessage]);

  if (isCreating) {
    return (
      <div className="w-full flex flex-col gap-y-4">
        <div className="w-full flex items-center">
          <button
            type="button"
            onClick={() => setIsCreating(false)}
            className="inline-flex cursor-pointer rounded-sm items-center gap-1 px-2 py-1.5 text-neutral-50 dark:text-neutral-800 bg-neutral-700 dark:bg-neutral-100 border-0 text-sm font-medium hover:bg-neutral-600 hover:dark:bg-neutral-300 transition-colors"
          >
            <ArrowBigLeft size={16} />
            Back
          </button>
        </div>
        <CreateCategoryForm setIsCreating={setIsCreating} />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex items-center">
        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="inline-flex cursor-pointer rounded-sm items-center gap-1 px-4 py-2 bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm dark:shadow-md"
        >
          <Plus size={16} />
          Create Category
        </button>
      </div>
      {isPending ? (
        <div className="space-y-3 mt-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-12 w-full rounded-md bg-muted animate-pulse"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center text-center py-10">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mb-4">
            <RefreshCw className="w-8 h-8 text-red-500 dark:text-red-300 animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Failed to load categories
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Please check your connection and try again.
          </p>
          <Button onClick={() => refetch()} className="rounded-sm">
            Retry
          </Button>
        </div>
      ) : categories?.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-10">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Ghost className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            No Categories Found
          </h3>
          <p className="text-sm text-muted-foreground">
            Start by adding a few categories to organize your menu items.
          </p>
        </div>
      ) : (
        <Fragment>
          {errorMessage && (
            <span className="w-full max-w-full break-words flex items-center gap-x-1 text-[13px] font-medium text-red-500 mt-2.5">
              <AlertCircle size={17} />
              {errorMessage}
            </span>
          )}
          <ScrollArea className="w-full max-h-[32vh] pr-3">
            <div className="w-full grid gap-3 mt-4">
              {categories.map(
                (cat: { _id: string; name: string; createdAt: Date }) => (
                  <CategoryCard
                    key={cat._id}
                    cat={cat}
                    setErrorMessage={setErrorMessage}
                  />
                )
              )}
            </div>
          </ScrollArea>
        </Fragment>
      )}
    </div>
  );
};

export default ManageCategoriesDialog;
