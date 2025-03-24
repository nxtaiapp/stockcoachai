
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

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
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

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
      
      // Simulate AI response with a small delay
      setTimeout(() => {
        const aiResponses = [
          "That's a great question about trading. The key is to always manage your risk and never invest more than you can afford to lose.",
          "Looking at recent market trends, it appears that technology stocks are showing strong momentum. Consider researching companies with solid fundamentals.",
          "When building a portfolio, diversification is essential. Consider allocating your investments across different sectors and asset classes.",
          "For beginners, I recommend starting with index funds or ETFs that track major indices like the S&P 500.",
          "Technical analysis suggests a potential resistance level at current prices. Watch for confirmation patterns before making your trading decision.",
          "Dollar-cost averaging can be an effective strategy in volatile markets. It helps reduce the impact of market timing on your investments.",
          "Before executing any trade, make sure you have a clear entry and exit strategy. Emotional decisions often lead to poor trading outcomes.",
          "Fundamental analysis of this company shows strong earnings growth and healthy cash flows, which could indicate a good long-term investment.",
        ];
        
        const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
        
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
      
    } catch (error) {
      console.error('Error sending message:', error);
      setLoading(false);
    }
  };

  const clearMessages = () => {
    if (user) {
      localStorage.removeItem(`stockcoach_messages_${user.id}`);
      setMessages([]);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, loading, sendMessage, clearMessages }}>
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
