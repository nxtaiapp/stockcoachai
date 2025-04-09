
import { useState } from 'react';
import { Message } from '../types/chat';
import { toast } from "sonner";
import { 
  createUserMessage, 
  createAIMessage, 
  uploadImageAndGetUrl,
  saveMessageToSupabase
} from '../services/messageService';
import {
  sendMessageToWebhook,
  getMockResponse
} from '../services/aiService';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useMessageSender = (
  userId: string | undefined, 
  userName: string | undefined,
  userEmail: string | undefined,
  messages: Message[], 
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  n8nWebhookUrl: string
) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Set the message allocation limit
  const allocatedMessages = 100;
  
  // Default webhook URL if none is provided
  const defaultWebhookUrl = "https://n8n-hyib.onrender.com/webhook/06598a09-d8be-4e1b-8916-d5123a6cac6d";

  // Fetch the current message count for this user
  const { data: messageCount = 0 } = useQuery({
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

  const sendMessage = async (content: string, imageFile?: File, messageType: string = 'Chat') => {
    if (!userId) {
      toast.error("You must be logged in to send messages");
      return;
    }
    
    // Check if user has reached message limit
    if (messageCount >= allocatedMessages) {
      navigate('/message-limit');
      return;
    }
    
    try {
      setLoading(true);
      
      // Upload image if provided
      let imageUrl: string | undefined;
      if (imageFile) {
        try {
          imageUrl = await uploadImageAndGetUrl(imageFile);
        } catch (error) {
          console.error('Error uploading image:', error);
          toast.error("Failed to upload image. Please try again.");
          setLoading(false);
          return;
        }
      }
      
      // Add user message immediately
      const userMessage = createUserMessage(userId, content, imageUrl);
      setMessages(prev => [...prev, userMessage]);
      
      // Save user message to Supabase
      try {
        console.log('Saving user message to Supabase');
        await saveMessageToSupabase(userMessage, userId);
        console.log('User message saved successfully');
      } catch (error) {
        console.error('Failed to save user message to Supabase:', error);
        toast.error("Failed to save your message to the database.");
      }
      
      let responseContent = "";
      let messageToSend = content;
      
      // If there's an image, include its URL in the message to the AI
      if (imageUrl) {
        messageToSend += `\n[Image: ${imageUrl}]`;
      }
      
      // Use provided webhook URL or fall back to the default one
      const webhookUrl = n8nWebhookUrl || defaultWebhookUrl;
      
      try {
        console.log("Sending message to webhook with type:", messageType);
        console.log("Using webhook URL:", webhookUrl);
        // Wait for the actual API response
        responseContent = await sendMessageToWebhook(
          webhookUrl, 
          messageToSend, 
          userId, 
          userName || 'User', 
          userEmail || '',
          messageType
        );
        console.log("Received response from webhook:", responseContent);
      } catch (error) {
        console.error("Error sending message to webhook:", error);
        responseContent = "Aw, Snap! Alexandra lost connection to her trading brain. Could be a hiccup in the signal—try refreshing or retrying, and let's get back to chart domination!";
      }
      
      // Only add the AI message after we have a response
      const aiMessage = createAIMessage(responseContent);
      setMessages(prev => [...prev, aiMessage]);
      
      // Save AI message to Supabase
      try {
        console.log('Saving AI message to Supabase');
        await saveMessageToSupabase(aiMessage, userId);
        console.log('AI message saved successfully');
      } catch (error) {
        console.error('Failed to save AI message to Supabase:', error);
        // Don't show toast for this as it's less critical for user experience
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("An error occurred while sending your message.");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    sendMessage
  };
};
