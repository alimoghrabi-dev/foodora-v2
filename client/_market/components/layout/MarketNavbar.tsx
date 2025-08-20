import React from "react";
import Link from "next/link";
import UserProfile from "../shared/UserProfile";
import { getUserSession } from "@/lib/get-user";
import QueryWrapper from "@/components/providers/query-wrapper";
import MarketNavbarSideItems from "../shared/MarketNavbarSideItems";
import MarketNavbarBottomItems from "../shared/MarketNavbarBottomItems";

const MarketNavbar: React.FC = async () => {
  const user = await getUserSession();

  return (
    <nav className="z-[1000] bg-white/95 backdrop-blur-lg fixed top-0 inset-x-0 w-full h-[120px] shadow-lg px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-48 flex flex-col gap-y-2">
      <div className="w-full flex items-center justify-between h-1/2">
        <Link
          href="/market"
          className="text-primary font-[900] tracking-tighter text-[40px]"
        >
          foodora
        </Link>
        <div>address</div>
        <div className="flex items-center gap-6">
          <QueryWrapper>
            <UserProfile user={user} />
          </QueryWrapper>
          <div className="flex items-center gap-2">
            <MarketNavbarSideItems />
          </div>
        </div>
      </div>
      <MarketNavbarBottomItems />
    </nav>
  );
};

export default MarketNavbar;
