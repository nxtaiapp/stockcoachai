
import { Message } from '../types/chat';
import { toast } from "sonner";

export async function sendMessageToWebhook(
  webhookUrl: string, 
  content: string, 
  userId: string, 
  userName: string, 
  userEmail: string
): Promise<string> {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: content,
        userId,
        userName,
        userEmail,
        timestamp: new Date().toISOString(),
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    // Try to parse the response
    const data = await response.json();
    return data.response || data.message || "I received your message, but I'm not sure how to respond at the moment.";
  } catch (error) {
    console.error('Error calling n8n webhook:', error);
    toast.error("Failed to connect to n8n webhook. Please check the URL and try again.");
    throw error;
  }
}

export function createUserMessage(userId: string, content: string): Message {
  return {
    id: Math.random().toString(36).substring(2, 9),
    senderId: userId,
    content,
    timestamp: new Date(),
    isAI: false
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

export function getMockResponse(): string {
  const mockResponses = [
    "That's a great question about trading. The key is to always manage your risk and never invest more than you can afford to lose.",
    "Looking at recent market trends, it appears that technology stocks are showing strong momentum. Consider researching companies with solid fundamentals.",
    "When building a portfolio, diversification is essential. Consider allocating your investments across different sectors and asset classes.",
    "For beginners, I recommend starting with index funds or ETFs that track major indices like the S&P 500.",
    "Technical analysis suggests a potential resistance level at current prices. Watch for confirmation patterns before making your trading decision.",
    "Dollar-cost averaging can be an effective strategy in volatile markets. It helps reduce the impact of market timing on your investments.",
    "Before executing any trade, make sure you have a clear entry and exit strategy. Emotional decisions often lead to poor trading outcomes.",
    "Fundamental analysis of this company shows strong earnings growth and healthy cash flows, which could indicate a good long-term investment.",
  ];
  
  return mockResponses[Math.floor(Math.random() * mockResponses.length)];
}
