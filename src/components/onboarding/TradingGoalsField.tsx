
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import { OnboardingFormValues } from "@/lib/schemas/onboardingSchema";

interface TradingGoalsFieldProps {
  control: Control<OnboardingFormValues>;
}

export const TradingGoalsField = ({ control }: TradingGoalsFieldProps) => {
  return (
    <FormField
      control={control}
      name="trading_goals"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-lg font-medium">
            What are your trading goals?
          </FormLabel>
          <FormControl>
            <Textarea 
              placeholder="e.g., 'Consistent $500 days', 'Supplement my income', etc."
              className="resize-none min-h-[100px]"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
