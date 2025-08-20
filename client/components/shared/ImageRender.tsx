"use client";

import React, { Fragment, useState } from "react";
import Image, { ImageProps } from "next/image";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

const ImageRender: React.FC<ImageProps> = (props) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  const fallbackDiv = (
    <div
      className="flex items-center justify-center rounded-t-lg shadow-lg bg-gradient-to-br from-neutral-100 via-neutral-200 to-neutral-300 group-hover:from-neutral-200 group-hover:via-neutral-300 group-hover:to-neutral-400 transition-colors duration-500"
      style={{
        width: props.width || "100%",
        height: props.height || "100%",
      }}
    >
      <Image
        src="/icons/secondary-logo.png"
        alt="logo"
        className="object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-500"
        width={76}
        height={76}
      />
    </div>
  );

  return (
    <Fragment>
      {hasError ? (
        fallbackDiv
      ) : (
        <Fragment>
          <Skeleton
            className={cn("rounded-t-lg rounded-b-none", {
              "opacity-0": !isLoading,
            })}
            style={{
              width: props.width || "100%",
              height: props.height || "100%",
            }}
          />
          <Image
            {...props}
            alt={props.alt || ""}
            onLoad={() => setIsLoading(false)}
            onError={() => setHasError(true)}
            className={cn(props.className, "transition-all duration-300", {
              "opacity-0": isLoading,
            })}
          />
        </Fragment>
      )}
    </Fragment>
  );
};

export default ImageRender;
