import { z } from "zod";
import createUserSchema from "./user";

export const CreateAdminSchema = createUserSchema.extend({
  role: z.enum(["user", "admin"]),
});

export type CreateAdminType = z.infer<typeof CreateAdminSchema>;

export const updateAdminSchema = CreateAdminSchema.partial();

export type TypeUpdate = z.infer<typeof updateAdminSchema>;
