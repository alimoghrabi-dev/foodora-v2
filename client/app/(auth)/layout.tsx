import AuthLayoutSideArea from "@/components/layout/AuthLayoutSideArea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getUserSession } from "@/lib/get-user";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserSession();

  if (user) {
    redirect("/");
  }

  return (
    <div className="w-full flex overflow-hidden">
      <AuthLayoutSideArea />
      <ScrollArea className="w-full lg:w-[65%] max-h-screen grainy">
        <main className="w-full flex items-center h-screen justify-center">
          {children}
        </main>
      </ScrollArea>
    </div>
  );
}
