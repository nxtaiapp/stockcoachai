
export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isAI: boolean;
  imageUrl?: string;
}

export interface ChatContextType {
  messages: Message[];
  loading: boolean;
  n8nWebhookUrl: string;
  transcriptionWebhookUrl: string;
  setN8nWebhookUrl: (url: string) => void;
  setTranscriptionWebhookUrl: (url: string) => void;
  sendMessage: (message: string, imageFile?: File) => Promise<void>;
  clearMessages: () => void;
  isAdmin: boolean;
}
