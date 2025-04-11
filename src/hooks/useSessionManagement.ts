
import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { useTimezone } from './useTimezone';
import { toast } from 'sonner';
import { Message } from '../types/chat';

/**
 * Hook for managing chat sessions, including creating new sessions
 */
export const useSessionManagement = (
  userId: string | undefined,
  isAdmin: boolean,
  messages: Message[],
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  selectedDate: string,
  setSelectedDate: (date: string) => void,
  saveMessagesToStorage: (messages: Message[], userId: string) => void
) => {
  const [creatingSession, setCreatingSession] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const { getCurrentDate } = useTimezone();
  
  // Calculate if we have messages for today
  const todayDate = getCurrentDate();
  const todaysMessages = messages.filter(message => 
    format(new Date(message.timestamp), 'yyyy-MM-dd') === todayDate
  );
  
  const hasTodayMessages = todaysMessages.length > 0;
  
  // You can create a new chat if you're admin or if there are no messages for today
  const canCreateNewChat = isAdmin || !hasTodayMessages;
  const isTodaySession = selectedDate === todayDate;

  const clearMessages = useCallback(async (): Promise<boolean> => {
    if (!userId) {
      toast.error("You must be logged in to create a new session");
      setSessionError("Authentication required");
      return false;
    }

    // Allow creating a new chat if admin or no messages for today
    if (!isAdmin && hasTodayMessages) {
      toast.error("You can only create one chat per day");
      setSessionError("Daily limit reached");
      return false;
    }

    setCreatingSession(true);
    setSessionError(null);
    
    try {
      const todayDate = getCurrentDate();
      
      // Create a new array of messages, excluding any that might exist for today
      // For new users with no history, this will just be an empty array
      const updatedMessages = [...messages.filter(msg => 
        format(new Date(msg.timestamp), 'yyyy-MM-dd') !== todayDate
      )];
      
      setMessages(updatedMessages);
      
      // Explicitly save to storage to ensure persistence across navigation
      if (userId) {
        saveMessagesToStorage(updatedMessages, userId);
      }
      
      setSelectedDate(todayDate);
      
      console.log("Successfully created new empty session for today:", todayDate);
      return true;
    } catch (error) {
      console.error("Error creating new session:", error);
      toast.error("Failed to create a new session");
      setSessionError("Session creation failed");
      return false;
    } finally {
      setCreatingSession(false);
    }
  }, [userId, isAdmin, hasTodayMessages, getCurrentDate, messages, setMessages, saveMessagesToStorage, setSelectedDate]);

  // Function to retry session creation if it failed
  const retrySessionCreation = useCallback(async (): Promise<boolean> => {
    setSessionError(null);
    return clearMessages();
  }, [clearMessages]);

  return {
    creatingSession,
    clearMessages,
    retrySessionCreation,
    hasTodayMessages,
    canCreateNewChat,
    isTodaySession,
    sessionError
  };
};
