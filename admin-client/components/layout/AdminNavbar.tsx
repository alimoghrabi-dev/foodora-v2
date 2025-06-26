"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { MdArrowBack } from "react-icons/md";
import Link from "next/link";
import { ModeToggle } from "../ui/theme-button";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle } from "lucide-react";

const AdminNavbar: React.FC<{
  isPublished: boolean;
}> = ({ isPublished }) => {
  const pathname = usePathname();
  const router = useRouter();

  const pathSegments = pathname.split("/").filter((segment) => segment);

  const buildHref = (index: number) =>
    "/" + pathSegments.slice(0, index + 1).join("/");

  return (
    <nav className="w-full flex items-center justify-between px-4">
      <div className="flex items-center gap-x-2.5">
        <MdArrowBack
          size={18}
          onClick={() => router.back()}
          className="text-neutral-700 hover:text-neutral-900 dark:text-neutral-100 hover:dark:text-neutral-300 transition-all cursor-pointer"
        />
        <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-700" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href="/"
                  className="text-sm text-neutral-700 hover:text-neutral-900 dark:text-neutral-100 hover:dark:text-neutral-300 transition-all"
                >
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {pathSegments.map((segment, index) => (
              <React.Fragment key={index}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href={buildHref(index)}
                      className="text-sm font-normal text-neutral-700 hover:text-neutral-900 dark:text-neutral-100 hover:dark:text-neutral-300 transition-all capitalize"
                    >
                      {decodeURIComponent(segment).replace(/-/g, " ")}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-x-2">
        <Badge
          className={cn(
            "inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border transition-colors",
            isPublished
              ? "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-800 dark:text-blue-100 dark:border-blue-600"
              : "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-800 dark:text-yellow-100 dark:border-yellow-600"
          )}
        >
          {isPublished ? (
            <>
              <CheckCircle className="text-blue-500 dark:text-blue-300" />
              Published
            </>
          ) : (
            <>
              <AlertTriangle className=" text-yellow-500 dark:text-yellow-300" />
              Unpublished
            </>
          )}
        </Badge>

        <ModeToggle />
      </div>
    </nav>
  );
};

export default AdminNavbar;
