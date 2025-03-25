
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { toast } from "sonner";
import { Message, ChatContextType } from '../types/chat';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { 
  sendMessageToWebhook, 
  createUserMessage, 
  createAIMessage, 
  getWelcomeMessage,
  getMockResponse
} from '../services/messageService';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [n8nWebhookUrl, setN8nWebhookUrl] = useLocalStorage<string>('n8n_webhook_url', '');

  // Load messages from localStorage when component mounts
  useEffect(() => {
    if (user) {
      const storedMessages = localStorage.getItem(`stockcoach_messages_${user.id}`);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else {
        // Add a welcome message for new users
        const welcomeMessage = getWelcomeMessage(user.name || 'User');
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
      
      // Add user message immediately
      const userMessage = createUserMessage(user.id, content);
      setMessages(prev => [...prev, userMessage]);
      
      let responseContent = "";
      
      if (!n8nWebhookUrl) {
        // Fallback to mock response if no webhook URL is provided
        console.log("No webhook URL provided, using mock response");
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        responseContent = getMockResponse();
      } else {
        try {
          console.log("Sending message to webhook");
          // Wait for the actual API response
          responseContent = await sendMessageToWebhook(
            n8nWebhookUrl, 
            content, 
            user.id, 
            user.name || 'User', 
            user.email || ''
          );
          console.log("Received response from webhook:", responseContent);
        } catch (error) {
          console.error("Error sending message to webhook:", error);
          responseContent = "I'm sorry, but I couldn't reach the AI service. Please check your connection or try again later.";
        }
      }
      
      // Only add the AI message after we have a response
      const aiMessage = createAIMessage(responseContent);
      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("An error occurred while sending your message.");
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    if (user) {
      localStorage.removeItem(`stockcoach_messages_${user.id}`);
      // Add a welcome message back
      const welcomeMessage = getWelcomeMessage(user.name || 'User');
      setMessages([welcomeMessage]);
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

export type { Message };
