"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sanitizeInput } from "@/lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Loader2 } from "lucide-react";
import { createCategory } from "@/lib/actions/client.actions";

const CreateCategoryForm: React.FC<{
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setIsCreating }) => {
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string>("");

  const queryClient = useQueryClient();

  const { mutate: submitMutation, isPending } = useMutation({
    mutationFn: async () => {
      setError("");

      if (name.trim() === "") {
        throw new Error("Category name is required");
      }

      await createCategory(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["CATEGORIES"],
      });

      setIsCreating(false);
      setName("");
      setError("");
    },
    onError: (error) => {
      setError(error.message || "Something went wrong, please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitMutation();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col gap-y-2.5"
      method="POST"
      noValidate
    >
      <div className="w-full flex flex-col gap-y-1">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <Input
          type="text"
          id="name"
          name="name"
          value={name}
          placeholder="Category name"
          className="w-full border-neutral-300 dark:border-neutral-800 rounded-sm hover:border-neutral-400 hover:dark:border-neutral-700 transition-all"
          onChange={(e) => setName(sanitizeInput(e.target.value))}
        />
      </div>
      {error && <p className="text-sm text-destructive font-normal">{error}</p>}
      <Button
        type="submit"
        disabled={isPending}
        className="rounded-sm w-full cursor-pointer hover:opacity-85 active:bg-primary active:scale-[1.025] text-base font-medium py-5"
      >
        {isPending ? <Loader2 className="animate-spin" /> : "Create Category"}
      </Button>
    </form>
  );
};

export default CreateCategoryForm;
