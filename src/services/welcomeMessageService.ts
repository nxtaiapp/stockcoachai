
/**
 * Services related to welcome messages
 */

import { Message } from '../types/chat';
import { generateUUID } from './utils';

// Export the welcome message content function so it can be used in other components
export function getWelcomeMessageContent(userName: string, skillLevel?: string, experienceLevel?: string): string {
  // Get the current hour to determine time of day
  const currentHour = new Date().getHours();
  
  // Determine time period: morning (5-11), afternoon (12-17), evening (18-4)
  let timePeriod: 'morning' | 'afternoon' | 'evening';
  if (currentHour >= 5 && currentHour < 12) {
    timePeriod = 'morning';
  } else if (currentHour >= 12 && currentHour < 18) {
    timePeriod = 'afternoon';
  } else {
    timePeriod = 'evening';
  }
  
  // Map user's experience level to beginner/intermediate/advanced
  // First check experience_level, then fall back to skill_level
  let experience: 'beginner' | 'intermediate' | 'advanced';
  if (experienceLevel?.toLowerCase() === 'intermediate') {
    experience = 'intermediate';
  } else if (['expert', 'advanced'].includes(experienceLevel?.toLowerCase() || '')) {
    experience = 'advanced';
  } else {
    // If no experience_level, fall back to skill_level
    switch(skillLevel?.toLowerCase()) {
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
  
  // Extract first name if a name is provided
  const firstName = userName && userName !== 'there' ? userName.split(' ')[0] : '';
  
  console.log("Selecting welcome message:", { userName, firstName, experienceLevel, skillLevel, experience, timePeriod });
  
  // Select appropriate message based on experience and time of day
  const messages = {
    beginner: {
      morning: `Good morning ${firstName}. What would you like to learn or work on today?`,
      afternoon: `Good afternoon ${firstName}.  What strategy, concept, or challenge can I help you understand better right now?`,
      evening: `Good evening ${firstName}. Reflecting on today's trades? Let's break them down and find what you can take into tomorrow.`
    },
    intermediate: {
      morning: `Good morning ${firstName}. What's your plan for today's session?`,
      afternoon: `Good afternoon ${firstName}. What setups are you seeing?`,
      evening: `Good evening ${firstName}. What worked today, what didn't, and how can we improve it tomorrow?`
    },
    advanced: {
      morning: `Good morning ${firstName}. What edge are you pressing today?`,
      afternoon: `Good afternoon ${firstName}, Let me know where you need confirmation, analysis, or a quick gut check.`,
      evening: `Good evening ${firstName}, What did your trades reveal today?`
    }
  };
  
  return messages[experience][timePeriod];
}

export function getWelcomeMessage(userName: string, skillLevel?: string, experienceLevel?: string): Message {
  // Clean the username to ensure we're not displaying UUIDs or IDs
  let displayName = "there";
  
  if (userName && userName.trim() !== '') {
    // Check if the name looks like a UUID (contains hyphens)
    if (!userName.includes('-')) {
      displayName = userName;
    } else {
      // If it has hyphens, it might be a UUID, so use a generic greeting
      displayName = "there";
    }
  }
  
  const content = getWelcomeMessageContent(displayName, skillLevel, experienceLevel);
  
  return {
    id: generateUUID(),
    senderId: 'ai',
    content,
    timestamp: new Date(),
    isAI: true
  };
}
