"use client";

import * as z from "zod";

export const createSubscriptionSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(1, { message: "Title is required" }),
  shortTitle: z
    .string({ required_error: "Short title is required" })
    .min(1, { message: "Short title is required" }),
  durationDay: z.coerce
    .string({ required_error: "Duration is required" })
    .min(1, { message: "Duration is required" }),
  shortDescription: z
    .string({ required_error: "Description is required" })
    .min(50, { message: "minimum enter 50 character" }),
  price: z.coerce
    .number({ required_error: "Price is required" })
    .min(1, { message: "Price is required" }),
});
