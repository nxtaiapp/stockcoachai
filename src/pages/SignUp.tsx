
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BarChart3, ArrowRight } from "lucide-react";

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

const SignUp = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("");
  const [tradingGoal, setTradingGoal] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!name || !email || !password || !experience || !tradingGoal || !skillLevel) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      await signUp(email, password, name, experience, tradingGoal, skillLevel);
      // Navigate is handled in the AuthContext after successful sign-up
    } catch (err) {
      setError("An error occurred during registration. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-secondary/30">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">StockCoach.ai</span>
          </Link>
        </div>
        
        <Card className="w-full animate-fade-in">
          <CardHeader>
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>
              Start your 14-day free trial. No credit card required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Must be at least 8 characters
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience">Trading Experience</Label>
                <Select 
                  value={experience} 
                  onValueChange={setExperience}
                  required
                >
                  <SelectTrigger id="experience">
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (1-5 years)</SelectItem>
                    <SelectItem value="advanced">Advanced (5+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Primary Trading Goal</Label>
                <RadioGroup value={tradingGoal} onValueChange={setTradingGoal}>
                  <div className="grid grid-cols-1 gap-3">
                    {tradingGoals.map((goal) => (
                      <div key={goal.id} className={`
                        flex items-start space-x-2 border rounded-lg p-3 transition-all
                        ${tradingGoal === goal.id ? 'border-primary bg-primary/5' : 'border-border'}
                      `}>
                        <RadioGroupItem value={goal.id} id={`goal-${goal.id}`} className="mt-1" />
                        <Label htmlFor={`goal-${goal.id}`} className="flex-1 cursor-pointer">
                          <div className="font-medium">{goal.title}</div>
                          <div className="text-sm text-muted-foreground">{goal.description}</div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="skillLevel">Trading Skill Level</Label>
                <Select 
                  value={skillLevel} 
                  onValueChange={setSkillLevel}
                  required
                >
                  <SelectTrigger id="skillLevel">
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
                disabled={isLoading}
              >
                Create Account
                {isLoading ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                By creating an account, you agree to our{" "}
                <Link to="/" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/signin" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
