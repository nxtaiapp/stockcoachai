
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useChatPersistence } from './useChatPersistence';
import { useChatDates } from './useChatDates';
import { useTimezone } from './useTimezone';
import { useWebhookManagement } from './useWebhookManagement';
import { useMessageManagement } from './useMessageManagement';
import { useSessionManagement } from './useSessionManagement';
import { useMessageSender } from './useMessageSender';

/**
 * Main hook that orchestrates all chat functionality
 */
export const useChatState = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { userTimezone, getCurrentDate } = useTimezone();
  
  // Load and persist chat messages
  const { 
    messages, 
    setMessages, 
    selectedDate, 
    setSelectedDate, 
    isLoading: persistenceLoading,
    saveMessagesToStorage
  } = useChatPersistence(user?.id);
  
  // Manage chat dates and filtering
  const { chatDates, filteredMessages, selectDate } = useChatDates(messages, selectedDate, setSelectedDate);
  
  // Manage webhook URLs (admin only)
  const { 
    n8nWebhookUrl, 
    transcriptionWebhookUrl, 
    visibleWebhookUrl,
    visibleTranscriptionUrl,
    setVisibleWebhookUrl, 
    setVisibleTranscriptionUrl 
  } = useWebhookManagement(isAdmin);
  
  // Manage message limits and counting
  const {
    messageCount,
    countLoading,
    hasReachedMessageLimit,
    checkMessageLimit
  } = useMessageManagement(user?.id, isAdmin, messages, setMessages);
  
  // Manage chat sessions and session creation
  const {
    creatingSession,
    clearMessages,
    hasTodayMessages,
    canCreateNewChat,
    isTodaySession
  } = useSessionManagement(
    user?.id,
    isAdmin,
    messages,
    setMessages,
    selectedDate,
    setSelectedDate,
    saveMessagesToStorage
  );
  
  // Message sending functionality
  const { loading: sendLoading, sendMessage } = useMessageSender(
    user?.id, 
    user?.name, 
    user?.email, 
    messages, 
    setMessages, 
    n8nWebhookUrl,
    checkMessageLimit
  );

  // Check message limit on load and changes
  useEffect(() => {
    if (hasReachedMessageLimit) {
      navigate('/message-limit');
    }
  }, [hasReachedMessageLimit, navigate]);

  // Overall loading state combines all loading states
  const loading = persistenceLoading || countLoading || sendLoading || creatingSession;

  return {
    messages: filteredMessages,
    allMessages: messages,
    loading,
    n8nWebhookUrl: visibleWebhookUrl,
    transcriptionWebhookUrl: visibleTranscriptionUrl,
    setN8nWebhookUrl: setVisibleWebhookUrl,
    setTranscriptionWebhookUrl: setVisibleTranscriptionUrl,
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
