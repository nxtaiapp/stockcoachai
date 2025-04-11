
import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useChat } from "@/context/ChatContext";

interface WelcomeFooterProps {
  onStartChat: () => void;
}

const WelcomeFooter = ({ onStartChat }: WelcomeFooterProps) => {
  const { canCreateNewChat } = useChat();
  
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Button 
        onClick={onStartChat} 
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
    </div>
  );
};

export default WelcomeFooter;
