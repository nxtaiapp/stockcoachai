
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Control, UseFormSetValue } from "react-hook-form";
import { OnboardingFormValues } from "@/lib/schemas/onboardingSchema";

interface TradingPlanFieldProps {
  control: Control<OnboardingFormValues>;
  setValue: UseFormSetValue<OnboardingFormValues>;
}

export const TradingPlanField = ({ control, setValue }: TradingPlanFieldProps) => {
  return (
    <FormField
      control={control}
      name="has_trading_plan"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-lg font-medium">
            Do you currently have a trading plan?
          </FormLabel>
          <div className="flex gap-4 mt-2">
            <RadioGroup
              value={field.value ? "yes" : "no"}
              onValueChange={(value) => setValue("has_trading_plan", value === "yes")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="has-plan-yes" value="yes" />
                <Label htmlFor="has-plan-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="has-plan-no" value="no" />
                <Label htmlFor="has-plan-no">No</Label>
              </div>
            </RadioGroup>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
