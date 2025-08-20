"use client";

import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn, formatPriceWithAbbreviation } from "@/lib/utils";

const ItemVariantFetcher: React.FC<{
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
  selectedOption?: string;
  onChange: (
    variantId: string,
    variantName: string,
    optionId: string,
    optionName: string,
    price: number
  ) => void;
}> = ({ variant, selectedOption, onChange }) => {
  return (
    <div
      className={cn(
        "w-full rounded-lg p-4 border border-neutral-300 bg-primary/5 transition-all",
        {
          "bg-neutral-50": selectedOption,
        }
      )}
    >
      <div className="flex flex-col gap-y-1">
        <div className="w-full flex items-center justify-between">
          <h4 className="text-lg font-semibold text-neutral-800 capitalize">
            {variant.name}
          </h4>
          {selectedOption ? (
            <div className="px-2.5 py-[3px] rounded-full bg-white border border-neutral-400/60 text-neutral-800 font-semibold text-[13px]">
              Completed
            </div>
          ) : variant.isRequired ? (
            <div className="px-2.5 py-[3px] rounded-full bg-primary text-white font-semibold text-[13px]">
              Required
            </div>
          ) : (
            <div className="px-2.5 py-[3px] rounded-full bg-neutral-300/70 text-neutral-800 font-semibold text-[13px]">
              Optional
            </div>
          )}
        </div>
        <p className="text-neutral-700 font-medium text-sm">Select 1</p>
      </div>
      <RadioGroup
        className="mt-4"
        value={selectedOption ?? ""}
        onValueChange={(value) => {
          const selected = variant.options.find((opt) => opt._id === value);
          if (selected) {
            onChange(
              variant._id,
              variant.name,
              selected._id,
              selected.name,
              selected.price
            );
          }
        }}
      >
        {variant.options.map((option) => (
          <div key={option._id} className="w-full flex items-center gap-x-2">
            <RadioGroupItem
              value={option._id}
              id={option._id}
              className="size-5 cursor-pointer transition-all bg-white border-neutral-500 hover:border-neutral-400"
            />
            <div className="w-full flex items-center justify-between">
              <Label
                htmlFor={option._id}
                className="capitalize text-[16px] font-medium text-neutral-800 cursor-pointer"
              >
                {option.name}
              </Label>
              <span className="text-[14px] font-semibold text-neutral-900">
                +{formatPriceWithAbbreviation(option.price)}
              </span>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default ItemVariantFetcher;
