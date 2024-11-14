import { z } from "zod";

const regSchema = z.object({
  email: z.string().email(),
  userName: z.string().min(1, "Username is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(50, "Password must be less than 50 characters"),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export { regSchema, loginSchema };
