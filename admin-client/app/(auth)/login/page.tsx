import LoginForm from "@/components/forms/LoginForm";
import QueryWrapper from "@/components/providers/query-wrapper";

export default function LoginPage() {
  return (
    <QueryWrapper>
      <LoginForm />
    </QueryWrapper>
  );
}
