"use client";

import React, { useEffect, useState } from "react";
import { formUrlQuery, removeKeysFromQuery, sanitizeInput } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

const CuisinesSearchBar: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get("cuisine-query");

  const [search, setSearch] = useState<string>(query || "");

  useEffect(() => {
    const delayDebounceFN = setTimeout(() => {
      const sanitizedSearch = sanitizeInput(search);

      if (sanitizedSearch) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "cuisine-query",
          value: sanitizedSearch,
        });

        router.push(newUrl);
      } else {
        if (location.pathname.includes(`/market`)) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keys: ["cuisine-query"],
          });

          router.push(newUrl);
        }
      }
    }, 800);

    return () => clearTimeout(delayDebounceFN);
  }, [router, search, query, searchParams]);

  return (
    <div className="w-full relative px-px group">
      <input
        type="text"
        maxLength={30}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search for cuisine"
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        className="w-full rounded-full bg-neutral-200/40 px-4 py-2 pl-9 text-sm outline-none placeholder:text-neutral-500 font-medium group-hover:ring group-hover:ring-neutral-400/60 focus-visible:ring focus-visible:ring-primary transition-all"
      />
      <Search
        size={17}
        className="text-neutral-600 absolute left-4 top-1/2 -translate-y-1/2 group-hover:text-neutral-900 transition"
      />
    </div>
  );
};

export default CuisinesSearchBar;
