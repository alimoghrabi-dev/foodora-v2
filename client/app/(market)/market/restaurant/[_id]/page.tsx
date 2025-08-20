import RestaurantPageClient from "@/_market/components/client_renderers/RestaurantPageClient";
import { getRestaurantById } from "@/_market/lib/server-actions";
import QueryWrapper from "@/components/providers/query-wrapper";
import { getUserSession } from "@/lib/get-user";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ _id: string }>;
}) {
  const { _id } = await params;

  if (!_id) {
    redirect("/market");
  }

  const user = await getUserSession();

  const result = await getRestaurantById(_id);

  if (result?.error) {
    return (
      <div className="min-h-[60vh] w-full flex flex-col items-center justify-center text-center px-4">
        <div className="flex flex-col items-center gap-4">
          <AlertTriangle size={48} className="text-red-500 animate-pulse" />
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
            Oops! Something went wrong.
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-md">
            {`We couldn't load the restaurant details right now. It might not
            exist or there was a server issue.`}
          </p>
          <Link
            href="/market"
            className="mt-4 inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition"
          >
            Back to Market
          </Link>
        </div>
      </div>
    );
  }

  return (
    <QueryWrapper>
      <RestaurantPageClient initialData={result?.restaurant} user={user} />
    </QueryWrapper>
  );
}
