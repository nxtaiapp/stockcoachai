import React from "react";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import { getWelcomeMessageContent } from "../../services/messageService";

interface PromptSuggestion {
  text: string;
}

const PromptSuggestions = () => {
  const { sendMessage } = useChat();
  const { user } = useAuth();
  
  const suggestions: PromptSuggestion[] = [
    { text: "What trading strategies would work best in the current market?" },
    { text: "Explain how to analyze a stock's fundamentals before investing" },
    { text: "How should I diversify my portfolio to minimize risk?" },
    { text: "What are the key technical indicators I should monitor daily?" }
  ];
  
  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };
  
  const getUserDisplayName = () => {
    if (!user) return "there";
    
    if (user.name && !user.name.includes('-')) {
      return user.name;
    }
    
    return user.email ? user.email.split('@')[0] : "there";
  };
  
  const getWelcomeMessage = () => {
    const currentHour = new Date().getHours();
    let timePeriod: 'morning' | 'afternoon' | 'evening';
    if (currentHour >= 5 && currentHour < 12) {
      timePeriod = 'morning';
    } else if (currentHour >= 12 && currentHour < 18) {
      timePeriod = 'afternoon';
    } else {
      timePeriod = 'evening';
    }
    
    let experience: 'beginner' | 'intermediate' | 'advanced';
    
    switch(user?.skill_level?.toLowerCase()) {
      case 'expert':
      case 'advanced':
        experience = 'advanced';
        break;
      case 'intermediate':
        experience = 'intermediate';
        break;
      case 'novice':
      case 'beginner':
      default:
        experience = 'beginner';
        break;
    }
    
    const messages = {
      beginner: {
        morning: `Good morning! Ready to build stronger habits and grow your edge? What would you like to learn or work on today?`,
        afternoon: `Hope your trading day's going well! What strategy, concept, or challenge can I help you understand better right now?`,
        evening: `Reflecting on today's trades? Let's break them down and find what you can take into tomorrow.`
      },
      intermediate: {
        morning: `Morning! What's your plan for today's session — and how can I help you sharpen it?`,
        afternoon: `Midday check-in: what setups are you seeing, and where do you need a second opinion?`,
        evening: `Let's review — what worked today, what didn't, and how can we improve it tomorrow?`
      },
      advanced: {
        morning: `Welcome back. What edge are you pressing today — and how can I help refine your execution?`,
        afternoon: `Eyes on the market? Let me know where you need confirmation, analysis, or a quick gut check.`,
        evening: `Time to optimize. What do your trades reveal today — and how do we get even better?`
      }
    };
    
    return messages[experience][timePeriod];
  };
  
  const welcomeMessage = getWelcomeMessage();
  const displayName = getUserDisplayName();
  
  return (
    <div className="flex flex-col items-center justify-center p-10 max-w-3xl mx-auto">
      <div className="flex flex-col items-center mb-10">
        <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mb-4">
          <BarChart3 className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">StockCoach.ai</h1>
        <p className="text-center text-muted-foreground max-w-md mb-2">
          Your AI-powered trading coach.
        </p>
        <h2 className="text-xl text-center mb-4">
          {displayName ? `Hello ${displayName}! ` : ''}{welcomeMessage}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            className="p-4 h-auto text-left justify-start normal-case text-sm md:text-base border-border/60 hover:bg-muted/50"
            onClick={() => handleSuggestionClick(suggestion.text)}
          >
            {suggestion.text}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default PromptSuggestions;
