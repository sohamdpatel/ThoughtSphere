import {z} from 'zod'

export const signInValidation = z.object({
  identifier: z.string().min(4, "Email or Username is required or its about minimum 4 letters"),
  password: z.string().min(1, "Password is required"),
});