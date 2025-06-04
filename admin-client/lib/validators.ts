import * as z from "zod";

export const LoginValidationSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .trim()
    .nonempty({ message: "Email is required" }),
  password: z.string().trim().nonempty({ message: "Password is required" }),
});
