"use client";

import React, { useEffect } from "react";
import { EditItemVariantValidationSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  editItemVariant,
  getClientMenuItems,
} from "@/lib/actions/client.actions";

const EditVariantForm: React.FC<{
  variant: {
    _id: string;
    name: string;
    price: number;
    isAvailable: boolean;
  };
  setEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setToast: React.Dispatch<
    React.SetStateAction<{
      type: "success" | "error";
      message: string;
    }>
  >;
}> = ({ variant, setEditOpen, setToast }) => {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof EditItemVariantValidationSchema>>({
    resolver: zodResolver(EditItemVariantValidationSchema),
    defaultValues: {
      name: variant.name || "",
      price: variant.price || undefined,
      isAvailable: variant.isAvailable || false,
    },
  });

  const { mutate: editVariantMutation, isPending } = useMutation({
    mutationFn: async (
      data: z.infer<typeof EditItemVariantValidationSchema>
    ) => {
      await editItemVariant(variant._id, data);
    },
    onSuccess: () => {
      queryClient.fetchQuery({
        queryKey: ["MENU_ITEMS"],
        queryFn: getClientMenuItems,
      });

      setEditOpen(false);
      form.reset();

      setToast({
        type: "success",
        message: "Variant updated successfully",
      });
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
      price: variant.price || undefined,
      isAvailable: variant.isAvailable || false,
    });
  }, [form, variant]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => editVariantMutation(data))}
        method="PUT"
        className="space-y-3"
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

        <FormField
          name="price"
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
                  className="form-checkbox h-4 w-4 text-primary"
                />
                <FormLabel className="text-sm font-medium">Available</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
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
