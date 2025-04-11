import React from "react";
import { BarChart3 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useChat } from "@/context/ChatContext";

import WelcomeHeader from "./WelcomeHeader";
import WelcomeIcon from "./WelcomeIcon";
import WelcomeMessage from "./WelcomeMessage";
import WelcomeDescription from "./WelcomeDescription";
import WelcomeFooter from "./WelcomeFooter";

interface WelcomeScreenProps {
  onStartChat: () => void;
}

const WelcomeScreen = ({ onStartChat }: WelcomeScreenProps) => {
  const { clearMessages, canCreateNewChat } = useChat();
  const navigate = useNavigate();
  
  const handleStartChat = async () => {
    try {
      if (canCreateNewChat) {
        console.log("Creating new chat session");
        
        // Call clearMessages but don't check its return value directly
        await clearMessages();
        
        // Force navigate to chat with new=true parameter to ensure today's date is selected
        console.log("Navigating to chat with new=true");
        navigate("/chat?new=true");
        toast.success("Started a new chat session");
      } else {
        // Otherwise just navigate to the chat page
        console.log("Navigating to existing chat session");
        navigate("/chat");
      }
    } catch (error) {
      console.error("Error starting chat:", error);
      toast.error("Could not create new session");
      // In case of error, still try to navigate to chat
      navigate("/chat");
    }
  };
  
  return (
    <div className="min-h-screen pt-16 flex flex-col items-center justify-center px-4">
      <Card className="max-w-3xl w-full animate-fade-in">
        <CardHeader className="text-center">
          <WelcomeHeader title="StockCoach.ai" />
          <WelcomeIcon />
          <CardTitle className="text-3xl font-bold">Welcome to StockCoach.ai</CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-6">
          <WelcomeMessage />
          <WelcomeDescription />
        </CardContent>
        
        <CardFooter className="flex flex-col items-center justify-center gap-4">
          <WelcomeFooter onStartChat={handleStartChat} />
        </CardFooter>
      </Card>
    </div>
  );
};

export default WelcomeScreen;
