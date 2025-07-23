"use client";

import React from "react";
import { getClientMenuItemByName } from "@/lib/actions/client.actions";
import { useQuery } from "@tanstack/react-query";
import MenuItemErrorPage from "../errors/MenuItemErrorPage";
import MenuItemEditorForm from "../forms/MenuItemEditorForm";

const MenuItemEditorQueryMapper: React.FC<{
  initialData: IItem;
}> = ({ initialData }) => {
  const {
    data: item,
    isPending,
    isRefetching,
    isError,
  } = useQuery({
    queryKey: ["MENU_ITEM_EDITOR", initialData?._id],
    queryFn: () => getClientMenuItemByName(initialData?.title),
    initialData,
    refetchOnWindowFocus: false,
    enabled: false,
  });

  if (isError) {
    return <MenuItemErrorPage />;
  }

  if (isPending || isRefetching) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4 animate-fade-in">
        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary font-bold text-xs">
            Loading
          </div>
        </div>
        <h2 className="text-xl font-semibold text-foreground">
          Fetching Menu Item
        </h2>
        <p className="mt-2 text-muted-foreground max-w-md">
          Please wait while we load the latest menu item details. This will only
          take a moment.
        </p>
      </div>
    );
  }

  return (
    <section className="w-full flex flex-col gap-y-8">
      <h2 className="text-xl sm:text-2xl font-semibold capitalize text-neutral-800 dark:text-neutral-200">
        Edit {item?.title}
      </h2>

      <MenuItemEditorForm item={item} />
    </section>
  );
};

export default MenuItemEditorQueryMapper;
