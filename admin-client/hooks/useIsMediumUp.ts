import { useEffect, useState } from "react";

export const useIsMediumUp = () => {
  const [isMdUp, setIsMdUp] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const handleChange = () => setIsMdUp(mediaQuery.matches);
    handleChange();

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isMdUp;
};
