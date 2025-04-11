
import React from "react";
import { BarChart3, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../context/AuthContext";
import { getWelcomeMessageContent } from "../../services/welcomeMessageService";

const CoachingCard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const getUserFirstName = () => {
    if (!user) return "";
    if (user.name && !user.name.includes('-')) {
      return user.name.split(' ')[0];
    }
    if (user.email) {
      return user.email.split('@')[0];
    }
    return "";
  };
  
  const firstName = getUserFirstName();
  const welcomeMessage = getWelcomeMessageContent(firstName, user?.skill_level, user?.experience_level);
  
  const handleStartChat = () => {
    // Simply navigate to the chat page without any additional parameters
    navigate("/chat");
  };

  return (
    <Card className="shadow-md animate-fade-in">
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-bold">Your Trading Coach</CardTitle>
          <CardDescription>Alexandra is ready to assist with your trading strategy</CardDescription>
        </div>
        <div className="mt-4 md:mt-0 bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center">
          <BarChart3 className="h-8 w-8 text-primary" />
        </div>
      </CardHeader>
      
      <Separator />
      
      <CardContent className="pt-6 space-y-6">
        <div className="bg-muted/50 p-6 rounded-lg">
          <h2 className="text-xl font-medium mb-4">Today's Coaching Message</h2>
          <p className="text-lg text-muted-foreground">{welcomeMessage}</p>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">How Alexandra helps you:</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-2">
            <li>Analyze your trading patterns and decisions</li>
            <li>Learn from your past trades</li>
            <li>Understand market movements and trends</li>
            <li>Develop and refine your trading strategy</li>
          </ul>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col items-start pt-2">
        <Button onClick={handleStartChat} size="lg" className="w-full sm:w-auto flex items-center gap-2 text-center">
          Start Coaching Session
          <ArrowRight className="h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CoachingCard;
