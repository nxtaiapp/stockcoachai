
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

export function getWelcomeMessage(userName: string): Message {
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
  
  return {
    id: generateUUID(),
    senderId: 'ai',
    content: `Hello ${displayName}! Welcome to StockCoach.ai. I'm your personal AI trading assistant. How can I help you improve your trading skills today?`,
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
