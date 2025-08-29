"use client";

import React from "react";
import { motion } from "motion/react";

const CartPageLoading: React.FC = () => {
  const loader = "animate-pulse bg-gray-200 rounded-md";

  return (
    <section className="w-full flex flex-col gap-y-5">
      <div className="w-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="h-8 w-48 bg-gray-200 rounded-md animate-pulse"
        />
      </div>

      <div className="w-full border rounded-xl overflow-hidden shadow-sm">
        <div className="w-full flex items-center border-b p-3">
          <div className={`${loader} h-6 w-32`} />
          <div className="ml-auto flex gap-x-6">
            <div className={`${loader} h-6 w-16`} />
            <div className={`${loader} h-6 w-16`} />
            <div className={`${loader} h-6 w-16`} />
          </div>
        </div>

        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center justify-between p-3 border-b last:border-0"
          >
            <div className="flex items-center gap-x-3">
              <div className={`${loader} h-12 w-12`} />
              <div className="flex flex-col gap-y-2">
                <div className={`${loader} h-4 w-32`} />
                <div className={`${loader} h-4 w-24`} />
              </div>
            </div>
            <div className="flex gap-x-6">
              <div className={`${loader} h-4 w-12`} />
              <div className={`${loader} h-4 w-12`} />
              <div className={`${loader} h-4 w-12`} />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CartPageLoading;
