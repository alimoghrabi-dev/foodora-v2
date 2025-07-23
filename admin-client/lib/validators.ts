import * as z from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

const lebanesePhoneRegex = /^(01|03|70|71|76|78|79|81|82)\d{6}$/;

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const dailyHoursSchema = z
  .object({
    open: z.string().optional(),
    close: z.string().optional(),
  })
  .refine(
    ({ open, close }) => {
      if (!open && !close) return true;

      if (!open || !close) return false;

      const isOpenValid = timeRegex.test(open);
      const isCloseValid = timeRegex.test(close);
      if (!isOpenValid || !isCloseValid) return false;

      return open <= close;
    },
    {
      message: "Open and close times are required. Close must be after open.",
      path: ["close"],
    }
  );

const imageSchema = z.union([
  z
    .instanceof(File, { message: "Image must be a valid file" })
    .refine((file) => allowedTypes.includes(file.type), {
      message:
        "Invalid file type. Only JPEG, PNG, JPG, and WebP files are allowed.",
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "Image must be less than or equal to 10MB",
    }),
  z
    .string()
    .url({ message: "Each URL must be a valid image URL" })
    .refine((url) => url.startsWith("http") || url.startsWith("https"), {
      message: "Invalid URL format. URL must start with 'http' or 'https'.",
    }),
]);

export const LoginValidationSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .trim()
    .min(1, { message: "Email is required" }),
  password: z.string().trim().min(1, { message: "Password is required" }),
});

export const AddMenuItemValidationSchema = z.object({
  title: z.string().trim().min(1, { message: "Title is required" }),
  description: z
    .string()
    .trim()
    .min(1, { message: "Description is required" })
    .max(250, { message: "Description must be less than 250 characters" }),
  price: z.number().min(0.01, { message: "Price must be greater than zero" }),
  category: z.string().nonempty({ message: "Category is required" }),
  image: imageSchema.optional(),
  tags: z
    .array(z.string())
    .max(3, { message: "You can add up to 3 tags" })
    .optional(),
  ingredients: z.array(z.string()).optional(),
  variants: z
    .array(
      z.object({
        name: z.string().trim().min(1, "Variant name is required"),
        price: z.number().min(0).optional(),
        isAvailable: z.boolean().default(true).optional(),
      })
    )
    .optional(),
  isAvailable: z.boolean().default(false).optional(),
});

export const PublishRestaurantValidationSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  description: z
    .string()
    .trim()
    .min(1, { message: "Description is required" })
    .max(400, { message: "Description must be less than 400 characters" }),
  cuisine: z.string().trim().min(1, { message: "Cuisine is required" }),
  address: z.object({
    street: z
      .string()
      .trim()
      .min(1, { message: "Street is required" })
      .max(50, { message: "Street must be less than 50 characters" }),
    city: z
      .string()
      .trim()
      .min(1, { message: "City is required" })
      .max(50, { message: "City must be less than 50 characters" }),
    state: z
      .string()
      .trim()
      .min(1, { message: "State is required" })
      .max(50, { message: "State must be less than 50 characters" }),
    zipCode: z
      .string()
      .trim()
      .min(1, { message: "Zip code is required" })
      .max(10, { message: "Zip code must be less than 10 characters" }),
    country: z.string(),
    latitude: z
      .number()
      .min(-90)
      .max(90)
      .refine((value) => !Number.isNaN(value), {
        message: "Invalid latitude",
      })
      .optional(),
    longitude: z
      .number()
      .min(-180)
      .max(180)
      .refine((value) => !Number.isNaN(value), {
        message: "Invalid longitude",
      })
      .optional(),
  }),
  openingHours: z.object({
    monday: dailyHoursSchema,
    tuesday: dailyHoursSchema,
    wednesday: dailyHoursSchema,
    thursday: dailyHoursSchema,
    friday: dailyHoursSchema,
    saturday: dailyHoursSchema,
    sunday: dailyHoursSchema,
  }),
  phoneNumber: z
    .string()
    .trim()
    .min(1, { message: "Phone number is required" })
    .max(20, { message: "Phone number must be less than 20 characters" })
    .regex(lebanesePhoneRegex, {
      message: "Invalid Lebanese phone number (e.g., 03XXXXXX)",
    }),
  website: z
    .string()
    .url({ message: "Invalid website URL" })
    .or(z.literal(""))
    .optional(),
  logo: imageSchema,
  coverImage: imageSchema,
});

