import FavoritePageError from "@/_market/components/client_renderers/FavoritePageError";
import FavoriteRestaurantsClientMapper from "@/_market/components/client_renderers/FavoriteRestaurantsClientMapper";
import { getFavoriteRestaurants } from "@/_market/lib/server-actions";
import QueryWrapper from "@/components/providers/query-wrapper";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getUserSession } from "@/lib/get-user";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Foodora | Favorites",
};

export default async function FavoritesPage() {
  const user = await getUserSession();

  const result = await getFavoriteRestaurants();

  if (result?.error) {
    return <FavoritePageError />;
  }

  return (
    <ScrollArea className="w-full max-h-[82.5vh]">
      <section className="w-full flex flex-col gap-4">
        <h1 className="font-black text-[32px] sm:text-[36px] md:text-[38px] lg:text-[40px] text-neutral-900">
          My Favorites
        </h1>
        <QueryWrapper>
          <FavoriteRestaurantsClientMapper
            initialData={result?.restaurants}
            user={user}
          />
        </QueryWrapper>
      </section>
    </ScrollArea>
  );
}
