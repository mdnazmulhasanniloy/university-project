import { z } from "zod";

export const imageFileSchema = z
  .array(
    z.object({
      uid: z.string(),
      name: z.string(),
      status: z.string(),
      url: z.string().optional(),
      originFileObj: z
        .instanceof(File)
        .refine(
          (file) => file.type.startsWith("image/"),
          "Only image files are accepted",
        )
        .optional(),
    }),
  )
  .min(1, { message: "At least one image is required" });

export const imageFileSchemaOptional = z
  .array(
    z.object({
      uid: z.string(),
      name: z.string(),
      status: z.string(),
      url: z.string().optional(),
      originFileObj: z
        .instanceof(File)
        .refine(
          (file) => file.type.startsWith("image/"),
          "Only image files are accepted",
        )
        .optional(),
    }),
  )
  .optional();

export const videoFileSchema = z
  .array(
    z.object({
      uid: z.string(),
      name: z.string(),
      status: z.string(),
      url: z.string().optional(),
      originFileObj: z
        .instanceof(File)
        .refine(
          (file) => file.type.startsWith("video/"),
          "Only video files are accepted",
        )
        .optional(),
    }),
  )
  .min(1, { message: "At least one video is required" });

export const videoFileSchemaOptional = z
  .array(
    z.object({
      uid: z.string(),
      name: z.string(),
      status: z.string(),
      url: z.string().optional(),
      originFileObj: z
        .instanceof(File)
        .refine(
          (file) => file.type.startsWith("video/"),
          "Only video files are accepted",
        )
        .optional(),
    }),
  )
  .min(1, { message: "At least one video is required" })
  .optional();
