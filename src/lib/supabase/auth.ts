import z from 'zod'

export const passwordSchema = z.object({
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
})

// Type for password schema
export type PasswordSchema = z.infer<typeof passwordSchema>

export const emailSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
})

// Type for password schema
export type EmailSchema = z.infer<typeof emailSchema>

// Validation schema
export const loginSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: passwordSchema.shape.password,
})

export type LoginSchema = z.infer<typeof loginSchema>

export const createLoginSchema = loginSchema
export type CreateLoginSchema = LoginSchema
