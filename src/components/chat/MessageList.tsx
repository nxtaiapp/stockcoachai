
import { useEffect, useRef } from "react";
import ChatMessage from "../ChatMessage";
import { Message } from "../../context/ChatContext";

interface MessageListProps {
  messages: Message[];
}

const MessageList = ({ messages }: MessageListProps) => {
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
      className="max-w-3xl mx-auto overflow-y-auto flex-grow h-full"
    >
      {messages.map((message, index) => (
        <ChatMessage 
          key={message.id} 
          message={message}
          isLatest={index === messages.length - 1}
        />
      ))}
    </div>
  );
};

export default MessageList;
