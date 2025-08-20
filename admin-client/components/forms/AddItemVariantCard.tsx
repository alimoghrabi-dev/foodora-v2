"use client";

import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { sanitizeInput } from "@/lib/utils";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import NumberInput from "../shared/NumberInput";
import {
  useFieldArray,
  UseFieldArrayRemove,
  UseFormReturn,
} from "react-hook-form";
import { AddMenuItemValidationSchema } from "@/lib/validators";
import { z } from "zod";

type AddMenuItemFormValues = z.infer<typeof AddMenuItemValidationSchema>;

const AddItemVariantCard: React.FC<{
  form: UseFormReturn<AddMenuItemFormValues>;
  index: number;
  remove: UseFieldArrayRemove;
}> = ({ form, index, remove }) => {
  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control: form.control,
    name: `variants.${index}.options`,
  });

  return (
    <div className="space-y-2 p-3 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm">
      <FormField
        name={`variants.${index}.name`}
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
                onChange={(e) => field.onChange(sanitizeInput(e.target.value))}
                placeholder="e.g., Size, Additional Sauce, etc."
                className="w-full border-neutral-300 dark:border-neutral-800 rounded-sm hover:border-neutral-400 hover:dark:border-neutral-700 transition-all"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => appendOption({ name: "", price: 0 })}
        className="flex items-center gap-x-1 text-sm rounded-sm border-dashed border border-neutral-400 dark:border-neutral-700 cursor-pointer"
      >
        <Plus size={24} /> Add Option
      </Button>
      {optionFields.map((optionField, optionIndex) => (
        <div
          key={optionField.id}
          className="space-y-2 p-3 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm"
        >
          <div className="w-full grid grid-cols-2 gap-2">
            <FormField
              name={`variants.${index}.options.${optionIndex}.name`}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-x-0.5 font-medium">
                    Option Name <p className="text-blue-500">*</p>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(sanitizeInput(e.target.value))
                      }
                      placeholder="option name"
                      className="w-full border-neutral-300 dark:border-neutral-800 rounded-sm hover:border-neutral-400 hover:dark:border-neutral-700 transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name={`variants.${index}.options.${optionIndex}.price`}
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
            onClick={() => removeOption(optionIndex)}
            className="text-red-600 text-sm hover:underline cursor-pointer transition hover:opacity-85"
          >
            Remove option
          </button>
        </div>
      ))}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <FormField
            name={`variants.${index}.isAvailable`}
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex items-center">
                <input
                  type="checkbox"
                  checked={field.value ?? true}
                  onChange={field.onChange}
                  className="form-checkbox h-4 w-4 text-primary cursor-pointer"
                />
                <FormLabel className="text-sm font-medium">Available</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            name={`variants.${index}.isRequired`}
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex items-center">
                <input
                  type="checkbox"
                  checked={field.value ?? true}
                  onChange={field.onChange}
                  className="form-checkbox h-4 w-4 text-primary cursor-pointer"
                />
                <FormLabel className="text-sm font-medium">Required</FormLabel>
              </FormItem>
            )}
          />
        </div>
        <button
          type="button"
          onClick={() => remove(index)}
          className="text-red-600 text-sm hover:underline cursor-pointer transition hover:opacity-85"
        >
          Remove variant
        </button>
      </div>
    </div>
  );
};

export default AddItemVariantCard;
