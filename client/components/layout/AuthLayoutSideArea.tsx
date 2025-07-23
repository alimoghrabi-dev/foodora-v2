"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Image from "next/image";
import "swiper/css";

const slides = [
  {
    image: "/assets/auth-layout-img-1.jpg",
    text: "Order from your favorite restaurants in seconds.",
  },
  {
    image: "/assets/auth-layout-img-2.jpg",
    text: "Discover trending dishes around your area.",
  },
  {
    image: "/assets/auth-layout-img-3.jpg",
    text: "Fast delivery, guaranteed freshness.",
  },
  {
    image: "/assets/auth-layout-img-4.jpg",
    text: "Track your meals in real-time.",
  },
  {
    image: "/assets/auth-layout-img-5.jpg",
    text: "Welcome to Foodora V2 — the future of food.",
  },
];

const AuthLayoutSideArea = () => {
  return (
    <div className="w-1/2 xl:w-[35%] hidden lg:flex h-screen shadow-lg shadow-neutral-800/75 z-50 relative overflow-hidden">
      <div className="absolute top-10 left-10 flex items-center gap-4 z-60">
        <Image
          src="/icons/secondary-logo.png"
          alt="logo"
          className="object-contain shadow-md shadow-black/40 rounded-full"
          width={46}
          height={46}
          priority
        />
        <h4
          className="text-3xl 2xl:text-4xl text-neutral-50 font-extrabold"
          style={{ textShadow: "0 2px 8px rgba(0,0,0,0.75)" }}
        >
          Foodora V2
        </h4>
      </div>
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="w-full h-full pointer-events-none select-none"
        loop
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative w-full h-full">
              <Image
                src={slide.image}
                alt={`Slide ${idx + 1}`}
                className="object-cover brightness-[85%]"
                sizes="(max-width: 1024px) 100vw, 35vw"
                priority={idx === 0}
                fill
              />
              <div className="absolute bottom-20 left-8 right-8 z-60">
                <p
                  className="text-3xl 2xl:text-4xl text-white font-semibold"
                  style={{ textShadow: "0 2px 8px rgba(0,0,0,0.75)" }}
                >{`"${slide.text}"`}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default AuthLayoutSideArea;
