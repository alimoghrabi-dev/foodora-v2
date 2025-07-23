import Image from "next/image";

export default async function HomePage() {
  return (
    <div className="w-full">
      <div className="w-full relative h-[calc(100vh-64px)] grainy z-40">
        <Image
          src="/assets/hero-img.jpg"
          alt="hero-image"
          className="object-cover object-center"
          priority
          fill
        />
        <div className="absolute inset-0 z-50 bg-neutral-900/25 md:bg-neutral-900/20" />
        <h3
          className="absolute bottom-10 md:bottom-20 left-6 md:left-20 text-white font-extrabold text-[50px] sm:text-[60px] md:text-[72px] lg:text-[78px] xl:text-[82px] leading-[55px] md:leading-[78px] z-60 tracking-tighter"
          style={{
            textShadow: "0 2px 8px rgba(0,0,0,0.55)",
          }}
        >
          Because you <br /> want to
        </h3>
      </div>
    </div>
  );
}
