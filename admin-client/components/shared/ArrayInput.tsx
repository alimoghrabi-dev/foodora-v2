"use client";

import React, { useState } from "react";
import { sanitizeInput } from "@/lib/utils";
import { UseFormSetValue } from "react-hook-form";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";

const ArrayInput: React.FC<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  name: string | any;
  className?: string;
  value: string[] | undefined;
  placeholder: string;
  setValue: UseFormSetValue<{
    title: string;
    description: string;
    price: number;
    category: string;
    tags?: string[] | undefined;
    ingredients?: string[] | undefined;
    isAvailable?: boolean | undefined;
  }>;
  getValues: (field: string) => string[];
}> = ({ name, className, value, placeholder, setValue, getValues }) => {
  const [input, setInput] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(sanitizeInput(e.target.value));
  };

  const handleKeyDown = (e: { key: string; preventDefault: () => void }) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (value) {
        if (value.length >= 3) {
          setInput("");
          return;
        }
      }

      if (value?.some((item) => item.toLowerCase() === input.toLowerCase())) {
        setInput("");
        return;
      }

      const newTag = input.trim();
      if (newTag) {
        setValue(name, [...getValues(name), newTag]);
        setInput("");
      }
    }
  };

  const handleRemove = (itemToRemove: string) => {
    const updatedItems = getValues(name).filter(
      (item) => item !== itemToRemove
    );

    setValue(name, updatedItems);
  };

  return (
    <div>
      <Input
        value={input}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={className}
      />
      {!value
        ? null
        : value.length > 0 && (
            <div className="w-full flex flex-wrap justify-start mt-2.5 gap-2.5">
              {value?.map((item: string) => (
                <Badge
                  key={item}
                  className="flex select-none items-center justify-center bg-neutral-200 gap-2 rounded-sm border-none px-3 py-2"
                >
                  <p className="text-xs select-none uppercase text-neutral-600">
                    {item}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleRemove(item)}
                    className="cursor-pointer text-neutral-600 hover:opacity-85 transition duration-200"
                  >
                    <X size={13} />
                  </button>
                </Badge>
              ))}
            </div>
          )}
    </div>
  );
};

export default ArrayInput;
