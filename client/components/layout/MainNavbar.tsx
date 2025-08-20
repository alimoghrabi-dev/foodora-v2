"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const MainNavbar: React.FC = () => {
  return (
    <nav className="z-[1000] fixed inset-x-0 top-0 h-16 bg-gradient-to-r from-primary/75 to-violet-500/75 shadow-md backdrop-blur-lg px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-48 flex items-center justify-between">
      <Link href="/">
        <Image
          src="/icons/foodora-logo.svg"
          alt="logo"
          width={139}
          height={30}
          priority
          className="object-contain select-none"
        />
      </Link>
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">routes</div>
        <Link
          href="/market"
          target="_blank"
          className="bg-white rounded-full px-4 py-2 text-base font-medium text-primary hover:opacity-85 transition-opacity"
        >
          Market
        </Link>
      </div>
    </nav>
  );
};

export default MainNavbar;
