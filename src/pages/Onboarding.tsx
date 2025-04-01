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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart3, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const tradingGoals = [
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
    id: "long-term",
    title: "Long-Term Investing",
    description: "Build wealth through long-term positions"
  },
  {
    id: "options",
    title: "Options Trading",
    description: "Trade options contracts for leverage"
  }
];

const Onboarding = () => {
  const { user, setUserData, loading } = useAuth();
  const navigate = useNavigate();
  
  const [selectedStyle, setSelectedStyle] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/signin");
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStyle || !skillLevel) {
      toast.error("Please select both a trading style and skill level");
      return;
    }

    try {
      setIsSubmitting(true);
      
      await setUserData({
        trading_style: selectedStyle,
        skill_level: skillLevel
      });
      
      navigate("/chat");
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
              Tell us a bit about your trading style so we can tailor our guidance to your needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">What is your preferred trading style?</h3>
                <RadioGroup value={selectedStyle} onValueChange={setSelectedStyle}>
                  <div className="grid grid-cols-1 gap-4">
                    {tradingGoals.map((goal) => (
                      <div key={goal.id} className={`
                        flex items-start space-x-2 border rounded-lg p-4 transition-all
                        ${selectedStyle === goal.id ? 'border-primary bg-primary/5' : 'border-border'}
                      `}>
                        <RadioGroupItem value={goal.id} id={goal.id} className="mt-1" />
                        <Label htmlFor={goal.id} className="flex-1 cursor-pointer">
                          <div className="font-medium">{goal.title}</div>
                          <div className="text-sm text-muted-foreground">{goal.description}</div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">How would you rate your trading skill level?</h3>
                <Select value={skillLevel} onValueChange={setSkillLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your skill level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="novice">Novice - Just getting started</SelectItem>
                    <SelectItem value="beginner">Beginner - Some basic knowledge</SelectItem>
                    <SelectItem value="intermediate">Intermediate - Regular trader with experience</SelectItem>
                    <SelectItem value="advanced">Advanced - Experienced and confident</SelectItem>
                    <SelectItem value="expert">Expert - Professional level knowledge</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                type="submit" 
                className="w-full flex items-center gap-2" 
                disabled={!selectedStyle || !skillLevel || isSubmitting}
              >
                Continue to StockCoach.ai
                {isSubmitting ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center text-sm text-muted-foreground">
            You can always change these preferences later in your settings
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
