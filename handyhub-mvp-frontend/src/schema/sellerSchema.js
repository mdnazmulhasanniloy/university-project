import { isValidPhoneNumber } from "react-phone-number-input";
import * as z from "zod";

export const sellerDetailsSchema = z.object({
  name: z.string({ required_error: "Name is required" }).min(1, {
    message: "Name is required",
  }),
  aboutMe: z
    .string({ required_error: "About me is required" })
    .min(1, { message: "About me is required" }),
  category: z.string({ required_error: "Category is required" }),

  services: z.array(z.instanceof(Object)),

  serviceType: z.string({ required_error: "Service type is required" }),

  serviceCharge: z.string().optional(),
  serviceChargeType: z.enum(["fixed", "hourly"]).optional(),

  phoneNumber: z
    .string({ required_error: "Contact is required" })
    .min(1, { message: "Contact number is required" })
    .refine(isValidPhoneNumber, { message: "Invalid phone number" })
    .or(z.literal("")),

  profile: z.union([
    z.array(z.instanceof(File)).optional(),
    z
      .array(
        z.object({
          url: z.string().url("Invalid URL format"),
        }),
      )
      .optional(),
  ]),
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
  documents: z
    .union([
      z.array(z.instanceof(File)),
      z.array(z.object({ url: z.string().url("Invalid URL format") })),
    ])
    .refine((val) => val.length > 0, {
      message: "Please upload at least one certification.",
    }),
  address: z
    .string({ required_error: "Address is required" })
    .min(1, { message: "Address is required" }),
});

export const sellerCreateActivitySchema = z.object({
  subcategory: z.string({ required_error: "Subcategory is required" }),
  customer: z.string().optional(),
  title: z.string({ required_error: "Title is required" }),
  description: z
    .string({ required_error: "Description is required" })
    .min(30, { message: "Description must be at least 30 characters long" }),

  beforeStory: z.array(z.instanceof(File), {
    message: "Before image is required",
  }),

  afterStory: z.array(z.instanceof(File), {
    message: "After image is required",
  }),
});

export const sellerUpdateActivitySchema = z.object({
  category: z.string({ required_error: "Category is required" }),
  subcategory: z.string({ required_error: "Subcategory is required" }),
  customer: z.string().optional(),
  title: z.string({ required_error: "Title is required" }),
  description: z
    .string({ required_error: "Description is required" })
    .min(30, { message: "Description must be at least 30 characters long" }),

  beforeStory: z.array(z.object({ url: z.string().url("Invalid URL format") })),

  afterStory: z.array(z.object({ url: z.string().url("Invalid URL format") })),
});
