
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
  const { 
    messages, 
    setMessages, 
    selectedDate, 
    setSelectedDate, 
    isLoading: persistenceLoading,
    saveMessagesToStorage
  } = useChatPersistence(user?.id);
  
  const { chatDates, filteredMessages, selectDate } = useChatDates(messages, selectedDate, setSelectedDate);
  
  const [creatingSession, setCreatingSession] = useState(false);
  
  const allocatedMessages = 100;
  
  const { data: messageCount = 0, isLoading: countLoading } = useQuery({
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
  
  const { loading: sendLoading, sendMessage } = useMessageSender(
    user?.id, 
    user?.name, 
    user?.email, 
    messages, 
    setMessages, 
    n8nWebhookUrl
  );

  // Overall loading state combines all loading states
  const loading = persistenceLoading || countLoading || sendLoading || creatingSession;

  const todayDate = getCurrentDate();
  
  // Calculate if we have messages for today
  const todaysMessages = messages.filter(message => 
    format(new Date(message.timestamp), 'yyyy-MM-dd') === todayDate
  );
  
  const hasTodayMessages = todaysMessages.length > 0;
  
  // You can create a new chat if you're admin or if there are no messages for today
  const canCreateNewChat = isAdmin || !hasTodayMessages;
  
  const isTodaySession = selectedDate === todayDate;

  const clearMessages = async (): Promise<void> => {
    if (messageCount >= allocatedMessages && !isAdmin) {
      navigate('/message-limit');
      return;
    }

    if (!user) {
      toast.error("You must be logged in to create a new session");
      return;
    }

    // Allow creating a new chat if admin or no messages for today
    // This check was potentially causing the issue for new users
    if (!isAdmin && hasTodayMessages) {
      toast.error("You can only create one chat per day");
      return;
    }

    setCreatingSession(true);
    
    try {
      const todayDate = getCurrentDate();
      
      // Create a new array of messages, excluding any that might exist for today
      // For new users with no history, this will just be an empty array
      const updatedMessages = [...messages.filter(msg => 
        format(new Date(msg.timestamp), 'yyyy-MM-dd') !== todayDate
      )];
      
      setMessages(updatedMessages);
      
      // Explicitly save to storage to ensure persistence across navigation
      // This is crucial - even if updatedMessages is empty, we need to save it
      if (user.id) {
        saveMessagesToStorage(updatedMessages, user.id);
      }
      
      setSelectedDate(todayDate);
      
      console.log("Successfully created new empty session for today:", todayDate);
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
    selectDate,
    userTimezone,
    canCreateNewChat,
    isTodaySession,
    hasTodayMessages
  };
};
