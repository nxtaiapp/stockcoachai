import React from "react";
import { BarChart3 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getWelcomeMessageContent } from "../../services/messageService";
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

    // First check the experience_level field, which stores the trader's experience level
    if (user?.experience_level?.toLowerCase() === 'intermediate') {
      experience = 'intermediate';
    } else if (['expert', 'advanced'].includes(user?.experience_level?.toLowerCase() || '')) {
      experience = 'advanced';
    } else {
      // If experience_level doesn't match, fall back to skill_level
      switch (user?.skill_level?.toLowerCase()) {
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
    }
    console.log("User profile data:", {
      name: user?.name,
      experience_level: user?.experience_level,
      skill_level: user?.skill_level,
      determined_experience: experience
    });
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
  const firstName = getUserFirstName();
  return <div className="flex flex-col items-center justify-center p-10 max-w-3xl mx-auto">
      <div className="flex flex-col items-center mb-10">
        <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mb-4">
          <BarChart3 className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">Alexandra</h1>
        <p className="text-center text-muted-foreground max-w-md mb-2">
          Your AI-powered trading coach.
        </p>
        <h2 className="text-xl text-center mb-4 text-[#8E9196] py-[76px]">
          {firstName ? `Hello ${firstName}! ` : ''}{welcomeMessage}
        </h2>
      </div>
    </div>;
};
export default PromptSuggestions;