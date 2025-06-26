import { AuthBG } from "@/assets/assets";
import { getRestaurantSession } from "@/lib/get-user";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const restaurant = await getRestaurantSession();

  if (restaurant) {
    redirect("/");
  }

  return (
    <div className="w-full min-h-screen relative flex flex-col items-center justify-center gap-y-8 overflow-hidden">
      <Image
        src={AuthBG}
        alt="background"
        className="object-cover opacity-75 z-30"
        quality={90}
        priority
        fill
      />
      <div className="absolute left-0 z-40 inset-y-0 w-1/3 bg-gradient-to-r from-white/85 to-transparent" />
      <div className="z-50 flex flex-col items-center gap-y-8">
        <span>LOGO</span>
        <main className="p-8 w-[400px] relative shadow-sm rounded-3xl bg-white/20 backdrop-blur-lg">
          {children}
        </main>
      </div>
    </div>
  );
}
