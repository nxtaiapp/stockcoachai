
import { useMemo } from 'react';
import { Message } from '../types/chat';
import { format } from 'date-fns';

export const useChatDates = (messages: Message[], selectedDate: string, setSelectedDate: (date: string) => void) => {
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

  return {
    chatDates,
    filteredMessages,
    selectDate
  };
};
