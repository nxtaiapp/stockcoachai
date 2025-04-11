
import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface WelcomeFooterProps {
  onStartChat: () => void;
}

const WelcomeFooter = ({ onStartChat }: WelcomeFooterProps) => {
  const navigate = useNavigate();
  
  const handleButtonClick = () => {
    // Simply navigate to the chat page
    navigate("/chat");
  };
  
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Button 
        onClick={handleButtonClick} 
        size="lg" 
        className="w-full sm:w-auto flex items-center gap-2"
      >
        Start Coaching Session
        <ArrowRight className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default WelcomeFooter;
