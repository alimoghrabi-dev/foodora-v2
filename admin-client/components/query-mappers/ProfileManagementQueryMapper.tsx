"use client";

import React, { useEffect } from "react";
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
import { Loader2 } from "lucide-react";
import ImageFileInput from "../shared/ImageFileInput";
import CoverImageFileInput from "../shared/CoverImageFileInput";
import { useMutation } from "@tanstack/react-query";
import { refetchSessionCookie } from "@/lib/session-updates";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { manageRestaurantAction } from "@/lib/actions/client.actions";

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
  };
}> = ({ data }) => {
  const router = useRouter();

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
