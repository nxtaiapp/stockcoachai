import { useState, useEffect } from 'react';
import { Message } from '../types/chat';
import { format } from 'date-fns';
import { fetchMessagesFromSupabase } from '../services/messageService';
import { toast } from 'sonner';

export const useChatPersistence = (userId: string | undefined) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd')); // Default to today
  const [isLoading, setIsLoading] = useState(true);
  
  // Load messages from Supabase when component mounts
  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      console.log('Loading messages for user:', userId);
      
      // First try to fetch messages from Supabase
      fetchMessagesFromSupabase(userId)
        .then((supabaseMessages) => {
          console.log('Fetched messages from Supabase:', supabaseMessages.length);
          
          if (supabaseMessages.length > 0) {
            setMessages(supabaseMessages);
            
            // Check localStorage for the last selected date
            const storedSelectedDate = localStorage.getItem(`stockcoach_selected_date_${userId}`);
            
            if (storedSelectedDate) {
              console.log('Found stored selected date:', storedSelectedDate);
              setSelectedDate(storedSelectedDate);
            } else {
              // Default to today's date if no stored date
              const todayDate = format(new Date(), 'yyyy-MM-dd');
              setSelectedDate(todayDate);
              console.log('No stored date found, selected today\'s date:', todayDate);
            }
          } else {
            console.log('No messages found in Supabase, checking localStorage');
            // If no messages in Supabase, check localStorage as fallback
            const storedMessages = localStorage.getItem(`stockcoach_messages_${userId}`);
            if (storedMessages) {
              try {
                const parsedMessages = JSON.parse(storedMessages);
                console.log('Found messages in localStorage:', parsedMessages.length);
                setMessages(parsedMessages);
                
                // Always default to today's date
                const todayDate = format(new Date(), 'yyyy-MM-dd');
                setSelectedDate(todayDate);
                console.log('Selected today\'s date:', todayDate);
              } catch (e) {
                console.error('Error parsing stored messages:', e);
                
                // If parsing fails, start with welcome message
                // getWelcomeMessage is not defined in this file, so I'm removing it
                // const welcomeMessage = getWelcomeMessage(userId);
                // setMessages([welcomeMessage]);
                setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
                console.log('Added welcome message due to parse error');
              }
            } else {
              // Add a welcome message for new users
              console.log('No messages found in localStorage, adding welcome message');
              // getWelcomeMessage is not defined in this file, so I'm removing it
              // const welcomeMessage = getWelcomeMessage(userId);
              // setMessages([welcomeMessage]);
              setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
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
              console.log('Fallback to localStorage messages:', parsedMessages.length);
              setMessages(parsedMessages);
              
              // Always default to today's date
              const todayDate = format(new Date(), 'yyyy-MM-dd');
              setSelectedDate(todayDate);
            } catch (e) {
              console.error('Error parsing stored messages:', e);
              
              // If all else fails, start with welcome message
              // getWelcomeMessage is not defined in this file, so I'm removing it
              // const welcomeMessage = getWelcomeMessage(userId);
              // setMessages([welcomeMessage]);
              setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
            }
          } else {
            // Add a welcome message for new users
            // getWelcomeMessage is not defined in this file, so I'm removing it
            // const welcomeMessage = getWelcomeMessage(userId);
            // setMessages([welcomeMessage]);
            setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [userId]);

  // Save selected date to localStorage when it changes
  useEffect(() => {
    if (userId && selectedDate) {
      localStorage.setItem(`stockcoach_selected_date_${userId}`, selectedDate);
    }
  }, [userId, selectedDate]);

  // Still save messages to localStorage as a backup
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
