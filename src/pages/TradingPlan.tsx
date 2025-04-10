
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { BarChart3, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const TradingPlan = () => {
  const { user, setUserData, loading } = useAuth();
  const navigate = useNavigate();
  const [tradingPlan, setTradingPlan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/signin");
    }
  }, [user, loading, navigate]);

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
            <CardTitle className="text-2xl">Your Trading Plan</CardTitle>
            <CardDescription>
              Document your trading strategy, rules, and goals to stay disciplined
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
            </form>
          </CardContent>
          <CardFooter className="text-center text-sm text-muted-foreground">
            You can always update your trading plan later in your profile settings
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default TradingPlan;
