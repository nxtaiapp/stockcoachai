
import { useState } from 'react';
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

  const clearMessages = async (): Promise<void> => {
    if (!userId) {
      toast.error("You must be logged in to create a new session");
      return;
    }

    // Allow creating a new chat if admin or no messages for today
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
      if (userId) {
        saveMessagesToStorage(updatedMessages, userId);
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
    creatingSession,
    clearMessages,
    hasTodayMessages,
    canCreateNewChat,
    isTodaySession
  };
};
