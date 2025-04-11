
import React, { useState } from "react";
import { BarChart3, RefreshCw, Loader2 } from "lucide-react";
import { Link } from "react-router-dom"; 
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { getWelcomeMessageContent } from "../../services/welcomeMessageService";
import { Button } from "@/components/ui/button";

const PromptSuggestions = () => {
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  
  const {
    user
  } = useAuth();
  
  const {
    clearMessages,
    canCreateNewChat
  } = useChat();
  
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
  
  // Get welcome message for display, but don't add it to the chat
  const welcomeMessage = getWelcomeMessageContent(
    firstName,
    user?.skill_level,
    user?.experience_level
  );

  const handleStartNewSession = async () => {
    if (isCreatingSession) return; // Prevent multiple clicks
    
    setIsCreatingSession(true);
    try {
      await clearMessages();
    } finally {
      setIsCreatingSession(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-10 max-w-3xl mx-auto">
      <div className="flex flex-col items-center mb-10">
        <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mb-4">
          <BarChart3 className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">Alexandra</h1>
        <p className="text-center text-muted-foreground max-w-md mb-2">
          Your AI-powered trading coach.
        </p>
        <h2 className="text-xl text-center mb-6 text-muted-foreground">
          {welcomeMessage}
        </h2>
        <div className="flex flex-wrap gap-3 justify-center">
          {canCreateNewChat && (
            <Button 
              variant="default" 
              size="sm"
              onClick={handleStartNewSession}
              disabled={isCreatingSession}
              className="flex items-center gap-2"
              aria-disabled={isCreatingSession}
            >
              {isCreatingSession ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Session...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Start New Session
                </>
              )}
            </Button>
          )}
          <Link to="/welcome">
            <Button variant="outline" size="sm" disabled={isCreatingSession}>
              Return to Welcome Screen
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PromptSuggestions;
