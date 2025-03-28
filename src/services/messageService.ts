
import { Message } from '../types/chat';
import { toast } from "sonner";

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

export function createUserMessage(userId: string, content: string, imageUrl?: string): Message {
  return {
    id: Math.random().toString(36).substring(2, 9),
    senderId: userId,
    content,
    timestamp: new Date(),
    isAI: false,
    imageUrl
  };
}

export function createAIMessage(content: string): Message {
  return {
    id: Math.random().toString(36).substring(2, 9),
    senderId: 'ai',
    content,
    timestamp: new Date(),
    isAI: true
  };
}

export function getWelcomeMessage(userName: string): Message {
  return {
    id: Math.random().toString(36).substring(2, 9),
    senderId: 'ai',
    content: `Hello ${userName}! Welcome to StockCoach.ai. I'm your personal AI trading assistant. How can I help you improve your trading skills today?`,
    timestamp: new Date(),
    isAI: true
  };
}
