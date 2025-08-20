"use client";

import React, { Fragment, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Info, Loader2, LogOut, UserRound } from "lucide-react";
import { dropDownMenuLinks } from "@/constants/constants";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { logout } from "@/_market/lib/client-actions";
import { toast } from "sonner";

const UserProfile: React.FC<{
  user: IUser | null;
}> = ({ user }) => {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);

  const { mutate: logoutMutation, isPending } = useMutation({
    mutationFn: async () => {
      await logout();
    },
    onSuccess: () => {
      router.push("/login");
    },
    onError: () => {
      toast.error("Something went wrong while logging out. Please try again.", {
        style: {
          color: "#fff",
          background: "#e7000b",
        },
      });
    },
  });

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-x-2 px-3 py-1.5 hover:bg-neutral-200/50 rounded-md transition-all duration-200 ease-in-out cursor-pointer outline-none"
        >
          <UserRound size={21} className="text-neutral-800 mb-1" />
          <p className="text-base font-semibold text-neutral-800 capitalize max-w-[75px] truncate">
            {user?.firstName}
          </p>
          <ChevronDown
            size={21}
            className={cn("text-primary transition-all duration-300 ease-out", {
              "rotate-180": open,
            })}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-72 z-[1001] border-none rounded-xl p-3"
        style={{
          boxShadow: "0px 0px 21px rgba(0, 0, 0, 0.125)",
        }}
        aria-describedby={undefined}
      >
        {dropDownMenuLinks.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "w-full px-4 py-2.5 rounded-md flex text-neutral-900 items-center justify-start gap-x-4 transition-all mb-1.5",
                isActive
                  ? "bg-primary/80 text-white cursor-default"
                  : "hover:bg-primary/10"
              )}
            >
              <link.icon size={22} />
              <span className="font-medium text-base">{link.label}</span>
            </Link>
          );
        })}
        <DropdownMenuSeparator className="mb-1.5" />
        <Link
          href="/help-center"
          className="w-full mb-0.5 px-4 py-2.5 rounded-md flex items-center justify-start gap-x-4 hover:bg-primary/10 transition-all"
        >
          <Info size={22} className="text-neutral-900" />
          <span className="text-neutral-900 font-medium text-base">
            Help Center
          </span>
        </Link>
        <button
          type="button"
          disabled={isPending}
          onClick={() => logoutMutation()}
          className={cn(
            "disabled:pointer-events-none disabled:opacity-50 w-full cursor-pointer px-4 py-2.5 rounded-md flex items-center justify-start gap-x-4 hover:bg-primary/10 transition-all",
            {
              "justify-center": isPending,
            }
          )}
        >
          {isPending ? (
            <Loader2 size={22} className="animate-spin" />
          ) : (
            <Fragment>
              <LogOut size={22} className="text-neutral-900" />
              <span className="text-neutral-900 font-medium text-base">
                Logout
              </span>
            </Fragment>
          )}
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
