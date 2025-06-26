import React from "react";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

const NotPublishedBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-yellow-100 via-yellow-50 to-white dark:from-yellow-900 dark:via-yellow-800 dark:to-yellow-700 border border-yellow-300 dark:border-yellow-600 rounded-lg shadow-lg p-6 flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <AlertCircle className="text-yellow-500 dark:text-yellow-300 w-6 h-6" />
        <div>
          <h2 className="text-lg font-semibold text-yellow-700 dark:text-yellow-100">
            Your restaurant is not published yet!
          </h2>
          <p className="text-sm text-yellow-600 dark:text-yellow-200">
            {
              "Customers can't find or order from your restaurant until you publish it."
            }
          </p>
        </div>
      </div>
      <Link
        href="/publish"
        className="bg-yellow-500 dark:bg-yellow-400 text-white dark:text-black font-medium px-5 py-2 rounded-sm hover:bg-yellow-600 dark:hover:bg-yellow-300 transition-all duration-200"
      >
        Publish Now
      </Link>
    </div>
  );
};

export default NotPublishedBanner;
