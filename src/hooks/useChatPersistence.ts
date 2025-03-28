
import { useState, useEffect } from 'react';
import { Message } from '../types/chat';
import { format } from 'date-fns';
import { getWelcomeMessage, fetchMessagesFromSupabase } from '../services/messageService';
import { toast } from 'sonner';

export const useChatPersistence = (userId: string | undefined) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Load messages from Supabase when component mounts
  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      
      // First try to fetch messages from Supabase
      fetchMessagesFromSupabase(userId)
        .then((supabaseMessages) => {
          if (supabaseMessages.length > 0) {
            setMessages(supabaseMessages);
            
            // Select the most recent date by default
            const mostRecentDate = format(
              new Date(supabaseMessages[supabaseMessages.length - 1].timestamp), 
              'yyyy-MM-dd'
            );
            setSelectedDate(mostRecentDate);
          } else {
            // If no messages in Supabase, check localStorage as fallback
            const storedMessages = localStorage.getItem(`stockcoach_messages_${userId}`);
            if (storedMessages) {
              const parsedMessages = JSON.parse(storedMessages);
              setMessages(parsedMessages);
              
              // Select the most recent date by default
              if (parsedMessages.length > 0) {
                const mostRecentDate = format(
                  new Date(parsedMessages[parsedMessages.length - 1].timestamp), 
                  'yyyy-MM-dd'
                );
                setSelectedDate(mostRecentDate);
              }
            } else {
              // Add a welcome message for new users
              const welcomeMessage = getWelcomeMessage(userId);
              setMessages([welcomeMessage]);
              setSelectedDate(format(new Date(welcomeMessage.timestamp), 'yyyy-MM-dd'));
            }
          }
        })
        .catch((error) => {
          console.error('Error fetching messages from Supabase:', error);
          toast.error("Failed to load chat history from the database");
          
          // Fall back to localStorage
          const storedMessages = localStorage.getItem(`stockcoach_messages_${userId}`);
          if (storedMessages) {
            try {
              const parsedMessages = JSON.parse(storedMessages);
              setMessages(parsedMessages);
              
              if (parsedMessages.length > 0) {
                const mostRecentDate = format(
                  new Date(parsedMessages[parsedMessages.length - 1].timestamp), 
                  'yyyy-MM-dd'
                );
                setSelectedDate(mostRecentDate);
              }
            } catch (e) {
              console.error('Error parsing stored messages:', e);
              
              // If all else fails, start with welcome message
              const welcomeMessage = getWelcomeMessage(userId);
              setMessages([welcomeMessage]);
              setSelectedDate(format(new Date(welcomeMessage.timestamp), 'yyyy-MM-dd'));
            }
          } else {
            // Add a welcome message for new users
            const welcomeMessage = getWelcomeMessage(userId);
            setMessages([welcomeMessage]);
            setSelectedDate(format(new Date(welcomeMessage.timestamp), 'yyyy-MM-dd'));
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [userId]);

  // Still save to localStorage as a backup
  useEffect(() => {
    if (userId && messages.length > 0) {
      localStorage.setItem(`stockcoach_messages_${userId}`, JSON.stringify(messages));
    }
  }, [userId, messages]);

  return {
    messages,
    setMessages,
    selectedDate,
    setSelectedDate,
    isLoading
  };
};
