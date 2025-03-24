
import { useEffect, useRef } from "react";
import { Message } from "../context/ChatContext";
import { cn } from "@/lib/utils";
import { BarChart3 } from "lucide-react";

interface ChatMessageProps {
  message: Message;
  isLatest: boolean;
}

const ChatMessage = ({ message, isLatest }: ChatMessageProps) => {
  const messageRef = useRef<HTMLDivElement>(null);
  
  // Scroll to message if it's the latest
  useEffect(() => {
    if (isLatest && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isLatest]);

  return (
    <div
      ref={messageRef}
      className={cn(
        "message-container",
        message.isAI ? "ai-message" : "user-message"
      )}
    >
      <div className="flex gap-3">
        {message.isAI ? (
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
        ) : (
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
            <span className="text-sm font-medium text-foreground">
              {message.senderId.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex-1">
          <div className="text-sm font-medium">
            {message.isAI ? "StockCoach AI" : "You"}
          </div>
          <div className="mt-1 text-foreground">{message.content}</div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
