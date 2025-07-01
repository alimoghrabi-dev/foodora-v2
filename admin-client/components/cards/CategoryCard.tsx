"use client";

import React, { Fragment, useState } from "react";
import { formatDateToReadableString } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory } from "@/lib/actions/client.actions";
import EditCategoryForm from "../forms/EditCategoryForm";

const CategoryCard: React.FC<{
  cat: {
    _id: string;
    name: string;
    createdAt: Date;
  };
}> = ({ cat }) => {
  const queryClient = useQueryClient();

  const [feature, setFeature] = useState<{
    isEditing: boolean;
    isDeleting: boolean;
  }>({
    isEditing: false,
    isDeleting: false,
  });

  const { mutate: deleteMutation, isPending } = useMutation({
    mutationFn: async () => {
      await deleteCategory(cat._id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["CATEGORIES"],
      });
      setFeature({ isEditing: false, isDeleting: false });
    },
  });

  return (
    <div className="flex items-center justify-between px-4 py-3 border border-border bg-neutral-50 dark:bg-neutral-900 rounded-md">
      {feature.isDeleting ? (
        <div className="w-full relative grid grid-cols-2 gap-x-2.5">
          {isPending && (
            <div className="absolute -inset-0.5 rounded-sm bg-red-400 dark:bg-red-900 flex items-center justify-center">
              <Loader2
                size={21}
                className="animate-spin opacity-100 dark:opacity-75 text-white"
              />
            </div>
          )}

          <button
            type="button"
            onClick={() => setFeature({ isEditing: false, isDeleting: false })}
            className="cursor-pointer w-full px-8 py-[9px] text-sm font-medium rounded-sm border border-input bg-transparent text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => deleteMutation()}
            className="cursor-pointer w-full px-8 py-[9px] text-sm font-medium rounded-sm bg-red-500 dark:bg-red-600 text-white hover:bg-red-600 hover:dark:bg-red-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      ) : feature.isEditing ? (
        <EditCategoryForm
          closeForm={() => setFeature({ isEditing: false, isDeleting: false })}
          name={cat.name}
          categoryId={cat._id}
        />
      ) : (
        <Fragment>
          <div className="flex flex-col">
            <span className="text-base font-medium text-foreground">
              {cat.name}
            </span>
            <span className="text-xs text-muted-foreground">
              Created: {formatDateToReadableString(cat.createdAt)}
            </span>
          </div>
          <div className="flex gap-1.5">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setFeature({ isEditing: true, isDeleting: false })}
              className="border w-8 h-8 hover:bg-blue-100 dark:hover:bg-blue-900/40 group transition-colors cursor-pointer"
              aria-label="Edit Category"
            >
              <Pencil className="w-4 h-4 text-blue-600 group-hover:text-blue-700 dark:text-blue-400 dark:group-hover:text-blue-300" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setFeature({ isEditing: false, isDeleting: true })}
              className="border w-8 h-8 hover:bg-red-100 dark:hover:bg-red-900/40 group transition-colors cursor-pointer"
              aria-label="Delete Category"
            >
              <Trash2 className="w-4 h-4 text-red-600 group-hover:text-red-700 dark:text-red-400 dark:group-hover:text-red-300" />
            </Button>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default CategoryCard;
