"use client";

import React, { Fragment, useEffect, useState } from "react";
import { RestaurantManagementValidationSchema } from "@/lib/validators";
import TextInputsManageBox from "../shared/TextInputsManageBox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Loader2, Pencil, X } from "lucide-react";
import ImageFileInput from "../shared/ImageFileInput";
import CoverImageFileInput from "../shared/CoverImageFileInput";
import { useMutation } from "@tanstack/react-query";
import { refetchSessionCookie } from "@/lib/session-updates";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { manageRestaurantAction } from "@/lib/actions/client.actions";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import NumberInput from "../shared/NumberInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const ProfileManagementQueryMapper: React.FC<{
  data: {
    name: string | undefined;
    description: string | undefined;
    cuisine: string | undefined;
    address:
      | {
          street: string;
          city: string;
          state: string;
          zipCode: string;
          country: string;
          latitude: number;
          longitude: number;
        }
      | undefined;
    phoneNumber: string | undefined;
    website: string | undefined;
    logo: string | undefined;
    coverImage: string | undefined;
    freeDeliveryFirstOrder: boolean | undefined;
    pricingDescription: "$" | "$$" | "$$$" | undefined;
    deliveryTimeRange: [number, number] | undefined;
  };
}> = ({ data }) => {
  const router = useRouter();

  const [pricingDescOpen, setPricingDescOpen] = useState<boolean>(false);
  const [deliveryRangeOpen, setDeliveryRangeOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof RestaurantManagementValidationSchema>>({
    resolver: zodResolver(RestaurantManagementValidationSchema),
    defaultValues: {
      name: "",
      description: "",
      cuisine: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "Lebanon",
        latitude: undefined,
        longitude: undefined,
      },
      phoneNumber: "",
      website: "",
      logo: undefined,
      coverImage: undefined,
      freeDeliveryFirstOrder: false,
      pricingDescription: undefined,
      deliveryTimeRange: [],
    },
  });

  const { mutate: manageMutation, isPending } = useMutation({
    mutationFn: async (
      data: z.infer<typeof RestaurantManagementValidationSchema>
    ) => {
      await manageRestaurantAction(data);
    },
    onSuccess: async () => {
      await refetchSessionCookie();

      router.push("/");
      toast.success("Your profile has been updated successfully.");
    },
    onError: () => {
      toast.error("Something went wrong while updating your profile.");
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name ?? "",
        description: data.description ?? "",
        cuisine: data.cuisine ?? "",
        address: {
          street: data.address?.street ?? "",
          city: data.address?.city ?? "",
          state: data.address?.state ?? "",
          zipCode: data.address?.zipCode ?? "",
          country: data.address?.country ?? "Lebanon",
          latitude: data.address?.latitude ?? undefined,
          longitude: data.address?.longitude ?? undefined,
        },
        phoneNumber: data.phoneNumber ?? "",
        website: data.website ?? "",
        logo: data.logo ?? undefined,
        coverImage: data.coverImage ?? undefined,
        freeDeliveryFirstOrder: data.freeDeliveryFirstOrder ?? false,
        pricingDescription: data.pricingDescription ?? undefined,
        deliveryTimeRange: data.deliveryTimeRange ?? [],
      });
    }
  }, [data, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => manageMutation(data))}
        className="w-full flex flex-col gap-y-4"
        method="PATCH"
        noValidate
      >
        <div className="w-full flex items-center justify-start">
          <Button
            type="submit"
            disabled={isPending}
            className="rounded-md w-36 cursor-pointer hover:opacity-85 active:bg-primary active:scale-[1.025] text-base font-medium py-[19px]"
          >
            {isPending ? <Loader2 className="animate-spin" /> : "Save Changes"}
          </Button>
        </div>
        <FormField
          name="freeDeliveryFirstOrder"
          control={form.control}
          render={({ field }) => (
            <FormItem className="my-1 pl-1">
              <FormControl>
                <div className="flex items-center gap-x-2">
                  <Checkbox
                    id="freeDeliveryOnFirstOrder"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="cursor-pointer transition-all"
                  />
                  <FormLabel
                    htmlFor="freeDeliveryOnFirstOrder"
                    className="cursor-pointer hover:opacity-85 transition"
                  >
                    {`Do you want to offer free delivery for customers on their first order ?`}
                  </FormLabel>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <TextInputsManageBox
                label="Name"
                field={field}
                placeHolder="Enter restaurant name"
                isRequired
              />
            )}
          />
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <TextInputsManageBox
                label="Description"
                field={field}
                placeHolder="Enter restaurant description"
                isRequired
                isTextArea
              />
            )}
          />
          <FormField
            name="cuisine"
            control={form.control}
            render={({ field }) => (
              <TextInputsManageBox
                label="Cuisine"
                field={field}
                placeHolder="Enter restaurant cuisine"
                isColSpanInputOnXL
                isRequired
              />
            )}
          />
        </div>
        <div className="w-full flex flex-col gap-y-4 border p-4 rounded-md shadow-sm bg-neutral-50 dark:bg-neutral-950">
          <h2 className="text-xl sm:text-2xl font-semibold text-neutral-800 dark:text-neutral-200 ">
            Address
          </h2>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
            <FormField
              name="address.street"
              control={form.control}
              render={({ field }) => (
                <TextInputsManageBox
                  label="Street"
                  field={field}
                  placeHolder="Enter your street"
                  isRequired
                />
              )}
            />
            <FormField
              name="address.city"
              control={form.control}
              render={({ field }) => (
                <TextInputsManageBox
                  label="City"
                  field={field}
                  placeHolder="Enter your city"
                  isRequired
                />
              )}
            />
            <FormField
              name="address.state"
              control={form.control}
              render={({ field }) => (
                <TextInputsManageBox
                  label="State"
                  field={field}
                  placeHolder="Enter your state"
                  isRequired
                />
              )}
            />
            <FormField
              name="address.zipCode"
              control={form.control}
              render={({ field }) => (
                <TextInputsManageBox
                  label="Zip Code"
                  field={field}
                  placeHolder="Enter your zip code"
                  isRequired
                />
              )}
            />
            <FormField
              name="address.latitude"
              control={form.control}
              render={({ field }) => (
                <TextInputsManageBox
                  label="Latitude"
                  field={field}
                  placeHolder="Enter your latitude"
                  isNumberInput
                />
              )}
            />
            <FormField
              name="address.longitude"
              control={form.control}
              render={({ field }) => (
                <TextInputsManageBox
                  label="Longitude"
                  field={field}
                  placeHolder="Enter your longitude"
                  isNumberInput
                />
              )}
            />
          </div>
        </div>
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          <FormField
            name="phoneNumber"
            control={form.control}
            render={({ field }) => (
              <TextInputsManageBox
                label="Phone Number"
                field={field}
                placeHolder="Enter your phone number"
                isRequired
              />
            )}
          />
          <FormField
            name="website"
            control={form.control}
            render={({ field }) => (
              <TextInputsManageBox
                label="Website URL"
                field={field}
                placeHolder="Enter your website url"
              />
            )}
          />
        </div>
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          <FormField
            name="pricingDescription"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full p-4 rounded-md border flex flex-col bg-white dark:bg-neutral-950">
                <div className="w-full flex items-center justify-between">
                  <FormLabel className="font-medium text-base flex items-center gap-x-1">
                    Describe your pricing
                    <span className="text-blue-500 text-[15px]">*</span>
                  </FormLabel>
                  <button
                    type="button"
                    onClick={() => setPricingDescOpen(!pricingDescOpen)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-sm transition-all cursor-pointer",
                      pricingDescOpen
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-primary text-white hover:bg-primary/85"
                    )}
                  >
                    {pricingDescOpen ? (
                      <Fragment>
                        <X size={16} />
                        Close
                      </Fragment>
                    ) : (
                      <Fragment>
                        <Pencil size={16} />
                        Edit
                      </Fragment>
                    )}
                  </button>
                </div>
                <FormControl>
                  {pricingDescOpen ? (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full mt-6 resize-none border-neutral-300 dark:border-neutral-800 rounded-sm hover:border-neutral-400 hover:dark:border-neutral-700 transition-all">
                        <SelectValue placeholder="Pricing description" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-neutral-900">
                        <SelectItem value="$" className="cursor-pointer">
                          $ (cheap)
                        </SelectItem>
                        <SelectItem value="$$" className="cursor-pointer">
                          $$ (medium)
                        </SelectItem>
                        <SelectItem value="$$$" className="cursor-pointer">
                          $$$ (expensive)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="select-none inline-block capitalize px-4 py-2 mt-1 rounded-xl italic bg-blue-100 line-clamp-1 truncate dark:bg-blue-800/25 text-blue-800 dark:text-blue-200 text-sm font-medium shadow-sm">
                      {field.value
                        ? field.value
                        : `Pricing description not set yet.`}
                    </div>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="deliveryTimeRange"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full p-4 rounded-md border flex flex-col bg-white dark:bg-neutral-950">
                <div className="w-full flex items-center justify-between">
                  <FormLabel className="font-medium text-base flex items-center gap-x-1">
                    Delivery Range
                    <span className="text-blue-500 text-[15px]">*</span>
                  </FormLabel>
                  <button
                    type="button"
                    onClick={() => setDeliveryRangeOpen(!deliveryRangeOpen)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-sm transition-all cursor-pointer",
                      deliveryRangeOpen
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-primary text-white hover:bg-primary/85"
                    )}
                  >
                    {deliveryRangeOpen ? (
                      <Fragment>
                        <X size={16} />
                        Close
                      </Fragment>
                    ) : (
                      <Fragment>
                        <Pencil size={16} />
                        Edit
                      </Fragment>
                    )}
                  </button>
                </div>
                <FormControl>
                  {deliveryRangeOpen ? (
                    <div className="w-full grid grid-cols-2 gap-1.5">
                      <div className="flex flex-col gap-y-0.5">
                        <label className="font-normal text-neutral-700 dark:text-neutral-300 text-sm">
                          Minimum
                        </label>
                        <NumberInput
                          value={field.value?.[0] ?? 0}
                          onChange={(value) => {
                            const max = field.value?.[1] ?? 0;
                            field.onChange([value, max]);
                          }}
                          className="w-full mt-0.5 resize-none border-neutral-300 dark:border-neutral-800 rounded-sm hover:border-neutral-400 hover:dark:border-neutral-700 transition-all"
                        />
                      </div>
                      <div className="flex flex-col gap-y-0.5">
                        <label className="font-normal text-neutral-700 dark:text-neutral-300 text-sm">
                          Maximum
                        </label>
                        <NumberInput
                          value={field.value?.[1] ?? 0}
                          onChange={(value) => {
                            const min = field.value?.[0] ?? 0;
                            field.onChange([min, value]);
                          }}
                          className="w-full mt-0.5 resize-none border-neutral-300 dark:border-neutral-800 rounded-sm hover:border-neutral-400 hover:dark:border-neutral-700 transition-all"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="select-none inline-block px-4 py-2 mt-1 rounded-xl italic bg-blue-100 line-clamp-1 truncate dark:bg-blue-800/25 text-blue-800 dark:text-blue-200 text-sm font-medium shadow-sm">
                      {field.value.length === 0
                        ? `Pricing description not set yet.`
                        : `${field.value[0]} - ${field.value[1]} min`}
                    </div>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          <FormField
            name="logo"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-base flex items-center gap-x-1">
                  Logo
                  <span className="text-blue-500 text-[15px]">*</span>
                </FormLabel>
                <FormControl>
                  <ImageFileInput field={field} isCustom />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="coverImage"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-base flex items-center gap-x-1">
                  Cover Image
                  <span className="text-blue-500 text-[15px]">*</span>
                </FormLabel>
                <FormControl>
                  <CoverImageFileInput field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};

export default ProfileManagementQueryMapper;
