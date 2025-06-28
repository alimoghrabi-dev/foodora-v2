import AdminNavbar from "@/components/layout/AdminNavbar";
import AdminSidebar from "@/components/layout/AdminSidebar";
import GrainyBackgroundWrapper from "@/components/providers/grainy-background-wrapper";
import QueryWrapper from "@/components/providers/query-wrapper";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getRestaurantSession } from "@/lib/get-user";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const restaurant = await getRestaurantSession();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <GrainyBackgroundWrapper>
        <QueryWrapper>
          <AdminSidebar
            logo={restaurant?.logo}
            restaurantFirstNameLetter={restaurant?.name.charAt(0) || "L"}
            isPublished={restaurant?.isPublished || false}
          />
        </QueryWrapper>
        <ScrollArea className="flex-1 ml-auto transition-all py-4 mt-0 mb-0 mr-0 sm:mt-3.5 sm:mb-3.5 sm:mr-3.5 bg-white dark:bg-[#0d0d0f] shadow-md rounded-none sm:rounded-lg overflow-hidden">
          <AdminNavbar isPublished={restaurant?.isPublished || false} />
          <main className="flex-1 px-4 md:px-8 pt-4 overflow-hidden">
            {children}
          </main>
        </ScrollArea>
      </GrainyBackgroundWrapper>
    </ThemeProvider>
  );
}
