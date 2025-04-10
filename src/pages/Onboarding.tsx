
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { BarChart3, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const tradingStyles = [
  {
    id: "day-trading",
    title: "Day Trading",
    description: "Make multiple trades within the same day"
  },
  {
    id: "swing-trading",
    title: "Swing Trading",
    description: "Hold positions for several days to weeks"
  },
  {
    id: "scalping",
    title: "Scalping",
    description: "Make quick, short-term trades for small profits"
  },
  {
    id: "long-term",
    title: "Long-Term Investing",
    description: "Build wealth through long-term positions"
  },
  {
    id: "other",
    title: "Other",
    description: "Your trading style doesn't fit the categories above"
  }
];

// Define the form schema
const formSchema = z.object({
  experience_level: z.string({
    required_error: "Please select your trading experience"
  }),
  trading_style: z.string({
    required_error: "Please select your trading style"
  }),
  trading_goals: z.string().min(1, "Please enter your trading goals"),
  has_trading_plan: z.boolean()
});

const Onboarding = () => {
  const { user, setUserData, loading } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      experience_level: "",
      trading_style: "",
      trading_goals: "",
      has_trading_plan: false
    },
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/signin");
    }
  }, [user, loading, navigate]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      await setUserData({
        trading_style: values.trading_style,
        skill_level: values.experience_level,
        trading_goals: values.trading_goals
      });
      
      if (values.has_trading_plan) {
        navigate("/trading-plan");
      } else {
        navigate("/welcome");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save your preferences");
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-secondary/30">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">StockCoach.ai</span>
          </div>
        </div>
        
        <Card className="w-full animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Personalize Your Experience</CardTitle>
            <CardDescription>
              Tell us about your trading experience so we can tailor our guidance to your needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Trading Experience */}
                <FormField
                  control={form.control}
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

                {/* Trading Style */}
                <FormField
                  control={form.control}
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

                {/* Trading Goals */}
                <FormField
                  control={form.control}
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

                {/* Trading Plan */}
                <FormField
                  control={form.control}
                  name="has_trading_plan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-medium">
                        Do you currently have a trading plan?
                      </FormLabel>
                      <div className="flex gap-4 mt-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem 
                            id="has-plan-yes" 
                            value="yes" 
                            checked={field.value === true}
                            onClick={() => form.setValue("has_trading_plan", true)}
                          />
                          <Label htmlFor="has-plan-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem 
                            id="has-plan-no" 
                            value="no" 
                            checked={field.value === false}
                            onClick={() => form.setValue("has_trading_plan", false)}
                          />
                          <Label htmlFor="has-plan-no">No</Label>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full flex items-center gap-2" 
                  disabled={isSubmitting}
                >
                  Continue
                  {isSubmitting ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="text-center text-sm text-muted-foreground">
            You can always update your preferences later in your settings
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
