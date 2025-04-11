
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

  const defaultWebhookUrl = "https://n8n-hyib.onrender.com/webhook/06598a09-d8be-4e1b-8916-d5123a6cac6d";

  const { userTimezone, getCurrentDate } = useTimezone();
  const { messages, setMessages, selectedDate, setSelectedDate } = useChatPersistence(user?.id);
  const { chatDates, filteredMessages, selectDate } = useChatDates(messages, selectedDate, setSelectedDate);
  
  const [creatingSession, setCreatingSession] = useState(false);
  
  const allocatedMessages = 100;
  
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
  
  // Calculate if we have messages for today directly
  const todaysMessages = messages.filter(message => 
    format(new Date(message.timestamp), 'yyyy-MM-dd') === todayDate
  );
  
  const hasTodayMessages = todaysMessages.length > 0;
  
  // You can create a new chat if you're admin or if there are no messages for today
  const canCreateNewChat = isAdmin || !hasTodayMessages;
  
  const isTodaySession = selectedDate === todayDate;

  // Effect to force navigation to today's session when entering the chat
  useEffect(() => {
    // When loading is done and we have messages, make sure today's session is shown
    if (!loading && messages.length > 0) {
      // If no today's session exists, but we're on the chat page, create one
      if (!hasTodayMessages && window.location.pathname === '/chat') {
        console.log("No messages for today, scheduling new session creation");
        // Set a short timeout to allow other effects to complete
        const timer = setTimeout(() => {
          clearMessages();
        }, 0);
        return () => clearTimeout(timer);
      } 
      // If there are today's messages but we're not showing them, switch to today
      else if (hasTodayMessages && !isTodaySession) {
        console.log("Have messages for today but showing different date, switching to today");
        selectDate(todayDate);
      }
    }
  }, [loading, messages.length, hasTodayMessages, isTodaySession, window.location.pathname]);

  console.log("Current state:", { 
    todayDate, 
    selectedDate, 
    isTodaySession, 
    hasTodayMessages,
    canCreateNewChat,
    isAdmin,
    messagesCount: messages.length,
    todayMessagesCount: todaysMessages.length
  });

  const clearMessages = async (): Promise<void> => {
    if (messageCount >= allocatedMessages && !isAdmin) {
      navigate('/message-limit');
      return;
    }

    if (!user) {
      toast.error("You must be logged in to create a new session");
      return;
    }

    if (!isAdmin && !canCreateNewChat) {
      toast.error("You can only create one chat per day");
      return;
    }

    setCreatingSession(true);
    
    try {
      const todayDate = getCurrentDate();
      
      let welcomeContent = "";
      
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
      welcomeMessage.timestamp = new Date();
      
      // Preserve all existing messages and add the welcome message for the new session
      const updatedMessages = [...messages, welcomeMessage];
      setMessages(updatedMessages);
      
      setSelectedDate(todayDate);
      
      console.log("Successfully created new session for today:", todayDate);
    } catch (error) {
      console.error("Error creating new session:", error);
      toast.error("Failed to create a new session");
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
