import { AlertCircle, CheckCircle, ChevronLeft } from "lucide-react";
import ServerEndpoint from "@/lib/server-endpoint";
import { getCurrentToken } from "@/lib/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function VerifyEmail() {
  const cookieStore = cookies();
  const intent = (await cookieStore).get("verify_intent");

  if (!intent || intent.value !== "1") {
    redirect("/");
  }

  const token = await getCurrentToken();
  let errorOccurred = false;

  try {
    await ServerEndpoint.post(
      "/admin-restaurant/send-verification-email",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error(error);
    errorOccurred = true;
  }

  if (errorOccurred) {
    return (
      <section className="relative w-full h-screen flex flex-col items-center justify-center bg-red-50 p-6">
        <AlertCircle className="text-red-600 w-14 h-14 md:w-16 md:h-16 mb-6" />
        <h1 className="text-2xl md:text-3xl font-bold text-red-700 mb-4">
          Oops! Something went wrong.
        </h1>
        <p className="text-sm md:text-base text-red-600 dark:text-red-400 mb-8 text-center max-w-md">
          We couldn’t send the verification email. Please try again later or
          contact support.
        </p>
        <Link
          href="/"
          className="px-4 py-1.5 md:px-6 md:py-3 font-medium text-sm md:text-base bg-red-600 text-white rounded-lg hover:bg-red-700  transition"
        >
          Go back to Home
        </Link>
      </section>
    );
  }

  return (
    <section className="relative w-full h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute w-[400px] h-[400px] bg-yellow-400 dark:bg-yellow-600 opacity-30 rounded-full blur-[160px] top-[-120px] left-[-100px] animate-pulse-slow" />
        <div className="absolute w-[300px] h-[300px] bg-blue-300 dark:bg-blue-700 opacity-70 rounded-full blur-[140px] bottom-[-80px] right-[-100px] animate-pulse-slower" />
        <div className="absolute w-[250px] h-[250px] bg-purple-400 dark:bg-purple-700 rounded-full blur-[130px] top-[40%] left-[55%] transform -translate-x-1/2 -translate-y-1/2 animate-pulse-slowest" />
      </div>

      <div className="z-20 max-w-md w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl rounded-2xl px-8 py-10 flex flex-col items-center text-center space-y-5 transition-all duration-300">
        <CheckCircle className="text-green-500 w-14 h-14 drop-shadow-sm" />

        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-800 dark:text-white tracking-tight">
          Email Sent!
        </h1>

        <p className="text-[13px] sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          A verification link has been sent to your email address. Please check
          your inbox (or spam folder) and click the link to verify your account.
        </p>

        <Link
          href="/"
          className="mt-2 inline-flex items-center px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
        >
          <ChevronLeft size={16} className="mr-1.5" />
          Back to Home
        </Link>
      </div>
    </section>
  );
}