export const OpeningHoursChangerValidationSchema = z.object({
  openingHours: z.object({
    monday: dailyHoursSchema,
    tuesday: dailyHoursSchema,
    wednesday: dailyHoursSchema,
    thursday: dailyHoursSchema,
    friday: dailyHoursSchema,
    saturday: dailyHoursSchema,
    sunday: dailyHoursSchema,
  }),
});

export const EditItemVariantValidationSchema = z.object({
  name: z.string().trim().min(1, "Variant name is required"),
  price: z.number().min(0).optional(),
  isAvailable: z.boolean().default(true).optional(),
});

export const RestaurantManagementValidationSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  description: z
    .string()
    .trim()
    .min(1, { message: "Description is required" })
    .max(400, { message: "Description must be less than 400 characters" }),
  cuisine: z.string().trim().min(1, { message: "Cuisine is required" }),
  address: z.object({
    street: z
      .string()
      .trim()
      .min(1, { message: "Street is required" })
      .max(50, { message: "Street must be less than 50 characters" }),
    city: z
      .string()
      .trim()
      .min(1, { message: "City is required" })
      .max(50, { message: "City must be less than 50 characters" }),
    state: z
      .string()
      .trim()
      .min(1, { message: "State is required" })
      .max(50, { message: "State must be less than 50 characters" }),
    zipCode: z
      .string()
      .trim()
      .min(1, { message: "Zip code is required" })
      .max(10, { message: "Zip code must be less than 10 characters" }),
    country: z.string(),
    latitude: z
      .number()
      .min(-90)
      .max(90)
      .refine((value) => !Number.isNaN(value), {
        message: "Invalid latitude",
      })
      .optional(),
    longitude: z
      .number()
      .min(-180)
      .max(180)
      .refine((value) => !Number.isNaN(value), {
        message: "Invalid longitude",
      })
      .optional(),
  }),
  phoneNumber: z
    .string()
    .trim()
    .min(1, { message: "Phone number is required" })
    .max(20, { message: "Phone number must be less than 20 characters" })
    .regex(lebanesePhoneRegex, {
      message: "Invalid Lebanese phone number (e.g., 03XXXXXX)",
    }),
  website: z
    .string()
    .url({ message: "Invalid website URL" })
    .or(z.literal(""))
    .optional(),
  logo: imageSchema,
  coverImage: imageSchema,
});

export const ItemSaleValidationSchema = z
  .object({
    saleType: z.enum(["fixed", "percentage"]),
    saleAmount: z.number({ message: "Amount is required" }),
    saleStartDate: z.date().optional(),
    saleEndDate: z.date().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.saleType === "fixed") {
      if (data.saleAmount <= 0) {
        ctx.addIssue({
          path: ["saleAmount"],
          code: z.ZodIssueCode.custom,
          message: "Fixed sale amount must be greater than 0",
        });
      }
    } else if (data.saleType === "percentage") {
      if (data.saleAmount <= 0 || data.saleAmount > 100) {
        ctx.addIssue({
          path: ["saleAmount"],
          code: z.ZodIssueCode.custom,
          message: "Percentage must be between 1 and 100",
        });
      }
    }

    const now = new Date();

    if (data.saleStartDate && !data.saleEndDate) {
      ctx.addIssue({
        path: ["saleEndDate"],
        code: z.ZodIssueCode.custom,
        message: "Sale end date is required",
      });
    }

    if (data.saleStartDate && data.saleStartDate <= now) {
      ctx.addIssue({
        path: ["saleStartDate"],
        code: z.ZodIssueCode.custom,
        message: "Sale start date must be in the future",
      });
    }

    if (data.saleStartDate && data.saleEndDate) {
      if (data.saleEndDate <= data.saleStartDate) {
        ctx.addIssue({
          path: ["saleEndDate"],
          code: z.ZodIssueCode.custom,
          message: "Sale end date must be after the sale start date",
        });
      }
    }
  });
