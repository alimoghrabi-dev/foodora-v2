"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

const COLORS = [
  "from-pink-400/20 to-purple-500/20",
  "from-blue-400/20 to-cyan-500/20",
  "from-green-400/20 to-emerald-500/20",
  "from-yellow-400/20 to-orange-500/20",
  "from-red-400/20 to-pink-500/20",
  "from-indigo-400/20 to-blue-500/20",
];

type BlobConfig = {
  color: string;
  size: number;
  top: number;
  left: number;
};

function generateBlobs(): BlobConfig[] {
  const blobCount = Math.floor(Math.random() * 3) + 3;
  return Array.from({ length: blobCount }).map(() => ({
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: Math.floor(Math.random() * 160) + 120,
    top: Math.floor(Math.random() * 100),
    left: Math.floor(Math.random() * 100),
  }));
}

export default function AnimatedBackground() {
  const [blobs, setBlobs] = useState<BlobConfig[]>([]);

  useEffect(() => {
    setBlobs(generateBlobs());
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-3xl opacity-40 bg-gradient-to-br ${blob.color}`}
          style={{
            width: `${blob.size}px`,
            height: `${blob.size}px`,
            top: `${blob.top}%`,
            left: `${blob.left}%`,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 20, 0],
            scale: [1, 1.2, 0.9, 1],
            rotate: [0, 90, 180, 360],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
