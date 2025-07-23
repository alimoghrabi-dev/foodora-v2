"use client";

import React, { Fragment } from "react";
import { ItemSaleValidationSchema } from "@/lib/validators";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import NumberInput from "../shared/NumberInput";
import { formatNumber, formatPriceWithAbbreviation } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  applyItemSale,
  getClientMenuItems,
  getClientSaleItems,
} from "@/lib/actions/client.actions";
import DatePicker from "react-datepicker";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { z } from "zod";
import "react-datepicker/dist/react-datepicker.css";

const ApplyItemSaleForm: React.FC<{
  title: string;
  itemId: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSaleManagementPage?: boolean;
}> = ({ title, itemId, setOpen, isSaleManagementPage }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof ItemSaleValidationSchema>>({
    resolver: zodResolver(ItemSaleValidationSchema),
    defaultValues: {
      saleType: "percentage",
      saleAmount: undefined,
      saleStartDate: undefined,
      saleEndDate: undefined,
    },
  });

  const { mutate: applySaleMutation, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof ItemSaleValidationSchema>) => {
      await applyItemSale(itemId, data);
    },
    onSuccess: () => {
      if (isSaleManagementPage) {
        queryClient.fetchQuery({
          queryKey: ["SALE_ITEMS"],
          queryFn: getClientSaleItems,
        });

        queryClient.invalidateQueries({
          queryKey: ["NOT_ONSALE_ITEMS"],
        });
      } else {
        queryClient.fetchQuery({
          queryKey: ["MENU_ITEMS"],
          queryFn: getClientMenuItems,
        });
      }

      setOpen(false);
      toast.success(`Sale applied successfully for ${title}`);
      form.reset();

      if (!isSaleManagementPage) {
        router.push("/menu");
      }
    },
    onError: () => {
      setOpen(false);
      toast.error("Something went wrong while applying sale.");
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => applySaleMutation(data))}
        className="space-y-4"
        method="PATCH"
        noValidate
      >
        <div className="w-full grid grid-cols-2 gap-1.5">
          <FormField
            name="saleType"
            control={form.control}
            render={({ field }) => (
              <FormItem className="self-start">
                <FormLabel className="flex items-center gap-x-0.5 font-medium">
                  Type{" "}
                  <p className="text-neutral-600 dark:text-neutral-400 text-[13px]">
                    {`(Default: Percentage)`}
                  </p>
                  <p className="text-blue-500">*</p>
                </FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full border-neutral-300 dark:border-neutral-800 rounded-sm hover:border-neutral-400 hover:dark:border-neutral-700 transition-all cursor-pointer">
                      <SelectValue placeholder="Select sale type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed</SelectItem>
                      <SelectItem value="percentage">Percentage</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="saleAmount"
            control={form.control}
            render={({ field }) => (
              <FormItem className="self-start">
                <FormLabel className="flex items-center gap-x-0.5 font-medium">
                  Amount
                  <p className="text-blue-500">*</p>
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
          name="saleStartDate"
          control={form.control}
          render={({ field }) => (
            <FormItem className="self-start">
              <FormLabel className="flex items-center gap-x-0.5 font-medium">
                Start Date
                <p className="text-neutral-600 dark:text-neutral-400 text-[13px]">
                  {`(Note: Sale with no start date will only be ended manually)`}
                </p>
              </FormLabel>
              <FormControl>
                <DatePicker
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  popperClassName="!z-[9999]"
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="MMMM d, yyyy h:mm aa"
                  placeholderText="Select start date"
                  autoComplete="off"
                  minDate={new Date()}
                  minTime={
                    !field.value ||
                    new Date(field.value).toDateString() ===
                      new Date().toDateString()
                      ? new Date()
                      : new Date(0, 0, 0, 0, 0, 0)
                  }
                  maxTime={new Date(0, 0, 0, 23, 59, 59)}
                  calendarClassName="calendar-theme"
                  customInput={
                    <Input className="w-full border-neutral-300 rounded-sm dark:border-neutral-800 hover:border-neutral-400 hover:dark:border-neutral-700 transition-all" />
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="saleEndDate"
          control={form.control}
          render={({ field }) => {
            const startDate = form.watch("saleStartDate");

            return (
              <FormItem className="self-start">
                <FormLabel className="font-medium">End Date</FormLabel>
                <FormControl>
                  <DatePicker
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    popperClassName="!z-[9999]"
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    placeholderText="Select end date"
                    autoComplete="off"
                    minDate={startDate || new Date()}
                    minTime={
                      (!field.value &&
                        startDate &&
                        startDate.toDateString() ===
                          new Date().toDateString()) ||
                      (field.value &&
                        new Date(field.value).toDateString() ===
                          new Date().toDateString())
                        ? new Date(
                            0,
                            0,
                            0,
                            startDate
                              ? startDate.getHours()
                              : new Date().getHours(),
                            startDate
                              ? startDate.getMinutes()
                              : new Date().getMinutes()
                          )
                        : new Date(0, 0, 0, 0, 0, 0)
                    }
                    maxTime={new Date(0, 0, 0, 23, 59, 59)}
                    calendarClassName="calendar-theme"
                    customInput={
                      <Input className="w-full border-neutral-300 rounded-sm dark:border-neutral-800 hover:border-neutral-400 hover:dark:border-neutral-700 transition-all" />
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <Button
          type="submit"
          disabled={isPending}
          className="w-full cursor-pointer bg-primary text-[15px] hover:bg-primary/75 disabled:pointer-events-none"
        >
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Fragment>
              Apply{" "}
              {form.watch("saleAmount") > 0
                ? form.watch("saleType") === "fixed"
                  ? formatPriceWithAbbreviation(
                      form.getValues("saleAmount") as number
                    )
                  : `${formatNumber(form.getValues("saleAmount"))}%`
                : null}{" "}
              Sale
            </Fragment>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ApplyItemSaleForm;
