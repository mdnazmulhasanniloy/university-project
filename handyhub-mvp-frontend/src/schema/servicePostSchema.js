import { object, z } from "zod";

const createServicePostSchema = z.object({
  banner: z.array(z.instanceof(File)),
  title: z.string({ required_error: "Title is required" }),
  address: z.string({ required_error: "Address is required" }),
  description: z.string({ required_error: "Description is required" }),
  services: z.array(z.instanceof(Object)),
  tags: z.array(z.string()),
});

const editServicePostSchema = z.object({
  banner: z.union([
    z.array(z.instanceof(File)),
    z.array(
      z.object({
        url: z.string().url("Invalid URL format"),
      }),
    ),
  ]),
  title: z.string({ required_error: "Title is required" }).optional(),
  address: z.string({ required_error: "Address is required" }).optional(),
  description: z
    .string({ required_error: "Description is required" })
    .optional(),
  services: z.array(z.instanceof(Object)).optional(),
  tags: z.array(z.union([z.string(), z.instanceof(Object)])).optional(),
});

export const servicePostValidations = {
  createServicePostSchema,
  editServicePostSchema,
};
