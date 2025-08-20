"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { formatPriceWithAbbreviation } from "@/lib/utils";
import React from "react";

const ItemAddonFetcher: React.FC<{
  addon: {
    _id: string;
    name: string;
    price: number;
  };
  selectedAddons: string[];
  onChange: (addonId: string, addonName: string, price: number) => void;
}> = ({ addon, selectedAddons, onChange }) => {
  const isChecked = selectedAddons.includes(addon._id);

  return (
    <div className="w-full flex items-center gap-x-2 px-1">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <Checkbox
            id={addon._id}
            checked={isChecked}
            onCheckedChange={() => onChange(addon._id, addon.name, addon.price)}
            className="transition size-5 border-neutral-400 hover:border-neutral-800 hover:border-2 cursor-pointer"
          />
          <Label
            htmlFor={addon._id}
            className="capitalize text-[15px] font-medium text-neutral-900 line-clamp-1 cursor-pointer"
          >
            {addon.name}
          </Label>
        </div>
        <span className="text-[14px] font-semibold text-neutral-900">
          +{formatPriceWithAbbreviation(addon.price)}
        </span>
      </div>
    </div>
  );
};

export default ItemAddonFetcher;
