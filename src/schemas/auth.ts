import { z } from "zod";
import createUserSchema from "./user";

export const loginSchema = createUserSchema.omit({
  name: true,
  last_name: true,
});

export type typeSignUp = z.infer<typeof createUserSchema>;

export type typeLogin = z.infer<typeof loginSchema>;
