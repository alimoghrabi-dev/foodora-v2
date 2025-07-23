import React from "react";
import QueryWrapper from "@/components/providers/query-wrapper";
import LoginForm from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

const LoginPage = () => {
  return (
    <QueryWrapper>
      <LoginForm />
    </QueryWrapper>
  );
};

export default LoginPage;
