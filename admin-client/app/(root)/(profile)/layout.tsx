import ProfileSidebar from "@/components/layout/ProfileSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getRestaurantSession } from "@/lib/get-user";
import { redirect } from "next/navigation";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const restaurant = await getRestaurantSession();

  if (!restaurant?.isPublished) {
    redirect("/");
  }

  return (
    <div className="w-full h-[calc(100vh-88px)] md:h-[calc(100vh-115px)] flex flex-col md:flex-row gap-3">
      <ProfileSidebar />
      <main className="max-h-full overflow-hidden w-full">
        <ScrollArea className="w-full h-full pr-2.5">{children}</ScrollArea>
      </main>
    </div>
  );
}
