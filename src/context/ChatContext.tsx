
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
      setN8nWebhookUrl: chatState.isAdmin ? chatState.setN8nWebhookUrl : () => {}, 
      sendMessage: chatState.sendMessage, 
      clearMessages: chatState.clearMessages,
      isAdmin: chatState.isAdmin
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
