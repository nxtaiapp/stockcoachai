
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { toast } from "sonner";

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isAI: boolean;
}

interface ChatContextType {
  messages: Message[];
  loading: boolean;
  n8nWebhookUrl: string;
  setN8nWebhookUrl: (url: string) => void;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState<string>(() => {
    return localStorage.getItem('n8n_webhook_url') || '';
  });

  // Save webhook URL to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('n8n_webhook_url', n8nWebhookUrl);
  }, [n8nWebhookUrl]);

  // Load messages from localStorage when component mounts
  useEffect(() => {
    if (user) {
      const storedMessages = localStorage.getItem(`stockcoach_messages_${user.id}`);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else {
        // Add a welcome message for new users
        const welcomeMessage: Message = {
          id: Math.random().toString(36).substring(2, 9),
          senderId: 'ai',
          content: `Hello ${user.name}! Welcome to StockCoach.ai. I'm your personal AI trading assistant. How can I help you improve your trading skills today?`,
          timestamp: new Date(),
          isAI: true
        };
        setMessages([welcomeMessage]);
        localStorage.setItem(`stockcoach_messages_${user.id}`, JSON.stringify([welcomeMessage]));
      }
    }
  }, [user]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (user && messages.length > 0) {
      localStorage.setItem(`stockcoach_messages_${user.id}`, JSON.stringify(messages));
    }
  }, [user, messages]);

  const sendMessage = async (content: string) => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Add user message
      const userMessage: Message = {
        id: Math.random().toString(36).substring(2, 9),
        senderId: user.id,
        content,
        timestamp: new Date(),
        isAI: false
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      if (!n8nWebhookUrl) {
        // Fallback to mock response if no webhook URL is provided
        setTimeout(() => {
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
          
          const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
          
          const aiMessage: Message = {
            id: Math.random().toString(36).substring(2, 9),
            senderId: 'ai',
            content: randomResponse,
            timestamp: new Date(),
            isAI: true
          };
          
          setMessages(prev => [...prev, aiMessage]);
          setLoading(false);
        }, 1500);
        
        return;
      }
      
      // Send message to n8n webhook
      try {
        const response = await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: content,
            userId: user.id,
            userName: user.name || 'User',
            userEmail: user.email,
            timestamp: new Date().toISOString(),
          }),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        // Try to parse the response
        try {
          const data = await response.json();
          
          const aiMessage: Message = {
            id: Math.random().toString(36).substring(2, 9),
            senderId: 'ai',
            content: data.response || data.message || "I received your message, but I'm not sure how to respond at the moment.",
            timestamp: new Date(),
            isAI: true
          };
          
          setMessages(prev => [...prev, aiMessage]);
        } catch (e) {
          // If response is not JSON or doesn't have expected format
          const aiMessage: Message = {
            id: Math.random().toString(36).substring(2, 9),
            senderId: 'ai',
            content: "I received your message, but the response format wasn't what I expected. Please check your n8n workflow configuration.",
            timestamp: new Date(),
            isAI: true
          };
          
          setMessages(prev => [...prev, aiMessage]);
        }
      } catch (error) {
        console.error('Error calling n8n webhook:', error);
        
        const aiMessage: Message = {
          id: Math.random().toString(36).substring(2, 9),
          senderId: 'ai',
          content: "I'm sorry, but I couldn't reach the AI service. Please check your connection or try again later.",
          timestamp: new Date(),
          isAI: true
        };
        
        setMessages(prev => [...prev, aiMessage]);
        toast.error("Failed to connect to n8n webhook. Please check the URL and try again.");
      } finally {
        setLoading(false);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      setLoading(false);
      toast.error("An error occurred while sending your message.");
    }
  };

  const clearMessages = () => {
    if (user) {
      localStorage.removeItem(`stockcoach_messages_${user.id}`);
      setMessages([]);
    }
  };

  return (
    <ChatContext.Provider value={{ 
      messages, 
      loading, 
      n8nWebhookUrl, 
      setN8nWebhookUrl, 
      sendMessage, 
      clearMessages 
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
