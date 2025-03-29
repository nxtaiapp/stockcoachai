
import React from "react";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { WaitlistFormValues } from "@/schemas/waitlistFormSchema";

export function PersonalInfoSection() {
  const form = useFormContext<WaitlistFormValues>();
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Your Information</h3>
      
      <FormField 
        control={form.control} 
        name="name" 
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Your name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} 
      />
      
      <FormField 
        control={form.control} 
        name="email" 
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="Your email address" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} 
      />
          
      <FormField 
        control={form.control} 
        name="emailUpdates" 
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} required />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="font-normal">I agree to receive email updates about StockCoach.ai.</FormLabel>
            </div>
          </FormItem>
        )} 
      />
    </div>
  );
}
