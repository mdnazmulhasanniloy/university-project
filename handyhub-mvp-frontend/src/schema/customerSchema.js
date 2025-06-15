import { z } from "zod";

export const customerProfileSchema = z.object({
  name: z.string().optional(),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" }),
  phoneNumber: z.string().optional(),
});

export const customerProfileUpdateSchema = z.object({
  name: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  banner: z
    .union([
      z.array(z.instanceof(File)),
      z.array(
        z.object({
          url: z.string().url("Invalid URL format"),
        }),
      ),
    ])
    .optional(),
});
