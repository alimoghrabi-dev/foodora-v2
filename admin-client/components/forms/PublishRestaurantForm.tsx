"use client";

import React, { useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { PublishRestaurantValidationSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { sanitizeInput } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import NumberInput from "../shared/NumberInput";
import { Button } from "../ui/button";
import { LinkIcon, Loader2 } from "lucide-react";
import ImageFileInput from "../shared/ImageFileInput";
import CoverImageFileInput from "../shared/CoverImageFileInput";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { publishRestaurantAction } from "@/lib/actions/client.actions";
import { refetchSessionCookie } from "@/lib/session-updates";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

type Day = (typeof days)[number];

const PublishRestaurantForm: React.FC<{
  name: string;
  description: string;
  cuisine: string;
  isEmailVerified: boolean;
}> = ({ name, description, cuisine, isEmailVerified }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof PublishRestaurantValidationSchema>>({
    resolver: zodResolver(PublishRestaurantValidationSchema),
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
      openingHours: {
        monday: { open: "", close: "" },
        tuesday: { open: "", close: "" },
        wednesday: { open: "", close: "" },
        thursday: { open: "", close: "" },
        friday: { open: "", close: "" },
        saturday: { open: "", close: "" },
        sunday: { open: "", close: "" },
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

  const handleNavigateButtonClick = () => {
    Cookies.set("verify_intent", "1", { expires: 1 / 288 });
    router.push("/verify-email");
  };

  const { mutate: publishRestaurantMutation, isPending } = useMutation({
    mutationFn: async (
      data: z.infer<typeof PublishRestaurantValidationSchema>
    ) => {
      await publishRestaurantAction(data);
    },
    onSuccess: async () => {
      await refetchSessionCookie();

      router.push("/");
      toast.success(
        "Your restaurant has been published successfully, users can now find you!"
      );
      form.reset();
    },
    onError: (error) => {
      toast.error(
        error.message ||
          "Something went wrong while publishing your restaurant."
      );
    },
  });

  useEffect(() => {
    form.setValue("name", name);
    form.setValue("description", description);
    form.setValue("cuisine", cuisine);
  }, [cuisine, description, form, name]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => publishRestaurantMutation(data))}
        className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4"
        method="POST"
        noValidate
      >
        <div className="w-full flex flex-col gap-y-5">
          <div className="w-full grid grid-cols-2 gap-2">
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
                      placeholder="enter restaurant name"
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
              name="cuisine"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-x-0.5 font-medium">
                    Cuisine <p className="text-blue-500">*</p>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      value={field.value}
                      placeholder="enter restaurant cuisine"
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
                    placeholder="description (400 characters max)"
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
          <div className="w-full space-y-5 p-4 rounded-md bg-neutral-50 dark:bg-neutral-950/50 border border-neutral-300 dark:border-neutral-800">
            <h4 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
              Address
            </h4>
            <div className="w-full grid grid-cols-2 gap-2">
              <FormField
                name="address.city"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-x-0.5 font-medium">
                      City <p className="text-blue-500">*</p>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        value={field.value}
                        placeholder="enter city address"
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
                name="address.street"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-x-0.5 font-medium">
                      Street <p className="text-blue-500">*</p>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        value={field.value}
                        placeholder="enter street address"
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
            </div>
            <div className="w-full grid grid-cols-2 gap-2">
              <FormField
                name="address.state"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-x-0.5 font-medium">
                      State <p className="text-blue-500">*</p>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        value={field.value}
                        placeholder="enter state address"
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
                name="address.zipCode"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-x-0.5 font-medium">
                      Zip Code <p className="text-blue-500">*</p>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        value={field.value}
                        placeholder="enter zip code address"
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
            </div>
            <div className="w-full grid grid-cols-2 gap-2">
              <FormField
                name="address.latitude"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Latitude</FormLabel>
                    <FormControl>
                      <NumberInput
                        value={field.value ?? 0}
                        onChange={field.onChange}
                        className="w-full border-neutral-300 dark:border-neutral-800 rounded-sm hover:border-neutral-400 hover:dark:border-neutral-700 transition-all"
                        canBeNegative
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="address.longitude"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Longitude</FormLabel>
                    <FormControl>
                      <NumberInput
                        value={field.value ?? 0}
                        onChange={field.onChange}
                        className="w-full border-neutral-300 dark:border-neutral-800 rounded-sm hover:border-neutral-400 hover:dark:border-neutral-700 transition-all"
                        canBeNegative
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="w-full grid grid-cols-2 gap-2">
            <FormField
              name="phoneNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-x-0.5 font-medium">
                    Phone Number <p className="text-blue-500">*</p>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      value={field.value}
                      placeholder="enter restaurant phone number"
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
              name="website"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-x-1.5 font-medium">
                    <LinkIcon size={15} />
                    Website URL
                  </FormLabel>
                  <FormControl>
                    <Input
                      value={field.value}
                      placeholder="website url"
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
          </div>

          <FormField
            name="deliveryTimeRange"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-x-0.5 font-medium">
                  Delivery Range <p className="text-blue-500">*</p>
                </FormLabel>
                <FormControl>
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
                        className="w-full border-neutral-300 dark:border-neutral-800 rounded-sm hover:border-neutral-400 hover:dark:border-neutral-700 transition-all"
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
                        className="w-full border-neutral-300 dark:border-neutral-800 rounded-sm hover:border-neutral-400 hover:dark:border-neutral-700 transition-all"
                      />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="pricingDescription"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-x-0.5 font-medium">
                  Pricing Description <p className="text-blue-500">*</p>
                </FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full border-neutral-300 dark:border-neutral-800 rounded-sm hover:border-neutral-400 hover:dark:border-neutral-700 transition-all">
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-full flex items-center justify-start">
            <FormField
              name="logo"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-x-0.5 font-medium">
                    Restaurant Logo <p className="text-blue-500">*</p>
                  </FormLabel>
                  <FormControl>
                    <ImageFileInput field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            name="coverImage"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-x-0.5 font-medium">
                  Restaurant Cover Image <p className="text-blue-500">*</p>
                </FormLabel>
                <FormControl>
                  <CoverImageFileInput field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w-full h-full border-t lg:border-t-0 lg:border-l border-neutral-300 dark:border-neutral-800 pt-4 lg:pt-0 lg:pl-4">
          <div className="w-full space-y-5 p-4 rounded-md bg-neutral-50 dark:bg-neutral-950/50 border border-neutral-300 dark:border-neutral-800">
            <h4 className="flex items-center gap-x-1.5 text-lg sm:text-xl font-semibold text-neutral-800 dark:text-neutral-200">
              Opening Hours
              <p className="text-[13px] sm:text-sm font-normal text-neutral-600 dark:text-neutral-400">
                (Empty days will be counted as closed)
              </p>
            </h4>

            <div className="w-full space-y-4">
              {days.map((day: Day) => {
                const error =
                  form.formState.errors.openingHours?.[day]?.close?.message;

                return (
                  <div key={day} className="space-y-1.5">
                    <div className="grid grid-cols-3 gap-2 items-center">
                      <span className="capitalize text-sm font-medium text-neutral-700 dark:text-neutral-300 col-span-1">
                        {day}
                      </span>

                      <FormField
                        control={form.control}
                        name={`openingHours.${day}.open`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-neutral-500">
                              Open
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="time"
                                className="w-full border-neutral-300 dark:border-neutral-800 rounded-sm hover:border-neutral-400 hover:dark:border-neutral-700 transition-all"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`openingHours.${day}.close`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-neutral-500">
                              Close
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="time"
                                className="w-full border-neutral-300 dark:border-neutral-800 rounded-sm hover:border-neutral-400 hover:dark:border-neutral-700 transition-all"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    {error && (
                      <p className="text-xs text-red-500 dark:text-red-400 ml-[calc(33.333%+0.5rem)]">
                        {error}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="w-full col-span-2 flex flex-col gap-y-4 items-center justify-center">
          {!isEmailVerified && (
            <div className="w-[375px] flex items-start gap-4 p-4 rounded-xl border border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-600 shadow-sm">
              <div className="flex-shrink-0 text-yellow-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex flex-col gap-2 text-sm text-yellow-800 dark:text-yellow-300">
                <div>
                  <p className="font-semibold">Email Verification Required</p>
                  <p>
                    You must verify your email before publishing your
                    restaurant.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleNavigateButtonClick}
                  className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-md border border-yellow-400 px-3 py-1.5 text-sm font-medium text-yellow-700 hover:bg-yellow-100 dark:text-yellow-300 dark:border-yellow-600 dark:hover:bg-yellow-800/20 transition-colors"
                >
                  <span>Verify Now</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={!isEmailVerified || isPending}
            className="w-[375px] text-lg py-6 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              "Publish Your Restaurant"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PublishRestaurantForm;
