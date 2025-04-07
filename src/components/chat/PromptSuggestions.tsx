
import React from "react";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
import { useChat } from "../../context/ChatContext";

interface PromptSuggestion {
  text: string;
}

const PromptSuggestions = () => {
  const { sendMessage } = useChat();
  
  const suggestions: PromptSuggestion[] = [
    { text: "What trading strategies would work best in the current market?" },
    { text: "Explain how to analyze a stock's fundamentals before investing" },
    { text: "How should I diversify my portfolio to minimize risk?" },
    { text: "What are the key technical indicators I should monitor daily?" }
  ];
  
  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-10 max-w-3xl mx-auto">
      <div className="flex flex-col items-center mb-10">
        <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mb-4">
          <BarChart3 className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">StockCoach.ai</h1>
        <p className="text-center text-muted-foreground max-w-md">
          Your AI-powered trading coach. Ask me anything about trading strategies, market analysis, or investment advice.
        </p>
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
