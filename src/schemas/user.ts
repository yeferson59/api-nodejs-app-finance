import { z } from "zod";

const createUserSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name must be 50 characters or less" })
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, {
      message: "Name must contain only letters and spaces",
    }),

  last_name: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters long" })
    .max(50, { message: "Last name must be 50 characters or less" })
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, {
      message: "Last name must contain only letters and spaces",
    }),

  email: z.string().email({ message: "Invalid email format" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(16, { message: "Password must be 16 characters or less" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/\d/, { message: "Password must contain at least one digit" })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character",
    }),
});

export default createUserSchema;

export const updateUserSchema = createUserSchema.partial();

export type TypeUpdateUser = z.infer<typeof updateUserSchema>;
