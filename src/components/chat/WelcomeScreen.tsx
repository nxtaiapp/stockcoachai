
import React from "react";
import { BarChart3, ArrowRight, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { getWelcomeMessageContent } from "../../services/welcomeMessageService";
import { useChat } from "@/context/ChatContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface WelcomeScreenProps {
  onStartChat: () => void;
}

const WelcomeScreen = ({ onStartChat }: WelcomeScreenProps) => {
  const { user, signOut } = useAuth();
  const { clearMessages, canCreateNewChat } = useChat();
  const navigate = useNavigate();
  
  const getUserFirstName = () => {
    if (!user) return "";
    if (user.name && !user.name.includes('-')) {
      // Extract first name only
      return user.name.split(' ')[0];
    }
    if (user.email) {
      return user.email.split('@')[0];
    }
    return "";
  };
  
  const firstName = getUserFirstName();
  
  // Use the getWelcomeMessageContent function from our service
  const welcomeMessage = getWelcomeMessageContent(
    firstName,
    user?.skill_level,
    user?.experience_level
  );

  const handleStartChat = async () => {
    // If we can create a new session, clear messages to generate the welcome message
    if (canCreateNewChat) {
      await clearMessages();
    }
    // Always call onStartChat to navigate to the chat page
    onStartChat();
  };
  
  return (
    <div className="min-h-screen pt-16 flex flex-col items-center justify-center px-4">
      <Card className="max-w-3xl w-full animate-fade-in">
        <CardHeader className="text-center">
          <div className="flex justify-end w-full">
            {user && (
              <Button 
                variant="outline" 
                className="flex items-center gap-2" 
                onClick={signOut}
                size="sm"
              >
                <LogOut size={16} />
                Sign Out
              </Button>
            )}
          </div>
          <div className="mx-auto bg-primary/10 h-20 w-20 rounded-full flex items-center justify-center mb-6">
            <BarChart3 className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Welcome to StockCoach.ai</CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-6">
          <div className="bg-muted/50 p-6 rounded-lg">
            <h2 className="text-xl font-medium mb-4">Alexandra, Your Trading Coach</h2>
            <p className="text-muted-foreground text-lg">{welcomeMessage}</p>
          </div>
          
          <div className="max-w-md mx-auto">
            <p className="text-muted-foreground mb-2">
              Alexandra helps you analyze trades, understand market patterns, and develop your trading strategy.
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col items-center justify-center gap-4">
          <Button 
            onClick={handleStartChat} 
            size="lg" 
            className="w-full sm:w-auto flex items-center gap-2"
          >
            {canCreateNewChat ? "Start New Session" : "Continue Current Session"}
            <ArrowRight className="h-5 w-5" />
          </Button>
          
          {!canCreateNewChat && (
            <p className="text-sm text-muted-foreground">
              You already have a session for today. 
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default WelcomeScreen;
