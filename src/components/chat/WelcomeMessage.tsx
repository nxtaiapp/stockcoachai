
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { getWelcomeMessageContent } from "../../services/welcomeMessageService";

const WelcomeMessage = () => {
  const { user } = useAuth();
  
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
  
  return (
    <div className="bg-muted/50 p-6 rounded-lg">
      <h2 className="text-xl font-medium mb-4">Alexandra, Your Trading Coach</h2>
      <p className="text-muted-foreground text-lg">{welcomeMessage}</p>
    </div>
  );
};

export default WelcomeMessage;
