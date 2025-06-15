const { z } = require("zod");

const createContractSchema = z.object({
  images: z.union([
    z.array(z.instanceof(File)),
    z.array(
      z.object({
        url: z.string().url("Invalid URL format"),
      }),
    ),
  ]),
  contractType: z.enum(
    ["Hourly", "Project Based"],
    "Contract type can't be anything other than 'Hourly' or 'Project Based'",
  ),
  completionDate: z.date({
    required_error: "Completion date is required",
    invalid_type_error: "Expected date, received string",
  }),

  description: z
    .string({ required_error: "Description is required" })
    .min(1, { message: "Description is required" }),
});

export const ContractValidations = { createContractSchema };
