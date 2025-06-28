"use client";

import React, { useEffect } from "react";
import { OpeningHoursChangerValidationSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { z } from "zod";
import { Button } from "../ui/button";

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

const OpeningHoursForm: React.FC<{
  openingHours: z.infer<
    typeof OpeningHoursChangerValidationSchema
  >["openingHours"];
}> = ({ openingHours }) => {
  const form = useForm<z.infer<typeof OpeningHoursChangerValidationSchema>>({
    resolver: zodResolver(OpeningHoursChangerValidationSchema),
    defaultValues: {
      openingHours: {
        monday: { open: "", close: "" },
        tuesday: { open: "", close: "" },
        wednesday: { open: "", close: "" },
        thursday: { open: "", close: "" },
        friday: { open: "", close: "" },
        saturday: { open: "", close: "" },
        sunday: { open: "", close: "" },
      },
    },
  });

  useEffect(() => {
    form.setValue("openingHours", openingHours);
  }, [form, openingHours]);

  return (
    <Form {...form}>
      <form method="POST" className="w-full space-y-4" noValidate>
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
        <Button type="submit" className="text-base py-5 w-36 cursor-pointer">
          Update
        </Button>
      </form>
    </Form>
  );
};

export default OpeningHoursForm;
