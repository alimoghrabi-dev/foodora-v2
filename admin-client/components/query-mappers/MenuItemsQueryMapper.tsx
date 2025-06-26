"use client";

import React from "react";
import { getClientMenuItems } from "@/lib/actions/client.actions";
import { useQuery } from "@tanstack/react-query";
import MenuItemCard from "../cards/MenuItemCard";
import { Ghost } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

const MenuItemsQueryMapper: React.FC<{
  initialData: IItem[];
}> = ({ initialData }) => {
  const { data, isRefetching } = useQuery({
    queryKey: ["MENU_ITEMS"],
    queryFn: getClientMenuItems,
    initialData,
    refetchOnWindowFocus: false,
    enabled: false,
  });

  return (
    <div className="w-full flex flex-col gap-y-4">
      {isRefetching ? (
        <div></div>
      ) : data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center px-6">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
            <Ghost className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            No Items Found
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Looks like there are no items in the menu yet. Start adding some to
            display here!
          </p>
          <Link href="/menu/add">
            <Button className="rounded-sm cursor-pointer">Add Menu Item</Button>
          </Link>
        </div>
      ) : (
        <div className="w-full flex flex-wrap gap-4">
          {data.map((item: IItem) => (
            <MenuItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuItemsQueryMapper;
