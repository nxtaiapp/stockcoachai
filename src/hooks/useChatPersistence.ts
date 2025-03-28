
import { useState, useEffect } from 'react';
import { Message } from '../types/chat';
import { format } from 'date-fns';
import { getWelcomeMessage } from '../services/messageService';

export const useChatPersistence = (userId: string | undefined) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Load messages from localStorage when component mounts
  useEffect(() => {
    if (userId) {
      const storedMessages = localStorage.getItem(`stockcoach_messages_${userId}`);
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
        const welcomeMessage = getWelcomeMessage(userId);
        setMessages([welcomeMessage]);
        localStorage.setItem(`stockcoach_messages_${userId}`, JSON.stringify([welcomeMessage]));
        setSelectedDate(format(new Date(welcomeMessage.timestamp), 'yyyy-MM-dd'));
      }
    }
  }, [userId]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (userId && messages.length > 0) {
      localStorage.setItem(`stockcoach_messages_${userId}`, JSON.stringify(messages));
    }
  }, [userId, messages]);

  return {
    messages,
    setMessages,
    selectedDate,
    setSelectedDate
  };
};
