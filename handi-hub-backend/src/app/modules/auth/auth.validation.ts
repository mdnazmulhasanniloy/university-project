import { z } from 'zod';

const loginZodValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required!',
    }),
    password: z.string({
      required_error: 'Password is required!',
    }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required!',
    }),
  }),
});

const googleSignIn = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required!' }),
    role: z.string({ required_error: 'Role is required!' }).optional(),
    name: z.string({ required_error: 'Name is required!' }).optional(),
    phoneNumber: z
      .string({ required_error: 'Phone number is required' })
      .optional(),
  }),
});

export const authValidation = {
  refreshTokenValidationSchema,
  loginZodValidationSchema,
  googleSignIn,
};
