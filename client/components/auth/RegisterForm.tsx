"use client";

import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterValidationSchema } from "@/lib/validators";
import { sanitizeInput } from "@/lib/utils";
import { motion } from "motion/react";
import DatePicker from "react-datepicker";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { registerAction } from "@/lib/actions/client-actions";
import { toast } from "sonner";
import z from "zod/v3";
import "react-datepicker/dist/react-datepicker.css";

const RegisterForm: React.FC = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<z.infer<typeof RegisterValidationSchema>>({
    resolver: zodResolver(RegisterValidationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      birthDate: undefined,
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate: registerMutation, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof RegisterValidationSchema>) => {
      await registerAction(data);
    },
    onSuccess: () => {
      router.push("/login");
      toast.success("Your account has been created successfully, Login now.", {
        style: {
          color: "#fff",
          background: "#0ec420",
        },
      });

      form.reset();
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong", {
        style: {
          color: "#fff",
          background: "#e7000b",
        },
      });

      form.resetField("password");
      form.resetField("confirmPassword");
    },
  });

  return (
    <Form {...form}>
      <motion.form
        onSubmit={form.handleSubmit((data) => registerMutation(data))}
        method="POST"
        className="w-full sm:w-[75%] xl:w-1/2 space-y-8 p-6"
        noValidate
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <div className="w-full flex flex-col items-center justify-center gap-y-1">
          <h2 className="text-neutral-800 font-bold text-3xl md:text-4xl text-center">
            Create your account
          </h2>
          <p className="text-base font-normal text-neutral-500">
            Join Foodora and start ordering.
          </p>
        </div>
        <div className="w-full flex flex-col gap-y-4">
          <div className="w-full grid grid-cols-2 gap-1.5">
            <FormField
              name="firstName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    First Name
                    <span className="text-blue-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Your first name"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(sanitizeInput(e.target.value))
                      }
                      className="w-full rounded-sm bg-white border-neutral-300 shadow-none focus-visible:ring-1 transition-all hover:border-neutral-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="lastName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    Last Name
                    <span className="text-blue-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Your last name"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(sanitizeInput(e.target.value))
                      }
                      className="w-full rounded-sm bg-white border-neutral-300 shadow-none focus-visible:ring-1 transition-all hover:border-neutral-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5">
                  Email
                  <span className="text-blue-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    value={field.value}
                    placeholder="Your email address"
                    onChange={(e) =>
                      field.onChange(sanitizeInput(e.target.value))
                    }
                    className="w-full rounded-sm bg-white border-neutral-300 shadow-none focus-visible:ring-1 transition-all hover:border-neutral-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="birthDate"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5">
                  Birth Date
                  <span className="text-blue-500">*</span>
                </FormLabel>
                <FormControl>
                  <DatePicker
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    popperClassName="!z-[9999]"
                    dateFormat="MMMM d, yyyy"
                    placeholderText="Select your birthdate"
                    autoComplete="off"
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={90}
                    maxDate={
                      new Date(
                        new Date().setFullYear(new Date().getFullYear() - 13)
                      )
                    }
                    minDate={
                      new Date(
                        new Date().setFullYear(new Date().getFullYear() - 90)
                      )
                    }
                    calendarClassName="calendar-theme"
                    customInput={
                      <Input className="w-full rounded-sm bg-white border-neutral-300 shadow-none focus-visible:ring-1 transition-all hover:border-neutral-400" />
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full grid grid-cols-2 gap-1.5">
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    Password
                    <span className="text-blue-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="w-full relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Your password"
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(sanitizeInput(e.target.value))
                        }
                        onPaste={(e) => e.preventDefault()}
                        className="w-full rounded-sm bg-white border-neutral-300 shadow-none focus-visible:ring-1 transition-all hover:border-neutral-400"
                      />
                      <div className="absolute right-0 top-0 pr-2 py-[6px]">
                        {showPassword ? (
                          <EyeOff
                            size={23}
                            onClick={() => setShowPassword(false)}
                            className="text-neutral-800 hover:text-neutral-700 cursor-pointer transition"
                          />
                        ) : (
                          <Eye
                            size={23}
                            onClick={() => setShowPassword(true)}
                            className="text-neutral-800 hover:text-neutral-700 cursor-pointer transition"
                          />
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="confirmPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    Confirm Password
                    <span className="text-blue-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(sanitizeInput(e.target.value))
                      }
                      onPaste={(e) => e.preventDefault()}
                      className="w-full rounded-sm bg-white border-neutral-300 shadow-none focus-visible:ring-1 transition-all hover:border-neutral-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button
          type="submit"
          disabled={isPending}
          className="w-full rounded-full py-6 text-base font-bold"
        >
          {isPending ? <Loader2 className="animate-spin" /> : "Create account"}
        </Button>
        <div className="w-full flex items-center justify-between gap-x-4">
          <div className="w-full h-px bg-neutral-300" />
          <p className="text-sm font-bold text-neutral-500 uppercase">or</p>
          <div className="w-full h-px bg-neutral-300" />
        </div>
        <button
          type="button"
          className="w-full py-3.5 rounded-full text-base font-bold flex items-center justify-center gap-x-4 bg-white border border-neutral-300 text-neutral-800 hover:bg-neutral-100 hover:opacity-80 cursor-pointer transition-all"
        >
          <Image
            src="/icons/google.png"
            alt="google"
            width={25}
            height={25}
            className="object-contain"
          />
          Sign up with Google
        </button>
        <span className="w-full flex items-center justify-center gap-x-1 text-neutral-600 font-medium text-sm">
          Have an acount?{" "}
          <Link
            href="/login"
            className="text-primary font-semibold hover:opacity-85 hover:underline hover:underline-offset-2 transition"
          >
            Log in
          </Link>
        </span>
      </motion.form>
    </Form>
  );
};

export default RegisterForm;
