
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
          <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden bg-gradient-to-r from-blue-400 to-blue-600 animate-pulse-slow">
            <div className="w-full h-full flex items-center justify-center">
              <svg 
                className="w-5 h-5 text-white" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                  stroke="white" 
                  strokeWidth="2"
                />
                <path 
                  d="M8 12C8 12 10 8 12 8C14 8 16 12 16 12C16 12 14 16 12 16C10 16 8 12 8 12Z" 
                  stroke="white" 
                  strokeWidth="2"
                  fill="rgba(255,255,255,0.3)"
                />
                <circle 
                  cx="12" 
                  cy="12" 
                  r="2" 
                  fill="white"
                />
              </svg>
            </div>
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
