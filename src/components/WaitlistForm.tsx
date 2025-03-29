
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
  markets: z.object({
    nasdaq: z.boolean().default(false),
    stocks: z.boolean().default(false),
    options: z.boolean().default(false),
    forex: z.boolean().default(false),
    crypto: z.boolean().default(false),
    other: z.boolean().default(false)
  }).optional(),
  otherMarket: z.string().optional(),
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
      markets: {
        nasdaq: false,
        stocks: false,
        options: false,
        forex: false,
        crypto: false,
        other: false
      },
      otherMarket: "",
      challenges: "",
      insights: ""
    }
  });

  function onSubmit(values: FormValues) {
    console.log(values);

    // Here you would typically send this data to your backend
    // For now, we'll just show a success message

    toast.success("You've been added to our waitlist!", {
      description: "We'll be in touch soon with updates."
    });
    if (onClose) {
      onClose();
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
                  <FormLabel className="font-normal">
                    Would you like to receive occasional email updates about StockCoach.ai?
                  </FormLabel>
                  <FormDescription>
                    Yes, keep me in the loop with updates, early access opportunities, and launch news.
                  </FormDescription>
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
          
          <div className="space-y-2">
            <FormLabel>2. What markets do you trade?</FormLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <FormField control={form.control} name="markets.nasdaq" render={({
              field
            }) => <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">
                      NASDAQ Futures / ES / NQ
                    </FormLabel>
                  </FormItem>} />
              <FormField control={form.control} name="markets.stocks" render={({
              field
            }) => <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">Stocks</FormLabel>
                  </FormItem>} />
              <FormField control={form.control} name="markets.options" render={({
              field
            }) => <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">Options</FormLabel>
                  </FormItem>} />
              <FormField control={form.control} name="markets.forex" render={({
              field
            }) => <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">Forex</FormLabel>
                  </FormItem>} />
              <FormField control={form.control} name="markets.crypto" render={({
              field
            }) => <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">Crypto</FormLabel>
                  </FormItem>} />
              <FormField control={form.control} name="markets.other" render={({
              field
            }) => <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">Other</FormLabel>
                  </FormItem>} />
            </div>
            
            {form.watch("markets.other") && <FormField control={form.control} name="otherMarket" render={({
            field
          }) => <FormItem>
                    <FormControl>
                      <Input placeholder="Please specify" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />}
          </div>
          
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
