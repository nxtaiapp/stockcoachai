
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { CardContent, CardFooter } from "@/components/ui/card";
import { ExperienceLevelField } from "./ExperienceLevelField";
import { TradingStyleField } from "./TradingStyleField";
import { TradingGoalsField } from "./TradingGoalsField";
import { TradingPlanField } from "./TradingPlanField";
import { OnboardingFormValues, onboardingFormSchema } from "@/lib/schemas/onboardingSchema";
import { useAuth } from "@/context/AuthContext";

export const OnboardingForm = () => {
  const { setUserData } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form
  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: {
      experience_level: "",
      trading_style: "",
      trading_goals: "",
      has_trading_plan: false
    },
  });

  const onSubmit = async (values: OnboardingFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Only include fields that are actually in the database schema
      const profileData = {
        experience_level: values.experience_level,
        trading_style: values.trading_style,
        skill_level: values.experience_level, // Map experience_level to skill_level for consistency
        trading_goals: values.trading_goals // Include trading_goals
      };
      
      console.log('Submitting profile data:', profileData);
      
      // Update user profile with form data
      const success = await setUserData(profileData);
      
      if (!success) {
        throw new Error("Failed to save onboarding data");
      }
      
      // Navigate based on trading plan selection
      if (values.has_trading_plan) {
        navigate("/trading-plan");
      } else {
        // After onboarding, always redirect to the welcome dashboard
        navigate("/welcome");
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      toast.error("Failed to save your preferences. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CardContent>
          <div className="space-y-8">
            <ExperienceLevelField control={form.control} />
            <TradingStyleField control={form.control} />
            <TradingGoalsField control={form.control} />
            <TradingPlanField control={form.control} setValue={form.setValue} />
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4">
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
          
          <div className="text-center text-sm text-muted-foreground">
            You can always update your preferences later in your settings
          </div>
        </CardFooter>
      </form>
    </Form>
  );
};
