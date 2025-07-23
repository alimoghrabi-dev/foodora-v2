/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { Fragment, useState } from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { cn, sanitizeInput } from "@/lib/utils";
import { Pencil, X } from "lucide-react";
import { Textarea } from "../ui/textarea";
import NumberInput from "./NumberInput";

interface Props {
  label: string;
  field: {
    value: any;
    onChange: (value: any) => void;
  };
  placeHolder: string;
  isRequired?: boolean;
  isTextArea?: boolean;
  isNumberInput?: boolean;
  isColSpanInputOnXL?: boolean;
}

const TextInputsManageBox: React.FC<Props> = ({
  label,
  field,
  placeHolder,
  isRequired = false,
  isTextArea = false,
  isNumberInput = false,
  isColSpanInputOnXL = false,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <FormItem
      className={cn(
        "w-full p-4 rounded-md border flex flex-col bg-white dark:bg-neutral-950",
        {
          "lg:col-span-2 xl:col-span-1": isColSpanInputOnXL,
        }
      )}
    >
      <div className="w-full flex items-center justify-between">
        <FormLabel className="font-medium text-base flex items-center gap-x-1">
          {label}
          {isRequired && <span className="text-blue-500 text-[15px]">*</span>}
        </FormLabel>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cn(
            "flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-sm transition-all cursor-pointer",
            open
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-primary text-white hover:bg-primary/85"
          )}
        >
          {open ? (
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
        {open ? (
          isTextArea ? (
            <Textarea
              rows={5}
              value={field.value}
              placeholder={placeHolder}
              onChange={(e) => field.onChange(sanitizeInput(e.target.value))}
              className="w-full mt-1 resize-none border-neutral-300 dark:border-neutral-800 rounded-sm hover:border-neutral-400 hover:dark:border-neutral-700 transition-all"
              autoComplete="off"
            />
          ) : isNumberInput ? (
            <NumberInput
              value={field.value ?? 0}
              onChange={field.onChange}
              className="w-full mt-1 resize-none border-neutral-300 dark:border-neutral-800 rounded-sm hover:border-neutral-400 hover:dark:border-neutral-700 transition-all"
              canBeNegative
            />
          ) : (
            <Input
              type="text"
              value={field.value}
              placeholder={placeHolder}
              onChange={(e) => field.onChange(sanitizeInput(e.target.value))}
              className="w-full mt-1 border-neutral-300 dark:border-neutral-800 rounded-sm hover:border-neutral-400 hover:dark:border-neutral-700 transition-all"
              autoComplete="off"
            />
          )
        ) : (
          <div className="select-none inline-block capitalize px-4 py-2 mt-1 rounded-xl italic bg-blue-100 line-clamp-1 truncate dark:bg-blue-800/25 text-blue-800 dark:text-blue-200 text-sm font-medium shadow-sm">
            {field.value ? field.value : `${label} not set yet.`}
          </div>
        )}
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default TextInputsManageBox;
