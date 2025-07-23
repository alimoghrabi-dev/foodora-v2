"use client";

import React, { useEffect, useState } from "react";
import CountUp from "react-countup";

interface SmartCountUpProps {
  end: number;
  duration?: number;
  delay?: number;
  formattingFn?: (n: number) => string;
}

const SmartCountUp: React.FC<SmartCountUpProps> = ({
  end,
  duration = 2.25,
  delay = 0,
  formattingFn,
}) => {
  const [hasMounted, setHasMounted] = useState<boolean>(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return 0;
  }

  return (
    <CountUp
      end={end}
      duration={duration}
      delay={delay}
      formattingFn={formattingFn}
    />
  );
};

export default SmartCountUp;
