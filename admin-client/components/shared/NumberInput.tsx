"use client";

import React from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { sanitizeInput } from "@/lib/utils";

const NumberInput: React.FC<{
  value: number | null;
  onChange: (value: number) => void;
  canBeNegative?: boolean;
  className?: string;
}> = ({ value, onChange, canBeNegative = false, className }) => {
  const increment = () => {
    onChange(value ? value + 1 : 1);
  };
  const decrement = () => {
    if (value) {
      if (canBeNegative) {
        onChange(value - 1);
      } else {
        if (value > 0) {
          onChange(value - 1);
        }
      }
    } else {
      if (canBeNegative) {
        onChange(value! - 1);
      }
    }
  };

  return (
    <div className="relative flex items-center">
      <div className="h-[30px] absolute right-2.5 flex flex-col">
        <button
          type="button"
          onClick={increment}
          className="hover:text-primary/50 transition duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronUpIcon size={15} />
        </button>
        <button
          type="button"
          onClick={decrement}
          disabled={!canBeNegative && value === 0}
          className="hover:text-primary/50 transition duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronDownIcon size={15} />
        </button>
      </div>
      <Input
        type="number"
        placeholder="0"
        value={value || 0}
        onChange={(e) => {
          if (canBeNegative) {
            onChange(Number(sanitizeInput(e.target.value)));
          } else {
            onChange(parseFloat(sanitizeInput(e.target.value)));
          }
        }}
        className={className}
      />
    </div>
  );
};

export default NumberInput;
