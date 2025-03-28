
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from "sonner";
import { useLocalStorage } from './useLocalStorage';
import { getWelcomeMessage } from '../services/messageService';
import { useTimezone } from './useTimezone';
import { useChatPersistence } from './useChatPersistence';
import { useChatDates } from './useChatDates';
import { useMessageSender } from './useMessageSender';

export const useChatState = () => {
  const { user, isAdmin } = useAuth();
  const [n8nWebhookUrl, setN8nWebhookUrl] = useLocalStorage<string>('n8n_webhook_url', '');
  const [transcriptionWebhookUrl, setTranscriptionWebhookUrl] = useLocalStorage<string>('transcription_webhook_url', '');
  
  // Use our new hooks
  const { userTimezone, getCurrentDate } = useTimezone();
  const { messages, setMessages, selectedDate, setSelectedDate } = useChatPersistence(user?.id);
  const { chatDates, filteredMessages, selectDate } = useChatDates(messages, selectedDate, setSelectedDate);
  const { loading, sendMessage } = useMessageSender(
    user?.id, 
    user?.name, 
    user?.email, 
    messages, 
    setMessages, 
    n8nWebhookUrl
  );

  const clearMessages = () => {
    if (user) {
      // Get today's date in the user's timezone
      const todayDate = getCurrentDate();
      
      // Create welcome message with today's timestamp
      const welcomeMessage = getWelcomeMessage(user.name || 'User');
      welcomeMessage.timestamp = new Date();
      
      // Add the welcome message to the existing messages
      const updatedMessages = [...messages, welcomeMessage];
      setMessages(updatedMessages);
      
      // Set the selected date to today to show the new chat immediately
      setSelectedDate(todayDate);
      
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
    selectDate,
    userTimezone
  };
};
