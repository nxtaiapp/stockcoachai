import { useState, useEffect, useMemo } from 'react';
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
import { format } from 'date-fns';

export const useChatState = () => {
  const { user, isAdmin } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [n8nWebhookUrl, setN8nWebhookUrl] = useLocalStorage<string>('n8n_webhook_url', '');
  const [transcriptionWebhookUrl, setTranscriptionWebhookUrl] = useLocalStorage<string>('transcription_webhook_url', '');
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Load messages from localStorage when component mounts
  useEffect(() => {
    if (user) {
      const storedMessages = localStorage.getItem(`stockcoach_messages_${user.id}`);
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages);
        setMessages(parsedMessages);
        
        // Select the most recent date by default
        if (parsedMessages.length > 0) {
          const mostRecentDate = format(new Date(parsedMessages[parsedMessages.length - 1].timestamp), 'yyyy-MM-dd');
          setSelectedDate(mostRecentDate);
        }
      } else {
        // Add a welcome message for new users
        const welcomeMessage = getWelcomeMessage(user.name || 'User');
        setMessages([welcomeMessage]);
        localStorage.setItem(`stockcoach_messages_${user.id}`, JSON.stringify([welcomeMessage]));
        setSelectedDate(format(new Date(welcomeMessage.timestamp), 'yyyy-MM-dd'));
      }
    }
  }, [user]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (user && messages.length > 0) {
      localStorage.setItem(`stockcoach_messages_${user.id}`, JSON.stringify(messages));
    }
  }, [user, messages]);

  // Group messages by date and get a sorted list of unique dates
  const chatDates = useMemo(() => {
    const dates = messages.map(message => 
      format(new Date(message.timestamp), 'yyyy-MM-dd')
    );
    // Get unique dates and sort in descending order (newest first)
    return [...new Set(dates)].sort((a, b) => b.localeCompare(a));
  }, [messages]);

  // Filter messages by selected date
  const filteredMessages = useMemo(() => {
    if (!selectedDate) return [];
    return messages.filter(message => 
      format(new Date(message.timestamp), 'yyyy-MM-dd') === selectedDate
    );
  }, [messages, selectedDate]);

  // Select a specific date
  const selectDate = (date: string) => {
    setSelectedDate(date);
  };

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
      // Get today's date in yyyy-MM-dd format
      const todayDate = format(new Date(), 'yyyy-MM-dd');
      
      // Create welcome message with today's timestamp
      const welcomeMessage = getWelcomeMessage(user.name || 'User');
      welcomeMessage.timestamp = new Date();
      
      // Add the welcome message to the existing messages
      const updatedMessages = [...messages, welcomeMessage];
      setMessages(updatedMessages);
      
      // Set the selected date to today to show the new chat immediately
      setSelectedDate(todayDate);
      
      // Save the updated messages to localStorage
      localStorage.setItem(`stockcoach_messages_${user.id}`, JSON.stringify(updatedMessages));
      
      // Show a toast notification
      toast.success("Started a new chat session");
    }
  };

  return {
    messages: filteredMessages,
    allMessages: messages,
    loading,
    n8nWebhookUrl,
    transcriptionWebhookUrl,
    setN8nWebhookUrl,
    setTranscriptionWebhookUrl,
    sendMessage,
    clearMessages,
    isAdmin,
    chatDates,
    selectedDate,
    selectDate
  };
};
