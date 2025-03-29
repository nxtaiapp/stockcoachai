
import React from "react";
import { useFormContext } from "react-hook-form";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl,
  FormDescription, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WaitlistFormValues } from "@/schemas/waitlistFormSchema";

export function TradingExperienceSection() {
  const form = useFormContext<WaitlistFormValues>();
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Optional but Insightful</h3>
      
      <FormField 
        control={form.control} 
        name="experienceLevel" 
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>1. What's your trading experience level?</FormLabel>
            <FormControl>
              <RadioGroup 
                onValueChange={field.onChange} 
                defaultValue={field.value} 
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="beginner" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Beginner (just getting started)
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="intermediate" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Intermediate (some consistency, still learning)
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="advanced" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Advanced (profitable or funded trader)
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} 
      />
      
      <FormField 
        control={form.control} 
        name="markets" 
        render={({ field }) => (
          <FormItem>
            <FormLabel>2. What markets do you trade?</FormLabel>
            <FormDescription>
              E.g., NASDAQ, Stocks, Options, Forex, Crypto, etc.
            </FormDescription>
            <FormControl>
              <Input placeholder="Markets you trade in" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} 
      />
      
      <FormField 
        control={form.control} 
        name="challenges" 
        render={({ field }) => (
          <FormItem>
            <FormLabel>3. What are your biggest trading challenges right now?</FormLabel>
            <FormDescription>
              E.g., managing emotions, finding good entries, journaling consistency, sticking to the plan, etc.
            </FormDescription>
            <FormControl>
              <Textarea placeholder="Your trading challenges..." className="resize-none" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} 
      />
      
      <FormField 
        control={form.control} 
        name="insights" 
        render={({ field }) => (
          <FormItem>
            <FormLabel>4. What kind of insights would you want from an AI trading coach?</FormLabel>
            <FormDescription>
              E.g., trade reviews, psychology feedback, risk management tips, pattern recognition, etc.
            </FormDescription>
            <FormControl>
              <Textarea placeholder="Insights you're looking for..." className="resize-none" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} 
      />
      
      <FormField 
        control={form.control} 
        name="earlyAccess" 
        render={({ field }) => (
          <FormItem>
            <FormLabel>5. Would you be interested in early access or beta testing?</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="maybe">Maybe</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} 
      />
    </div>
  );
}
