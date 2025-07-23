"use client";

import React, { useEffect, useRef, useState } from "react";
import { FileImage } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const ImageFileInput: React.FC<{
  field: {
    value: File | string | undefined;
    onChange: (file: File | string | undefined) => void;
  };
  isCustom?: boolean;
}> = ({ field, isCustom }) => {
  const fileInputRef = useRef<HTMLInputElement>(undefined);
  const [image, setImage] = useState<File | string | undefined>(field.value);

  useEffect(() => {
    setImage(field.value);
  }, [field.value]);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      field.onChange(file);
    }
  };

  const handleImageClick = () => {
    handleButtonClick();
  };

  return (
    <div
      onClick={handleImageClick}
      className={cn(
        "border bg-neutral-50 dark:bg-neutral-950/50 dark:border-neutral-800 rounded-sm hover:border-neutral-300 hover:dark:border-neutral-700 hover:bg-neutral-100 hover:dark:bg-neutral-950/75 active:border-ring/60 active:ring-ring/60 active:ring-[1px] active:bg-primary/5 relative flex items-center justify-center transition-all cursor-pointer",
        isCustom ? "w-full h-[400px]" : "w-[325px] h-[275px]"
      )}
    >
      <input
        type="file"
        ref={fileInputRef as React.RefObject<HTMLInputElement>}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleFileChange}
      />
      {image ? (
        typeof image === "string" ? (
          <Image
            src={image}
            alt="Collection Thumbnail"
            className="object-contain rounded-sm"
            quality={95}
            priority
            fill
          />
        ) : isCustom ? (
          <Image
            src={URL.createObjectURL(image)}
            alt={image.name}
            className="object-contain rounded-sm"
            quality={95}
            priority
            width={225}
            height={225}
          />
        ) : (
          <Image
            src={URL.createObjectURL(image)}
            alt={image.name}
            className="object-contain rounded-sm"
            quality={95}
            priority
            fill
          />
        )
      ) : (
        <div className="flex flex-col items-center gap-y-4">
          <FileImage
            size={62}
            className="text-neutral-700 dark:text-neutral-300"
          />
          <p className="text-neutral-800 dark:text-neutral-200 text-sm font-medium">
            Click to upload your image
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageFileInput;
