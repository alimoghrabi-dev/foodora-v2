import z from "zod/v3";

export const LoginValidationSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .trim()
    .min(1, { message: "Email is required" }),
  password: z.string().trim().min(1, { message: "Password is required" }),
});

export const RegisterValidationSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, { message: "First name is required" })
      .max(15, { message: "First name is too long" }),
    lastName: z
      .string()
      .trim()
      .min(1, { message: "Last name is required" })
      .max(15, { message: "Last name is too long" }),
    email: z
      .string()
      .email({ message: "Invalid email address" })
      .trim()
      .min(1, { message: "Email is required" }),
    birthDate: z
      .date()
      .transform((val) => new Date(val))
      .refine(
        (date) => {
          const today = new Date();
          const age =
            today.getFullYear() -
            date.getFullYear() -
            (today <
            new Date(today.getFullYear(), date.getMonth(), date.getDate())
              ? 1
              : 0);
          return age >= 13 && age <= 90;
        },
        {
          message: "Please enter a valid age",
        }
      ),
    password: z.string().trim().min(1, { message: "Password is required" }),
    confirmPassword: z
      .string()
      .trim()
      .min(1, { message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
