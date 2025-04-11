
import { useState } from 'react';
import { Message } from '../types/chat';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { createUserMessage, createAIMessage, saveMessageToSupabase } from '../services/messageService';

/**
 * Hook for handling message-specific features like sending and limiting
 */
export const useMessageManagement = (
  userId: string | undefined, 
  isAdmin: boolean,
  messages: Message[],
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  // Message allocation limit
  const allocatedMessages = 100;
  const navigate = useNavigate();

  // Fetch the current message count for this user
  const { data: messageCount = 0, isLoading: countLoading } = useQuery({
    queryKey: ['messageCount', userId],
    queryFn: async () => {
      if (!userId) return 0;

      const { count, error } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_ai', false);
      
      if (error) {
        console.error('Error fetching message count:', error);
        return 0;
      }
      
      return count || 0;
    },
    enabled: !!userId
  });

  // Check if user has exceeded message limit
  const hasReachedMessageLimit = !isAdmin && messageCount >= allocatedMessages;

  // Check limit and navigate if exceeded
  const checkMessageLimit = () => {
    if (hasReachedMessageLimit) {
      navigate('/message-limit');
      return true;
    }
    return false;
  };

  return {
    messageCount,
    countLoading,
    hasReachedMessageLimit,
    checkMessageLimit,
    allocatedMessages
  };
};
