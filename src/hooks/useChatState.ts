
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from "sonner";
import { Message } from '../types/chat';
import { useLocalStorage } from './useLocalStorage';
import { 
  sendMessageToWebhook, 
  createUserMessage, 
  createAIMessage, 
  getWelcomeMessage,
  getMockResponse,
  uploadImageAndGetUrl
} from '../services/messageService';

export const useChatState = () => {
  const { user, isAdmin } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [n8nWebhookUrl, setN8nWebhookUrl] = useLocalStorage<string>('n8n_webhook_url', '');
  const [transcriptionWebhookUrl, setTranscriptionWebhookUrl] = useLocalStorage<string>('transcription_webhook_url', '');

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

  const sendMessage = async (content: string, imageFile?: File) => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Upload image if provided
      let imageUrl: string | undefined;
      if (imageFile) {
        try {
          imageUrl = await uploadImageAndGetUrl(imageFile);
        } catch (error) {
          console.error('Error uploading image:', error);
          toast.error("Failed to upload image. Please try again.");
          setLoading(false);
          return;
        }
      }
      
      // Add user message immediately
      const userMessage = createUserMessage(user.id, content, imageUrl);
      setMessages(prev => [...prev, userMessage]);
      
      let responseContent = "";
      let messageToSend = content;
      
      // If there's an image, include its URL in the message to the AI
      if (imageUrl) {
        messageToSend += `\n[Image: ${imageUrl}]`;
      }
      
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
            messageToSend, 
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

  return {
    messages,
    loading,
    n8nWebhookUrl,
    transcriptionWebhookUrl,
    setN8nWebhookUrl,
    setTranscriptionWebhookUrl,
    sendMessage,
    clearMessages,
    isAdmin
  };
};
