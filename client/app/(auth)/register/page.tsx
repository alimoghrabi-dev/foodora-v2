import RegisterForm from "@/components/auth/RegisterForm";
import QueryWrapper from "@/components/providers/query-wrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
};

const RegisterPage = () => {
  return (
    <QueryWrapper>
      <RegisterForm />
    </QueryWrapper>
  );
};

export default RegisterPage;
