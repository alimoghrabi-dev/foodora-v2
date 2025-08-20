"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ScrollSectionForRestaurants: React.FC<{
  title: string;
}> = ({ title }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isLeftDisabled, setIsLeftDisabled] = useState<boolean>(true);
  const [isRightDisabled, setIsRightDisabled] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -125 : 125;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (el) {
      setIsLeftDisabled(el.scrollLeft <= 0);
      setIsRightDisabled(el.scrollLeft + el.clientWidth >= el.scrollWidth - 5);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollButtons();

    const handleScroll = () => updateScrollButtons();

    el.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, []);

  return (
    <div className="w-full max-w-[1500px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-x-2.5">
          <h3 className="text-2xl font-medium text-neutral-900">{title}</h3>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Info
                size={22}
                className="text-neutral-600 hover:text-neutral-800 transition cursor-pointer"
              />
            </DialogTrigger>
            <DialogContent
              aria-describedby={undefined}
              className="p-6 rounded-xl"
            >
              <DialogHeader>
                <DialogTitle className="text-xl">
                  How we rank information
                </DialogTitle>
              </DialogHeader>
              <div className="w-full flex flex-col gap-y-4">
                <p className="text-neutral-800 text-sm font-normal">
                  Below, you will see a selection tailored to you, based on your
                  delivery address, your distance to a restaurant or shop, and
                  its popularity, as indicated by click and order history from
                  other foodora users. We also sort options basedon your
                  previous orders and app usage history to optimize your
                  experience. Where available you will see different options to
                  change sorting.
                </p>
                <span className="text-neutral-800 text-sm font-normal">
                  We form partnerships with partner restaurants and shops to
                  promote them on foodora. What you see may thus include paid
                  placements, which are always clearly marked as such.
                </span>
                <p className="text-neutral-800 text-sm font-normal">
                  You will see paid placements based on your
                </p>
                <ol className="pl-6 list-disc flex flex-col gap-y-2.5">
                  <li className="text-neutral-800 text-sm font-normal">
                    Chosen delivery address
                  </li>
                  <li className="text-neutral-800 text-sm font-normal">
                    Previous orders on foodora
                  </li>
                  <li className="text-neutral-800 text-sm font-normal">
                    Interactions with the foodora platform (like your previous
                    searches and menu viewings)
                  </li>
                </ol>
                <p className="text-neutral-800 text-sm font-normal">
                  We may also show you curated lists of restaurants and shops,
                  which may be filtered based on cuisine or assortment type,
                  your order history, selected delivery address, promotional
                  offers, user ratings, and similar criteria. Curated lists are
                  named to suggest the filtering applied to them. If a curated
                  list contains paid placements, these will also be clearly
                  marked.
                </p>
              </div>
              <DialogFooter className="w-full flex items-center justify-end">
                <Button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="bg-primary py-6 px-5 text-base font-medium"
                >
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => scroll("left")}
            className="rounded-full"
            disabled={isLeftDisabled}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll("right")}
            className="rounded-full"
            disabled={isRightDisabled}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <div ref={scrollRef} className="w-full overflow-x-hidden scroll-smooth">
        <div className="flex gap-2.5 w-max p-1"></div>
      </div>
    </div>
  );
};

export default ScrollSectionForRestaurants;
