
import { useState } from 'react';
import { Message } from '../types/chat';
import { toast } from "sonner";
import { 
  createUserMessage, 
  createAIMessage, 
  uploadImageAndGetUrl 
} from '../services/messageService';
import {
  sendMessageToWebhook,
  getMockResponse
} from '../services/aiService';

export const useMessageSender = (
  userId: string | undefined, 
  userName: string | undefined,
  userEmail: string | undefined,
  messages: Message[], 
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  n8nWebhookUrl: string
) => {
  const [loading, setLoading] = useState(false);

  const sendMessage = async (content: string, imageFile?: File) => {
    if (!userId) return;
    
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
      
      let responseContent = "";
      let messageToSend = content;
      
      // If there's an image, include its URL in the message to the AI
      if (imageUrl) {
        messageToSend += `\n[Image: ${imageUrl}]`;
      }
      
      if (!n8nWebhookUrl) {
        // Fallback to mock response if no webhook URL is provided
        console.log("No webhook URL provided, using mock response");
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        responseContent = getMockResponse();
      } else {
        try {
          console.log("Sending message to webhook");
          // Wait for the actual API response
          responseContent = await sendMessageToWebhook(
            n8nWebhookUrl, 
            messageToSend, 
            userId, 
            userName || 'User', 
            userEmail || ''
          );
          console.log("Received response from webhook:", responseContent);
        } catch (error) {
          console.error("Error sending message to webhook:", error);
          responseContent = "I'm sorry, but I couldn't reach the AI service. Please check your connection or try again later.";
        }
      }
      
      // Only add the AI message after we have a response
      const aiMessage = createAIMessage(responseContent);
      setMessages(prev => [...prev, aiMessage]);
      
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
