import LoginForm from "@/components/forms/LoginForm";
import QueryWrapper from "@/components/providers/query-wrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <QueryWrapper>
      <LoginForm />
    </QueryWrapper>
  );
}
