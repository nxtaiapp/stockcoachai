
export interface Message {
  id: string;
  content: string;
  isAI: boolean;
  senderId: string;
  timestamp: Date;
}

export interface ChatContextType {
  messages: Message[];
  loading: boolean;
  n8nWebhookUrl: string;
  setN8nWebhookUrl: (url: string) => void;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  isAdmin: boolean;
}
