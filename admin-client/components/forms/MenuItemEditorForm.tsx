"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  editMenuItemAction,
  getCategories,
  getClientMenuItemByName,
} from "@/lib/actions/client.actions";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddMenuItemValidationSchema } from "@/lib/validators";
import { toast } from "sonner";
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
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import ArrayInput from "../shared/ArrayInput";
import ImageFileInput from "../shared/ImageFileInput";
import { Button } from "../ui/button";
import { Loader2, Plus } from "lucide-react";
import { z } from "zod";
import AddItemVariantCard from "./AddItemVariantCard";
import AddItemAddonCard from "./AddItemAddonCard";

const MenuItemEditorForm: React.FC<{
  item: IItem;
}> = ({ item }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: categories, isPending: isGettingCategories } = useQuery({
    queryKey: ["CATEGORIES"],
    queryFn: getCategories,
    refetchOnWindowFocus: false,
  });

  const form = useForm<z.infer<typeof AddMenuItemValidationSchema>>({
    resolver: zodResolver(AddMenuItemValidationSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: "",
      image: undefined,
      tags: [],
      ingredients: [],
      variants: [],
      addons: [],
      isAvailable: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const {
    fields: addonsFields,
    append: appendAddon,
    remove: removeAddon,
  } = useFieldArray({
    control: form.control,
    name: "addons",
  });

  const { mutate: editItemMutation, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof AddMenuItemValidationSchema>) => {
      await editMenuItemAction(item._id, data);
    },
    onSuccess: () => {
      queryClient.fetchQuery({
        queryKey: ["MENU_ITEM", item._id],
        queryFn: () => getClientMenuItemByName(form.getValues("title")),
      });

      toast.success(`${form.getValues("title")} has been updated successfully`);
      form.reset();

      router.push(`/menu/${item.title}`);
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  useEffect(() => {
    if (!isGettingCategories && categories?.length > 0) {
      const matchedCategory = categories.find(
        (cat: { _id: { toString: () => string } }) =>
          cat._id.toString() === item.category?._id?.toString()
      );

      if (!matchedCategory) {
        toast.warning(
          `The category of the menu item "${item.title}" is not found`
        );
      }

      form.reset({
        title: item.title,
        description: item.description,
        price: item.price,
        image: item.imageUrl,
        tags: item.tags,
        ingredients: item.ingredients,
        variants: item.variants || [],
        addons: item.addons || [],
        isAvailable: item.isAvailable,
        category: matchedCategory ? matchedCategory._id.toString() : "",
      });
    }
  }, [isGettingCategories, categories, item, form]);

  console.log(form.watch("category"));

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => editItemMutation(data))}
        className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4"
        method="PUT"
        noValidate
      >
        <div className="w-full space-y-4">
          <div className="w-full grid grid-cols-2 gap-1.5">
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-x-0.5 font-medium">
                    Title <p className="text-blue-500">*</p>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      value={field.value}
                      placeholder="enter item title"
                      className="w-full border-neutral-300 dark:border-neutral-800 rounded-sm hover:border-neutral-400 hover:dark:border-neutral-700 transition-all"
                      onChange={(e) =>
                        field.onChange(sanitizeInput(e.target.value))
                      }
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
                  <FormLabel className="flex items-center gap-x-0.5 font-medium">
                    Price <p className="text-blue-500">*</p>
                  </FormLabel>
                  <FormControl>
                    <NumberInput
                      value={field.value}
                      className="w-full border-neutral-300 rounded-sm dark:border-neutral-800 hover:border-neutral-400 hover:dark:border-neutral-700 transition-all"
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-x-0.5 font-medium">
                  Description <p className="text-blue-500">*</p>
                </FormLabel>
                <FormControl>
                  <Textarea
                    rows={6}
                    value={field.value}
                    placeholder="description (250 characters max)"
                    className="w-full border-neutral-300 dark:border-neutral-800 rounded-sm hover:border-neutral-400 hover:dark:border-neutral-700 transition-all resize-none"
                    onChange={(e) =>
                      field.onChange(sanitizeInput(e.target.value))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="category"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-x-0.5 font-medium">
                  Category <p className="text-blue-500">*</p>
                </FormLabel>
                <FormControl>
                  <Select
                    disabled={isGettingCategories}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full capitalize border-neutral-300 dark:border-neutral-800 rounded-sm hover:border-neutral-400 hover:dark:border-neutral-700 transition-all cursor-pointer">
                      <SelectValue
                        placeholder={
                          isGettingCategories
                            ? "Loading..."
                            : "Select a category"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.length === 0 ? (
                        <div className="w-full text-center text-[15px] font-normal text-muted-foreground py-3">
                          No Categories Found
                        </div>
                      ) : (
                        categories?.map(
                          (cat: { _id: string; name: string }) => (
                            <SelectItem
                              key={cat._id}
                              value={cat._id.toString()}
                              className="capitalize"
                            >
                              {cat.name}
                            </SelectItem>
                          )
                        )
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="tags"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-x-1 font-medium">
                  Tags{" "}
                  <p className="text-neutral-700 dark:text-neutral-500 font-normal text-[13px]">
                    (For each tag you type press enter to add | 3 Tags Allowed)
                  </p>
                </FormLabel>
                <FormControl>
                  <ArrayInput
                    name="tags"
                    className="w-full border-neutral-300 dark:border-neutral-800 rounded-sm hover:border-neutral-400 hover:dark:border-neutral-700 transition-all"
                    value={field.value}
                    placeholder="add tags..."
                    setValue={form.setValue}
                    getValues={form.getValues}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="ingredients"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-x-1 font-medium">
                  Ingredients{" "}
                  <p className="text-neutral-700 dark:text-neutral-500 font-normal text-[13px]">
                    (For each ingredient you type press enter to add)
                  </p>
                </FormLabel>
                <FormControl>
                  <ArrayInput
                    name="ingredients"
                    className="w-full border-neutral-300 dark:border-neutral-800 rounded-sm hover:border-neutral-400 hover:dark:border-neutral-700 transition-all"
                    value={field.value}
                    placeholder="add ingredients..."
                    setValue={form.setValue}
                    getValues={form.getValues}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex items-center justify-center">
            <FormField
              name="image"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Showcase Image</FormLabel>
                  <FormControl>
                    <ImageFileInput field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="w-full h-full border-t lg:border-t-0 lg:border-l border-neutral-300 dark:border-neutral-800 pt-4 lg:pt-0 lg:pl-4 space-y-6">
          <div className="w-full space-y-4">
            <p className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
              Item Variants
            </p>

            {fields.map((field, index) => (
              <AddItemVariantCard
                key={field.id}
                form={form}
                index={index}
                remove={remove}
              />
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  name: "",
                  options: [],
                  isRequired: true,
                  isAvailable: true,
                })
              }
              className="w-44 flex items-center gap-x-1 text-base py-5 rounded-sm border-dashed border border-neutral-400 dark:border-neutral-700 cursor-pointer"
            >
              <Plus size={24} /> Add Variant
            </Button>
          </div>
          <div className="w-full border border-dashed border-neutral-300 dark:border-neutral-700" />
          <div className="w-full space-y-4">
            <p className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
              Item Addons
            </p>

            {addonsFields.map((field, index) => (
              <AddItemAddonCard
                key={field.id}
                form={form}
                index={index}
                remove={removeAddon}
              />
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                appendAddon({
                  name: "",
                  price: 0,
                })
              }
              className="w-44 flex items-center gap-x-1 text-base py-5 rounded-sm border-dashed border border-neutral-400 dark:border-neutral-700 cursor-pointer"
            >
              <Plus size={24} /> Add Addon
            </Button>
          </div>
        </div>
        <Button
          type="submit"
          disabled={isPending}
          className="rounded-sm w-full cursor-pointer hover:opacity-85 active:bg-primary active:scale-[1.025] text-base font-medium py-5"
        >
          {isPending ? <Loader2 className="animate-spin" /> : "Edit Item"}
        </Button>
      </form>
    </Form>
  );
};

export default MenuItemEditorForm;
