import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
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

type FormValues = z.infer<typeof formSchema>;

export function WaitlistForm({
  onClose
}: {
  onClose?: () => void;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      emailUpdates: false,
      markets: "",
      challenges: "",
      insights: ""
    }
  });

  async function onSubmit(values: FormValues) {
    console.log(values);
    
    // Set loading state
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    if (submitButton) {
      const originalText = submitButton.innerHTML;
      submitButton.disabled = true;
      submitButton.innerHTML = 'Submitting...';
      
      try {
        // Post the form data to the specified API endpoint
        const response = await fetch('https://nxtaisolutions.app.n8n.cloud/webhook-test/92ab66bc-0d1e-4d7f-a7c3-e157319891c5', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
        
        if (!response.ok) {
          throw new Error('Failed to submit form');
        }
        
        // Show success message
        toast.success("You've been added to our waitlist!", {
          description: "We'll be in touch soon with updates."
        });
        
        // Close the dialog if onClose function is provided
        if (onClose) {
          onClose();
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        toast.error("Couldn't submit your information", {
          description: "Please try again later."
        });
      } finally {
        // Reset button state
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML = originalText;
        }
      }
    } else {
      // Fallback if button element is not found
      try {
        const response = await fetch('https://nxtaisolutions.app.n8n.cloud/webhook-test/92ab66bc-0d1e-4d7f-a7c3-e157319891c5', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
        
        if (!response.ok) {
          throw new Error('Failed to submit form');
        }
        
        toast.success("You've been added to our waitlist!", {
          description: "We'll be in touch soon with updates."
        });
        
        if (onClose) {
          onClose();
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        toast.error("Couldn't submit your information", {
          description: "Please try again later."
        });
      }
    }
  }

  return <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto px-1">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Your Information</h3>
          
          <FormField control={form.control} name="name" render={({
          field
        }) => <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>} />
          
          <FormField control={form.control} name="email" render={({
          field
        }) => <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Your email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>} />
              
          <FormField control={form.control} name="emailUpdates" render={({
          field
        }) => <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} required />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-normal">I agree to receive email updates about StockCoach.ai.</FormLabel>
                  
                </div>
              </FormItem>} />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Optional but Insightful</h3>
          
          <FormField control={form.control} name="experienceLevel" render={({
          field
        }) => <FormItem className="space-y-3">
                <FormLabel>1. What's your trading experience level?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
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
              </FormItem>} />
          
          <FormField control={form.control} name="markets" render={({
          field
        }) => <FormItem>
                <FormLabel>2. What markets do you trade?</FormLabel>
                <FormDescription>
                  E.g., NASDAQ, Stocks, Options, Forex, Crypto, etc.
                </FormDescription>
                <FormControl>
                  <Input placeholder="Markets you trade in" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>} />
          
          <FormField control={form.control} name="challenges" render={({
          field
        }) => <FormItem>
                <FormLabel>3. What are your biggest trading challenges right now?</FormLabel>
                <FormDescription>
                  E.g., managing emotions, finding good entries, journaling consistency, sticking to the plan, etc.
                </FormDescription>
                <FormControl>
                  <Textarea placeholder="Your trading challenges..." className="resize-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>} />
          
          <FormField control={form.control} name="insights" render={({
          field
        }) => <FormItem>
                <FormLabel>4. What kind of insights would you want from an AI trading coach?</FormLabel>
                <FormDescription>
                  E.g., trade reviews, psychology feedback, risk management tips, pattern recognition, etc.
                </FormDescription>
                <FormControl>
                  <Textarea placeholder="Insights you're looking for..." className="resize-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>} />
          
          <FormField control={form.control} name="earlyAccess" render={({
          field
        }) => <FormItem>
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
              </FormItem>} />
        </div>
        
        <Button type="submit" className="w-full">Submit</Button>
      </form>
    </Form>;
}
