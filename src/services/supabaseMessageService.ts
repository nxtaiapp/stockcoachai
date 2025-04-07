
/**
 * Services for interacting with Supabase message storage
 */

import { supabase } from '@/lib/supabase';
import { Message } from '../types/chat';

// Updated function to save a message to Supabase with better error logging
export async function saveMessageToSupabase(message: Message, userId: string): Promise<void> {
  try {
    console.log('Saving message to Supabase:', { message, userId });
    
    const { error } = await supabase
      .from('chat_messages')
      .insert({
        id: message.id,
        user_id: userId,
        sender_id: message.senderId,
        content: message.content,
        is_ai: message.isAI,
        created_at: message.timestamp.toISOString()
      });
    
    if (error) {
      console.error('Error saving message to Supabase:', error);
      throw error;
    } else {
      console.log('Message saved successfully to Supabase');
    }
  } catch (error) {
    console.error('Failed to save message to Supabase:', error);
    throw error;
  }
}

// Updated function to fetch messages from Supabase with better error handling
export async function fetchMessagesFromSupabase(userId: string): Promise<Message[]> {
  try {
    console.log('Fetching messages for user:', userId);
    
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching messages from Supabase:', error);
      throw error;
    }
    
    console.log('Fetched messages from Supabase:', data);
    
    // Convert Supabase data to Message objects
    return (data || []).map(item => ({
      id: item.id,
      senderId: item.sender_id,
      content: item.content,
      timestamp: new Date(item.created_at),
      isAI: item.is_ai,
      imageUrl: undefined // Note: Currently not storing imageUrl in Supabase
    }));
  } catch (error) {
    console.error('Failed to fetch messages from Supabase:', error);
    throw error;
  }
}
