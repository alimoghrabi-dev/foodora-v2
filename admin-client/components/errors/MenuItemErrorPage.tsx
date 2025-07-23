"use client";

import { useRouter } from "next/navigation";
import { Ghost } from "lucide-react";
import { Button } from "../ui/button";

const MenuItemErrorPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-[70vh] w-full flex flex-col items-center justify-center text-center px-4">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6 shadow-inner">
        <Ghost className="w-10 h-10 text-muted-foreground" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
        Menu Item Not Found
      </h1>
      <p className="text-muted-foreground max-w-md mb-6 text-sm sm:text-base">
        {`We couldn’t find the menu item you were looking for. It may have been
        removed or never existed or something else went wrong.`}
      </p>

      <Button
        variant="outline"
        className="rounded-md cursor-pointer"
        onClick={() => router.back()}
      >
        Go Back
      </Button>
    </div>
  );
};

export default MenuItemErrorPage;
