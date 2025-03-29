
import { z } from "zod";

export const waitlistFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters."
  }),
  email: z.string().email({
    message: "Please enter a valid email address."
  }),
  emailUpdates: z.boolean().default(false),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  markets: z.string().optional(),
  challenges: z.string().optional(),
  insights: z.string().optional(),
  earlyAccess: z.enum(["yes", "no", "maybe"]).optional()
});

export type WaitlistFormValues = z.infer<typeof waitlistFormSchema>;
