"use client";

import React, { useEffect } from "react";
import { EditItemVariantValidationSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { sanitizeInput } from "@/lib/utils";
import NumberInput from "../shared/NumberInput";
import { Button } from "../ui/button";
import { Loader2, Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  editItemVariant,
  getClientMenuItemByName,
} from "@/lib/actions/client.actions";

const EditVariantForm: React.FC<{
  variant: {
    _id: string;
    name: string;
    options: {
      _id: string;
      name: string;
      price: number;
    }[];
    isRequired: boolean;
    isAvailable: boolean;
  };
  setEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setToast: React.Dispatch<
    React.SetStateAction<{
      type: "success" | "error";
      message: string;
    }>
  >;
  itemId: string;
  itemTitle: string;
}> = ({ variant, setEditOpen, setToast, itemId, itemTitle }) => {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof EditItemVariantValidationSchema>>({
    resolver: zodResolver(EditItemVariantValidationSchema),
    defaultValues: {
      name: variant.name || "",
      options:
        variant.options.map((option) => ({
          name: option.name || "",
          price: option.price || 0,
        })) || [],
      isRequired: variant.isRequired || true,
      isAvailable: variant.isAvailable || true,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const { mutate: editVariantMutation, isPending } = useMutation({
    mutationFn: async (
      data: z.infer<typeof EditItemVariantValidationSchema>
    ) => {
      await editItemVariant(variant._id, data);
    },
    onSuccess: () => {
      setEditOpen(false);
      form.reset();

      setToast({
        type: "success",
        message: "Variant updated successfully",
      });

      setTimeout(() => {
        queryClient.fetchQuery({
          queryKey: ["MENU_ITEM", itemId],
          queryFn: () => getClientMenuItemByName(itemTitle),
        });
      }, 900);
    },
    onError: () => {
      setEditOpen(false);
      form.reset();

      setToast({
        type: "error",
        message: "Something went wrong, please try again.",
      });
    },
  });

  useEffect(() => {
    form.reset({
      name: variant.name || "",
      options:
        variant.options.map((option) => ({
          name: option.name || "",
          price: option.price || 0,
        })) || [],
      isRequired: variant.isRequired || true,
      isAvailable: variant.isAvailable || true,
    });
  }, [form, variant]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => editVariantMutation(data))}
        method="PUT"
        className="space-y-3 px-4"
        noValidate
      >
        <FormField
          name="name"
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
                  placeholder="e.g., Extra Cheese, Additional Sauce, etc."
                  className="w-full border-neutral-300 dark:border-neutral-800 rounded-sm hover:border-neutral-400 hover:dark:border-neutral-700 transition-all"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {fields.map((optionField, optionIndex) => (
          <div
            key={optionField.id}
            className="space-y-2 p-3 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm"
          >
            <div className="w-full grid grid-cols-2 gap-2">
              <FormField
                name={`options.${optionIndex}.name`}
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
                name={`options.${optionIndex}.price`}
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
              onClick={() => remove(optionIndex)}
              className="text-red-600 text-sm hover:underline cursor-pointer transition hover:opacity-85"
            >
              Remove option
            </button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ name: "", price: 0 })}
          className="flex items-center gap-x-1 text-sm rounded-sm border-dashed border border-neutral-400 dark:border-neutral-700 cursor-pointer"
        >
          <Plus size={24} /> Add Option
        </Button>
        <div className="flex items-center gap-x-4">
          <FormField
            name="isAvailable"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={field.value ?? true}
                    onChange={field.onChange}
                    className="form-checkbox h-4 w-4 text-primary cursor-pointer"
                  />
                  <FormLabel className="text-sm font-medium">
                    Available
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="isRequired"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={field.value ?? true}
                    onChange={field.onChange}
                    className="form-checkbox h-4 w-4 text-primary cursor-pointer"
                  />
                  <FormLabel className="text-sm font-medium">
                    Required
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="rounded-sm w-full cursor-pointer hover:opacity-85 active:bg-primary active:scale-[1.025] text-base font-medium py-5"
        >
          {isPending ? <Loader2 className="animate-spin" /> : "Edit Variant"}
        </Button>
      </form>
    </Form>
  );
};

export default EditVariantForm;
