
export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isAI: boolean;
}

export interface ChatContextType {
  messages: Message[];
  loading: boolean;
  n8nWebhookUrl: string;
  setN8nWebhookUrl: (url: string) => void;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
}
