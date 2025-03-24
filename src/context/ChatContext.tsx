
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
  const { user, supabase } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState<string>(() => {
    return localStorage.getItem('n8n_webhook_url') || '';
  });

  // Save webhook URL to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('n8n_webhook_url', n8nWebhookUrl);
  }, [n8nWebhookUrl]);

  // Load messages from Supabase when component mounts and user is authenticated
  useEffect(() => {
    if (!user) return;
    
    const fetchMessages = async () => {
      try {
        setLoading(true);
        
        // Get messages from Supabase
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        
        if (data.length > 0) {
          // Transform Supabase data to our Message format
          const formattedMessages = data.map(msg => ({
            id: msg.id,
            senderId: msg.sender_id,
            content: msg.content,
            timestamp: new Date(msg.created_at),
            isAI: msg.is_ai,
          }));
          
          setMessages(formattedMessages);
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
          
          // Store welcome message in Supabase
          await supabase.from('chat_messages').insert({
            id: welcomeMessage.id,
            user_id: user.id,
            sender_id: welcomeMessage.senderId,
            content: welcomeMessage.content,
            created_at: welcomeMessage.timestamp.toISOString(),
            is_ai: welcomeMessage.isAI,
          });
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error("Failed to load chat messages");
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, [user, supabase]);

  const sendMessage = async (content: string) => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Create user message
      const userMessage: Message = {
        id: Math.random().toString(36).substring(2, 9),
        senderId: user.id,
        content,
        timestamp: new Date(),
        isAI: false
      };
      
      // Add message to local state
      setMessages(prev => [...prev, userMessage]);
      
      // Store message in Supabase
      await supabase.from('chat_messages').insert({
        id: userMessage.id,
        user_id: user.id,
        sender_id: userMessage.senderId,
        content: userMessage.content,
        created_at: userMessage.timestamp.toISOString(),
        is_ai: userMessage.isAI,
      });
      
      if (!n8nWebhookUrl) {
        // Fallback to mock response if no webhook URL is provided
        setTimeout(async () => {
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
          
          // Add AI message to local state
          setMessages(prev => [...prev, aiMessage]);
          
          // Store AI message in Supabase
          await supabase.from('chat_messages').insert({
            id: aiMessage.id,
            user_id: user.id,
            sender_id: aiMessage.senderId,
            content: aiMessage.content,
            created_at: aiMessage.timestamp.toISOString(),
            is_ai: aiMessage.isAI,
          });
          
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
          
          // Add AI message to local state
          setMessages(prev => [...prev, aiMessage]);
          
          // Store AI message in Supabase
          await supabase.from('chat_messages').insert({
            id: aiMessage.id,
            user_id: user.id,
            sender_id: aiMessage.senderId,
            content: aiMessage.content,
            created_at: aiMessage.timestamp.toISOString(),
            is_ai: aiMessage.isAI,
          });
          
        } catch (e) {
          // If response is not JSON or doesn't have expected format
          const aiMessage: Message = {
            id: Math.random().toString(36).substring(2, 9),
            senderId: 'ai',
            content: "I received your message, but the response format wasn't what I expected. Please check your n8n workflow configuration.",
            timestamp: new Date(),
            isAI: true
          };
          
          // Add AI message to local state
          setMessages(prev => [...prev, aiMessage]);
          
          // Store AI message in Supabase
          await supabase.from('chat_messages').insert({
            id: aiMessage.id,
            user_id: user.id,
            sender_id: aiMessage.senderId,
            content: aiMessage.content,
            created_at: aiMessage.timestamp.toISOString(),
            is_ai: aiMessage.isAI,
          });
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
        
        // Add AI message to local state
        setMessages(prev => [...prev, aiMessage]);
        
        // Store AI message in Supabase
        await supabase.from('chat_messages').insert({
          id: aiMessage.id,
          user_id: user.id,
          sender_id: aiMessage.senderId,
          content: aiMessage.content,
          created_at: aiMessage.timestamp.toISOString(),
          is_ai: aiMessage.isAI,
        });
        
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

  const clearMessages = async () => {
    if (!user) return;
    
    try {
      // Delete all messages for this user from Supabase
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Clear local messages state
      setMessages([]);
      toast.success("Chat history cleared successfully");
    } catch (error) {
      console.error('Error clearing messages:', error);
      toast.error("Failed to clear chat history");
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
