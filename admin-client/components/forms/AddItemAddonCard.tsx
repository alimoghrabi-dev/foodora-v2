"use client";

import React from "react";
import { AddMenuItemValidationSchema } from "@/lib/validators";
import { UseFieldArrayRemove, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { sanitizeInput } from "@/lib/utils";
import NumberInput from "../shared/NumberInput";

type AddMenuItemFormValues = z.infer<typeof AddMenuItemValidationSchema>;

const AddItemAddonCard: React.FC<{
  form: UseFormReturn<AddMenuItemFormValues>;
  index: number;
  remove: UseFieldArrayRemove;
}> = ({ form, index, remove }) => {
  return (
    <div className="space-y-2 p-3 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm">
      <div className="w-full flex flex-col gap-y-3.5">
        <FormField
          name={`addons.${index}.name`}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-x-0.5 font-medium">
                Name <p className="text-blue-500">*</p>
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  value={field.value}
                  onChange={(e) =>
                    field.onChange(sanitizeInput(e.target.value))
                  }
                  placeholder="e.g., Extra Cheese, Add Pepperoni, etc."
                  className="w-full border-neutral-300 dark:border-neutral-800 rounded-sm hover:border-neutral-400 hover:dark:border-neutral-700 transition-all"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name={`addons.${index}.price`}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Price</FormLabel>
              <FormControl>
                <NumberInput
                  value={field.value ?? 0}
                  onChange={field.onChange}
                  className="w-full border-neutral-300 dark:border-neutral-800 rounded-sm hover:border-neutral-400 hover:dark:border-neutral-700 transition-all"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <button
        type="button"
        onClick={() => remove(index)}
        className="text-red-600 text-sm hover:underline cursor-pointer transition hover:opacity-85"
      >
        Remove addon
      </button>
    </div>
  );
};

export default AddItemAddonCard;
