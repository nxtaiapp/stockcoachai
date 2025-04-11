
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { toast } from "sonner";
import { useLocalStorage } from './useLocalStorage';
import { getWelcomeMessage } from '../services/welcomeMessageService';
import { useTimezone } from './useTimezone';
import { useChatPersistence } from './useChatPersistence';
import { useChatDates } from './useChatDates';
import { useMessageSender } from './useMessageSender';
import { sendMessageToWebhook } from '../services/aiService';
import { createAIMessage } from '../services/messageFactory';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useChatState = () => {
  const { user, isAdmin } = useAuth();
  const [n8nWebhookUrl, setN8nWebhookUrl] = useLocalStorage<string>('n8n_webhook_url', '');
  const [transcriptionWebhookUrl, setTranscriptionWebhookUrl] = useLocalStorage<string>('transcription_webhook_url', '');
  const navigate = useNavigate();
  
  // Default webhook URL
  const defaultWebhookUrl = "https://n8n-hyib.onrender.com/webhook/06598a09-d8be-4e1b-8916-d5123a6cac6d";
  
  const { userTimezone, getCurrentDate } = useTimezone();
  const { messages, setMessages, selectedDate, setSelectedDate } = useChatPersistence(user?.id);
  const { chatDates, filteredMessages, selectDate } = useChatDates(messages, selectedDate, setSelectedDate);
  
  const [creatingSession, setCreatingSession] = useState(false);
  
  // Set the message allocation limit
  const allocatedMessages = 100;
  
  // Fetch the current message count for this user
  const { data: messageCount = 0 } = useQuery({
    queryKey: ['messageCount', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      
      const { count, error } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_ai', false);
      
      if (error) {
        console.error('Error fetching message count:', error);
        return 0;
      }
      
      return count || 0;
    },
    enabled: !!user?.id
  });
  
  // Check if user has reached message limit and redirect if necessary
  useEffect(() => {
    if (messageCount >= allocatedMessages && !isAdmin) {
      navigate('/message-limit');
    }
  }, [messageCount, allocatedMessages, navigate, isAdmin]);
  
  const { loading, sendMessage } = useMessageSender(
    user?.id, 
    user?.name, 
    user?.email, 
    messages, 
    setMessages, 
    n8nWebhookUrl
  );

  const todayDate = getCurrentDate();
  
  // Force canCreateNewChat to be true if the user is an admin
  const canCreateNewChat = isAdmin || !chatDates.includes(todayDate);
  
  const isTodaySession = selectedDate === todayDate;
  
  const hasTodayMessages = messages.some(message => 
    format(new Date(message.timestamp), 'yyyy-MM-dd') === todayDate
  );

  console.log("Current state:", { 
    todayDate, 
    selectedDate, 
    isTodaySession, 
    hasTodayMessages,
    canCreateNewChat,
    isAdmin,
    messagesCount: messages.length,
    todayMessagesCount: messages.filter(m => format(new Date(m.timestamp), 'yyyy-MM-dd') === todayDate).length
  });

  const clearMessages = async (): Promise<boolean> => {
    // Check if user has reached message limit
    if (messageCount >= allocatedMessages && !isAdmin) {
      navigate('/message-limit');
      return false;
    }
    
    if (!user) {
      toast.error("You must be logged in to create a new session");
      return false;
    }
    
    // Allow admins to create new sessions anytime
    if (!isAdmin && !canCreateNewChat) {
      toast.error("You can only create one chat per day");
      return false;
    }
    
    setCreatingSession(true);
    
    try {
      const todayDate = getCurrentDate();
      
      let welcomeContent = "";
      
      // Use provided webhook URL or fall back to the default one
      const webhookUrl = n8nWebhookUrl || defaultWebhookUrl;
      
      try {
        console.log("Using webhook URL for welcome message:", webhookUrl);
        welcomeContent = await sendMessageToWebhook(
          webhookUrl,
          "Hello, I'd like to start a new session.",
          user.id,
          user.name || 'User',
          user.email || '',
          'New'
        );
        console.log("Received welcome message from webhook:", welcomeContent);
      } catch (error) {
        console.error("Error getting welcome message from webhook:", error);
        welcomeContent = "Aw, Snap! Alexandra lost connection to her trading brain. Could be a hiccup in the signal—try refreshing or retrying, and let's get back to chart domination!";
      }
      
      const welcomeMessage = createAIMessage(welcomeContent);
      
      // Force the welcome message to have today's date
      welcomeMessage.timestamp = new Date();
      
      // Create a new array with only today's welcome message
      // This effectively clears the previous messages for today
      const todayMessages = messages.filter(msg => 
        format(new Date(msg.timestamp), 'yyyy-MM-dd') !== todayDate
      );
      
      const updatedMessages = [...todayMessages, welcomeMessage];
      setMessages(updatedMessages);
      
      // Force select today's date
      setSelectedDate(todayDate);
      
      console.log("Successfully created new session for today:", todayDate);
      return true;
    } catch (error) {
      console.error("Error creating new session:", error);
      toast.error("Failed to create a new session");
      return false;
    } finally {
      setCreatingSession(false);
    }
  };

  return {
    messages: filteredMessages,
    allMessages: messages,
    loading: loading || creatingSession,
    n8nWebhookUrl,
    transcriptionWebhookUrl,
    setN8nWebhookUrl,
    setTranscriptionWebhookUrl,
    sendMessage,
    clearMessages,
    isAdmin,
    chatDates,
    selectedDate,
    selectDate,
    userTimezone,
    canCreateNewChat,
    isTodaySession,
    hasTodayMessages
  };
};
