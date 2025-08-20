import MarketFilters from "@/_market/components/layout/MarketFilters";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function RootMarketLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full flex flex-col lg:flex-row gap-6">
      <MarketFilters />
      <main className="w-full max-h-[calc(100vh-152px)] overflow-y-hidden">
        <ScrollArea className="w-full h-[calc(100vh-152px)] pr-2">
          {children}
        </ScrollArea>
      </main>
    </div>
  );
}
