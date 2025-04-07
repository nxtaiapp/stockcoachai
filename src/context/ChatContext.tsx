
import { createContext, useContext, ReactNode } from 'react';
import { Message, ChatContextType } from '../types/chat';
import { useChatState } from '../hooks/useChatState';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const chatState = useChatState();
  
  return (
    <ChatContext.Provider value={{ 
      messages: chatState.messages, 
      loading: chatState.loading, 
      n8nWebhookUrl: chatState.isAdmin ? chatState.n8nWebhookUrl : '', 
      transcriptionWebhookUrl: chatState.isAdmin ? chatState.transcriptionWebhookUrl : '',
      setN8nWebhookUrl: chatState.isAdmin ? chatState.setN8nWebhookUrl : () => {}, 
      setTranscriptionWebhookUrl: chatState.isAdmin ? chatState.setTranscriptionWebhookUrl : () => {},
      sendMessage: chatState.sendMessage, 
      clearMessages: chatState.clearMessages,
      isAdmin: chatState.isAdmin,
      chatDates: chatState.chatDates,
      selectedDate: chatState.selectedDate,
      selectDate: chatState.selectDate,
      userTimezone: chatState.userTimezone,
      canCreateNewChat: chatState.canCreateNewChat,
      isTodaySession: chatState.isTodaySession,
      hasTodayMessages: chatState.hasTodayMessages
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export type { Message };
