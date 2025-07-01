"use client";

import React, { useState } from "react";
import { sanitizeInput } from "@/lib/utils";
import { Check, Loader2, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editCategory } from "@/lib/actions/client.actions";

const EditCategoryForm: React.FC<{
  closeForm: () => void;
  name: string;
  categoryId: string;
}> = ({ closeForm, name, categoryId }) => {
  const [editedName, setEditedName] = useState<string>(name);
  const [error, setError] = useState<string>("");

  const queryClient = useQueryClient();

  const { mutate: editMutation, isPending } = useMutation({
    mutationFn: async () => {
      setError("");

      if (editedName.trim() === "") {
        throw new Error("Category name is required");
      }

      if (editedName.toLowerCase() === name.toLowerCase()) {
        throw new Error("Category name cannot be the same");
      }

      await editCategory(categoryId, editedName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["CATEGORIES"],
      });
      setError("");
      closeForm();
    },
    onError: (error) => {
      setError(error.message || "Something went wrong, please try again.");
    },
  });

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    editMutation();
  };

  return (
    <div className="w-full flex flex-col gap-y-1.5">
      <div className="w-full relative flex items-center gap-x-2 px-3 py-1.5 border rounded-sm bg-neutral-950/60">
        {isPending && (
          <div className="absolute -inset-0.5 rounded-sm bg-green-300 dark:bg-green-800 flex items-center justify-center">
            <Loader2
              size={21}
              className="animate-spin opacity-100 dark:opacity-75 text-white"
            />
          </div>
        )}

        <input
          type="text"
          value={editedName}
          onChange={(e) => setEditedName(sanitizeInput(e.target.value))}
          className="bg-transparent outline-none w-full text-sm"
          placeholder="Category Name"
          autoComplete="off"
        />
        <div className="flex items-center gap-x-1.5">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="border border-green-600 text-white size-[24px] rounded-sm flex items-center justify-center bg-green-600 hover:opacity-75 transition cursor-pointer"
          >
            <Check size={16} />
          </button>
          <button
            type="button"
            onClick={closeForm}
            className="border size-[25px] rounded-sm flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/40 group transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      {error && (
        <p className="text-sm font-medium text-red-600 px-1">{error}</p>
      )}
    </div>
  );
};

export default EditCategoryForm;
