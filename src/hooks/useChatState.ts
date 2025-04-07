import { useState } from 'react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { toast } from "sonner";
import { useLocalStorage } from './useLocalStorage';
import { getWelcomeMessage } from '../services/messageService';
import { useTimezone } from './useTimezone';
import { useChatPersistence } from './useChatPersistence';
import { useChatDates } from './useChatDates';
import { useMessageSender } from './useMessageSender';
import { sendMessageToWebhook } from '../services/aiService';
import { createAIMessage } from '../services/messageService';

export const useChatState = () => {
  const { user, isAdmin } = useAuth();
  const [n8nWebhookUrl, setN8nWebhookUrl] = useLocalStorage<string>('n8n_webhook_url', '');
  const [transcriptionWebhookUrl, setTranscriptionWebhookUrl] = useLocalStorage<string>('transcription_webhook_url', '');
  
  // Use our new hooks
  const { userTimezone, getCurrentDate } = useTimezone();
  const { messages, setMessages, selectedDate, setSelectedDate } = useChatPersistence(user?.id);
  const { chatDates, filteredMessages, selectDate } = useChatDates(messages, selectedDate, setSelectedDate);
  const { loading, sendMessage } = useMessageSender(
    user?.id, 
    user?.name, 
    user?.email, 
    messages, 
    setMessages, 
    n8nWebhookUrl
  );

  // Add loading state for the clearMessages function
  const [creatingSession, setCreatingSession] = useState(false);

  // Check if the user can create a new chat (one per day)
  const todayDate = getCurrentDate();
  const canCreateNewChat = !chatDates.includes(todayDate);
  
  // Check if the selected date is today's date
  const isTodaySession = selectedDate === todayDate;
  
  // Check if there are any messages for today
  const hasTodayMessages = messages.some(message => 
    format(new Date(message.timestamp), 'yyyy-MM-dd') === todayDate
  );

  console.log("Current state:", { 
    todayDate, 
    selectedDate, 
    isTodaySession, 
    hasTodayMessages,
    messagesCount: messages.length,
    todayMessagesCount: messages.filter(m => format(new Date(m.timestamp), 'yyyy-MM-dd') === todayDate).length
  });

  const clearMessages = async () => {
    if (!user || !canCreateNewChat) {
      if (!canCreateNewChat) {
        toast.error("You can only create one chat per day");
      }
      return;
    }
    
    setCreatingSession(true);
    
    try {
      // Get today's date in the user's timezone
      const todayDate = getCurrentDate();
      
      let welcomeContent = "";
      
      // Try to get welcome message from webhook
      if (n8nWebhookUrl) {
        try {
          welcomeContent = await sendMessageToWebhook(
            n8nWebhookUrl,
            "Hello, I'd like to start a new session.",
            user.id,
            user.name || 'User',
            user.email || '',
            'New'  // Explicitly set messageType to 'New' for new sessions
          );
          console.log("Received welcome message from webhook:", welcomeContent);
        } catch (error) {
          console.error("Error getting welcome message from webhook:", error);
          // If there's an error, use the custom error message
          welcomeContent = "Aw, Snap! Alexandra lost connection to her trading brain. Could be a hiccup in the signal—try refreshing or retrying, and let's get back to chart domination!";
        }
      } else {
        // If no webhook URL is provided, use the default welcome message
        const defaultWelcome = getWelcomeMessage(
          user.name || 'User', 
          user.skill_level,
          user.experience_level
        );
        welcomeContent = defaultWelcome.content;
      }
      
      // Create AI message with the welcome content
      const welcomeMessage = createAIMessage(welcomeContent);
      
      // Add the welcome message to the existing messages
      const updatedMessages = [...messages, welcomeMessage];
      setMessages(updatedMessages);
      
      // Set the selected date to today to show the new chat immediately
      setSelectedDate(todayDate);
      
      // Show a toast notification
      toast.success("Started a new chat session");
    } catch (error) {
      console.error("Error creating new session:", error);
      toast.error("Failed to create a new session");
    } finally {
      setCreatingSession(false);
    }
  };

  return {
    messages: filteredMessages,
    allMessages: messages,
    loading: loading || creatingSession,
    n8nWebhookUrl,
    transcriptionWebhookUrl,
    setN8nWebhookUrl,
    setTranscriptionWebhookUrl,
    sendMessage,
    clearMessages,
    isAdmin,
    chatDates,
    selectedDate,
    selectDate,
    userTimezone,
    canCreateNewChat,
    isTodaySession,
    hasTodayMessages
  };
};
