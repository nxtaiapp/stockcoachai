
import { useEffect, useRef } from "react";
import { Message } from "../context/ChatContext";
import { cn } from "@/lib/utils";
import { useAuth } from "../context/AuthContext";

interface ChatMessageProps {
  message: Message;
  isLatest: boolean;
}

const ChatMessage = ({ message, isLatest }: ChatMessageProps) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  // Scroll to message if it's the latest
  useEffect(() => {
    if (isLatest && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isLatest]);

  // Get user initials from name
  const getUserInitials = () => {
    if (!user || !user.name) return "U";
    
    const nameParts = user.name.split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    // Get first letter of first name and first letter of last name
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div
      ref={messageRef}
      className={cn(
        "px-4 py-6 md:px-6 border-b border-border",
        message.isAI ? "bg-secondary/20" : "bg-background"
      )}
    >
      <div className="flex gap-4 max-w-3xl mx-auto">
        {message.isAI ? (
          <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden">
            <img 
              src="/lovable-uploads/cd3f4d88-d41e-4702-8228-5671c0bca615.png" 
              alt="Alexandra AI" 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
            <span className="text-sm font-medium text-foreground">
              {getUserInitials()}
            </span>
          </div>
        )}
        <div className="flex-1 space-y-2">
          <div className="text-sm font-medium">
            {message.isAI ? "Alexandra" : "You"}
          </div>
          <div className="text-foreground whitespace-pre-wrap">
            {message.content}
            {message.imageUrl && (
              <div className="mt-2">
                <img 
                  src={message.imageUrl} 
                  alt="Uploaded image" 
                  className="max-w-full max-h-96 rounded-lg border border-border" 
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
