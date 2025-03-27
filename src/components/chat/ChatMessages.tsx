
import { useEffect, useRef } from "react";
import { Message } from "../../context/ChatContext";
import ChatMessage from "../ChatMessage";
import { BarChart3 } from "lucide-react";

interface ChatMessagesProps {
  messages: Message[];
  loading: boolean;
}

const ChatMessages = ({ messages, loading }: ChatMessagesProps) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div 
      ref={chatContainerRef}
      className="flex-1 overflow-y-auto pb-20"
      style={{ overscrollBehavior: "none" }}
    >
      {messages.length === 0 ? (
        <EmptyChatState />
      ) : (
        <div className="max-w-3xl mx-auto">
          {messages.map((message, index) => (
            <ChatMessage 
              key={message.id} 
              message={message}
              isLatest={index === messages.length - 1}
            />
          ))}
          {loading && <LoadingIndicator />}
        </div>
      )}
    </div>
  );
};

const EmptyChatState = () => (
  <div className="h-full flex flex-col items-center justify-center p-4 md:p-8">
    <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
    <h2 className="text-xl font-semibold text-center mb-2">Welcome to StockCoach.ai</h2>
    <p className="text-center text-muted-foreground max-w-md">
      Your AI-powered trading assistant. Ask any question about trading strategies, market analysis, or investment advice.
    </p>
  </div>
);

const LoadingIndicator = () => (
  <div className="p-4 max-w-3xl mx-auto">
    <div className="flex gap-3">
      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
        <BarChart3 className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium">
          StockCoach AI
        </div>
        <div className="mt-1 text-muted-foreground">
          <div className="flex gap-1">
            <div className="h-2 w-2 bg-primary/60 rounded-full animate-pulse"></div>
            <div className="h-2 w-2 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
            <div className="h-2 w-2 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ChatMessages;
