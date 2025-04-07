
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
      morning: `${firstName}, ready to build stronger habits and grow your edge? What would you like to learn or work on today?`,
      afternoon: `${firstName}, hope your trading day's going well! What strategy, concept, or challenge can I help you understand better right now?`,
      evening: `${firstName}, reflecting on today's trades? Let's break them down and find what you can take into tomorrow.`
    },
    intermediate: {
      morning: `${firstName}, what's your plan for today's session — and how can I help you sharpen it?`,
      afternoon: `${firstName}, what setups are you seeing, and where do you need a second opinion?`,
      evening: `${firstName}, let's review — what worked today, what didn't, and how can we improve it tomorrow?`
    },
    advanced: {
      morning: `${firstName}, what edge are you pressing today — and how can I help refine your execution?`,
      afternoon: `${firstName}, eyes on the market? Let me know where you need confirmation, analysis, or a quick gut check.`,
      evening: `${firstName}, time to optimize. What do your trades reveal today — and how do we get even better?`
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
