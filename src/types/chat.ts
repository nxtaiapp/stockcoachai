
export interface Message {
  id: string;
  content: string;
  isAI: boolean;
  senderId: string;
  timestamp: Date;
  imageUrl?: string;
}

export interface ChatContextType {
  messages: Message[];
  loading: boolean;
  n8nWebhookUrl: string;
  setN8nWebhookUrl: (url: string) => void;
  sendMessage: (content: string, imageFile?: File) => Promise<void>;
  clearMessages: () => void;
  isAdmin: boolean;
}
