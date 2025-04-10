
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

export const TradingPlanForm = () => {
  const { setUserData } = useAuth();
  const navigate = useNavigate();
  const [tradingPlan, setTradingPlan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tradingPlan.trim()) {
      toast.error("Please enter your trading plan");
      return;
    }

    try {
      setIsSubmitting(true);
      
      await setUserData({
        trading_plan: tradingPlan
      });
      
      toast.success("Trading plan saved successfully");
      navigate("/welcome");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save your trading plan");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CardContent>
        <div>
          <label className="block text-sm font-medium mb-2">
            Enter your trading plan below:
          </label>
          <Textarea 
            placeholder="Include details like your risk management rules, preferred setups, position sizing, entry and exit strategies, etc."
            rows={12}
            value={tradingPlan}
            onChange={(e) => setTradingPlan(e.target.value)}
            className="resize-none"
          />
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-4">
        <Button 
          type="submit" 
          className="w-full flex items-center gap-2" 
          disabled={isSubmitting}
        >
          Save and Continue
          {isSubmitting ? (
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </Button>
        
        <div className="text-center text-sm text-muted-foreground">
          You can always update your trading plan later in your profile settings
        </div>
      </CardFooter>
    </form>
  );
};
