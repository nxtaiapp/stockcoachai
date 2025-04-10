
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Control } from "react-hook-form";
import { OnboardingFormValues } from "@/lib/schemas/onboardingSchema";
import { tradingStyles } from "@/lib/constants/tradingStyles";

interface TradingStyleFieldProps {
  control: Control<OnboardingFormValues>;
}

export const TradingStyleField = ({ control }: TradingStyleFieldProps) => {
  return (
    <FormField
      control={control}
      name="trading_style"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-lg font-medium">What is your preferred trading style?</FormLabel>
          <FormControl>
            <RadioGroup 
              onValueChange={field.onChange} 
              defaultValue={field.value}
              className="space-y-4"
            >
              {tradingStyles.map((style) => (
                <div key={style.id} className={`
                  flex items-start space-x-2 border rounded-lg p-4 transition-all
                  ${field.value === style.id ? 'border-primary bg-primary/5' : 'border-border'}
                `}>
                  <RadioGroupItem value={style.id} id={style.id} className="mt-1" />
                  <Label htmlFor={style.id} className="flex-1 cursor-pointer">
                    <div className="font-medium">{style.title}</div>
                    <div className="text-sm text-muted-foreground">{style.description}</div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
