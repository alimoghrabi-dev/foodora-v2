import { getCurrentToken } from "@/lib/server";
import ServerEndpoint from "@/lib/server-endpoint";
import { AlertCircle, CheckCircle, ChevronLeft } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { updateEmailVerifiedInCookie } from "@/lib/session-updates";

interface Props {
  searchParams: { token?: string };
}

export default async function VerificationEmailStatusPage({
  searchParams,
}: Props) {
  const { token } = await searchParams;

  if (!token) {
    redirect("/");
  }

  const cookieToken = await getCurrentToken();
  let errorOccurred = false;

  try {
    const res = await ServerEndpoint.post(
      "/admin-restaurant/verify-email",
      { token },
      {
        headers: {
          Authorization: `Bearer ${cookieToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (res.status === 201) {
      await updateEmailVerifiedInCookie();
    }
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
    <section className="relative w-full h-screen flex flex-col items-center justify-center bg-green-50 dark:bg-neutral-950 p-6 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-100px] left-[-100px] w-[350px] h-[350px] bg-green-300 dark:bg-green-700 opacity-30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-100px] right-[-80px] w-[250px] h-[250px] bg-blue-300 dark:bg-blue-700 opacity-20 rounded-full blur-[100px]" />
        <div className="absolute top-[50%] left-[50%] w-[200px] h-[200px] bg-purple-300 dark:bg-purple-700 opacity-20 rounded-full blur-[100px] transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      <CheckCircle className="text-green-600 w-14 h-14 md:w-16 md:h-16 mb-6 drop-shadow-sm" />
      <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-800 dark:text-white tracking-tight mb-3">
        Email Verified!
      </h1>
      <p className="text-base text-neutral-600 dark:text-neutral-400 text-center max-w-md mb-6">
        Your email has been successfully verified. You can now access all
        features of your restaurant dashboard.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-1 px-5 py-2 text-sm md:text-base font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition"
      >
        <ChevronLeft className="w-4 h-4" />
        Back Home
      </Link>
    </section>
  );
}
