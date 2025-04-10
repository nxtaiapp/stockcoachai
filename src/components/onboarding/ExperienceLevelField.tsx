
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { OnboardingFormValues } from "@/lib/schemas/onboardingSchema";

interface ExperienceLevelFieldProps {
  control: Control<OnboardingFormValues>;
}

export const ExperienceLevelField = ({ control }: ExperienceLevelFieldProps) => {
  return (
    <FormField
      control={control}
      name="experience_level"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-lg font-medium">What is your trading experience level?</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select your experience level" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="beginner">Beginner - Just getting started</SelectItem>
              <SelectItem value="intermediate">Intermediate - Some experience trading</SelectItem>
              <SelectItem value="advanced">Advanced - Experienced trader</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
