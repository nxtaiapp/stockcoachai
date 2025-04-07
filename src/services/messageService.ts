
import { Message } from '../types/chat';
import { toast } from "sonner";
import { supabase } from '@/lib/supabase';

// Function to convert an image file to a data URL
export async function uploadImageAndGetUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error("Failed to read image file"));
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Error reading image file"));
    };
    
    reader.readAsDataURL(file);
  });
}

// Generate a proper UUID for database compatibility
function generateUUID(): string {
  return crypto.randomUUID();
}

export function createUserMessage(userId: string, content: string, imageUrl?: string): Message {
  return {
    id: generateUUID(),
    senderId: userId,
    content,
    timestamp: new Date(),
    isAI: false,
    imageUrl
  };
}

export function createAIMessage(content: string): Message {
  return {
    id: generateUUID(),
    senderId: 'ai',
    content,
    timestamp: new Date(),
    isAI: true
  };
}

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
  
  console.log("Selecting welcome message:", { userName, experienceLevel, skillLevel, experience, timePeriod });
  
  // Select appropriate message based on experience and time of day
  const messages = {
    beginner: {
      morning: `Good morning, ${userName}! Ready to build stronger habits and grow your edge? What would you like to learn or work on today?`,
      afternoon: `Hope your trading day's going well, ${userName}! What strategy, concept, or challenge can I help you understand better right now?`,
      evening: `Good evening, ${userName}! Reflecting on today's trades? Let's break them down and find what you can take into tomorrow.`
    },
    intermediate: {
      morning: `Morning, ${userName}! What's your plan for today's session — and how can I help you sharpen it?`,
      afternoon: `Midday check-in, ${userName}: what setups are you seeing, and where do you need a second opinion?`,
      evening: `Good evening, ${userName}! Let's review — what worked today, what didn't, and how can we improve it tomorrow?`
    },
    advanced: {
      morning: `Welcome back, ${userName}. What edge are you pressing today — and how can I help refine your execution?`,
      afternoon: `Eyes on the market, ${userName}? Let me know where you need confirmation, analysis, or a quick gut check.`,
      evening: `Good evening, ${userName}. Time to optimize. What do your trades reveal today — and how do we get even better?`
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

// Updated function to save a message to Supabase with better error logging
export async function saveMessageToSupabase(message: Message, userId: string): Promise<void> {
  try {
    console.log('Saving message to Supabase:', { message, userId });
    
    const { error } = await supabase
      .from('chat_messages')
      .insert({
        id: message.id,
        user_id: userId,
        sender_id: message.senderId,
        content: message.content,
        is_ai: message.isAI,
        created_at: message.timestamp.toISOString()
      });
    
    if (error) {
      console.error('Error saving message to Supabase:', error);
      throw error;
    } else {
      console.log('Message saved successfully to Supabase');
    }
  } catch (error) {
    console.error('Failed to save message to Supabase:', error);
    throw error;
  }
}

// Updated function to fetch messages from Supabase with better error handling
export async function fetchMessagesFromSupabase(userId: string): Promise<Message[]> {
  try {
    console.log('Fetching messages for user:', userId);
    
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching messages from Supabase:', error);
      throw error;
    }
    
    console.log('Fetched messages from Supabase:', data);
    
    // Convert Supabase data to Message objects
    return (data || []).map(item => ({
      id: item.id,
      senderId: item.sender_id,
      content: item.content,
      timestamp: new Date(item.created_at),
      isAI: item.is_ai,
      imageUrl: undefined // Note: Currently not storing imageUrl in Supabase
    }));
  } catch (error) {
    console.error('Failed to fetch messages from Supabase:', error);
    throw error;
  }
}
