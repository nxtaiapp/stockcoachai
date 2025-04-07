
import React from "react";
import { BarChart3 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getWelcomeMessageContent } from "../../services/welcomeMessageService";

const PromptSuggestions = () => {
  const {
    user
  } = useAuth();
  
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
  
  return <div className="flex flex-col items-center justify-center p-10 max-w-3xl mx-auto">
      <div className="flex flex-col items-center mb-10">
        <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mb-4">
          <BarChart3 className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">Alexandra</h1>
        <p className="text-center text-muted-foreground max-w-md mb-2">
          Your AI-powered trading coach.
        </p>
        <h2 className="text-xl text-center mb-4 text-[#8E9196] py-[100px]">
          {welcomeMessage}
        </h2>
      </div>
    </div>;
};

export default PromptSuggestions;
