"use client";

import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { sanitizeInput } from "@/lib/utils";
import { LoginValidationSchema } from "@/lib/validators";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { BsShieldLockFill } from "react-icons/bs";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoMdMail } from "react-icons/io";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { loginAdminAction } from "@/lib/actions/client.actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { z } from "zod";

const LoginForm: React.FC = () => {
  const router = useRouter();

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const form = useForm<z.infer<typeof LoginValidationSchema>>({
    resolver: zodResolver(LoginValidationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof LoginValidationSchema>) => {
      await loginAdminAction(data);
    },
    onSuccess: () => {
      form.reset();
      toast.success("Welcome Back! You have successfully logged in.");
      router.push("/");
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => loginMutation(data))}
        className="w-full flex flex-col gap-y-2"
        method="POST"
        noValidate
      >
        <div className="w-full flex flex-col items-center justify-center gap-y-1 mb-3">
          <h3 className="text-neutral-900 text-2xl font-semibold text-center">
            Welcome Back
          </h3>
          <span className="text-neutral-700 text-base font-medium">
            Log In to your admin account
          </span>
        </div>
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="w-full rounded-md bg-neutral-200/85 hover:bg-neutral-200/65 flex items-center justify-start gap-x-2 px-2.5 py-2 transition-all">
                  <IoMdMail size={23} className="text-neutral-700" />
                  <input
                    type="text"
                    value={field.value}
                    placeholder="Enter your Email"
                    onChange={(e) =>
                      field.onChange(sanitizeInput(e.target.value))
                    }
                    className="w-full outline-none bg-transparent placeholder:text-neutral-600 text-neutral-900 text-[15px] font-medium"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="w-full rounded-md bg-neutral-200/85 hover:bg-neutral-200/65 flex items-center justify-between gap-x-2 px-2.5 py-2 transition-all">
                  <BsShieldLockFill size={23} className="text-neutral-700" />
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    value={field.value}
                    placeholder="Enter your Password"
                    onChange={(e) =>
                      field.onChange(sanitizeInput(e.target.value))
                    }
                    className="w-full outline-none bg-transparent placeholder:text-neutral-600 text-neutral-900 text-[15px] font-medium"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                  />
                  {isPasswordVisible ? (
                    <FaEyeSlash
                      size={24}
                      onClick={togglePasswordVisibility}
                      className="text-neutral-900 hover:text-neutral-700 transition cursor-pointer"
                    />
                  ) : (
                    <FaEye
                      size={24}
                      onClick={togglePasswordVisibility}
                      className="text-neutral-900 hover:text-neutral-700 transition cursor-pointer"
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex items-center justify-end my-1">
          <Link
            href="/reset-password"
            className="w-fit text-end text-neutral-800 font-medium text-sm hover:text-neutral-600 transition"
          >
            Forgot password?
          </Link>
        </div>
        <Button
          type="submit"
          disabled={isPending}
          className="w-full cursor-pointer rounded-md bg-gradient-to-b from-neutral-700 via-neutral-800 to-neutral-900 text-white font-semibold shadow-[inset_0_1px_0_#ffffff20,0_4px_6px_rgba(0,0,0,0.6)] hover:shadow-[inset_0_1px_0_#ffffff30,0_2px_4px_rgba(0,0,0,0.4)] hover:opacity-85 transition-all duration-200"
        >
          {isPending ? <Loader2 className="animate-spin" /> : "Get Started"}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
