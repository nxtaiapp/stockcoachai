
import { useMemo, useCallback } from 'react';
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
    
    const filtered = messages.filter(message => 
      format(new Date(message.timestamp), 'yyyy-MM-dd') === selectedDate
    );
    
    console.log(`Filtered messages for ${selectedDate}:`, filtered.length);
    return filtered;
  }, [messages, selectedDate]);

  // Select a specific date - ensure we have a callback that preserves reference
  const selectDate = useCallback((date: string) => {
    console.log("Selecting date:", date);
    setSelectedDate(date);
  }, [setSelectedDate]);

  return {
    chatDates,
    filteredMessages,
    selectDate
  };
};
