
import * as z from "zod";

// Define the form schema for the onboarding survey
export const onboardingFormSchema = z.object({
  experience_level: z.string({
    required_error: "Please select your trading experience"
  }),
  trading_style: z.string({
    required_error: "Please select your trading style"
  }),
  trading_goals: z.string().min(1, "Please enter your trading goals"),
  has_trading_plan: z.boolean()
});

export type OnboardingFormValues = z.infer<typeof onboardingFormSchema>;
