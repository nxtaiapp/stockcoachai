
import { useRef, useState } from "react";
import { Message } from "../../context/ChatContext";
import { useChat } from "../../context/ChatContext";
import { Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import EmptyChatState from "./EmptyChatState";
import LoadingIndicator from "./LoadingIndicator";
import MessageList from "./MessageList";

interface ChatMessagesProps {
  messages: Message[];
  loading: boolean;
}

const ChatMessages = ({ messages, loading }: ChatMessagesProps) => {
  const { 
    selectedDate, 
    selectDate,
    clearMessages,
    canCreateNewChat
  } = useChat();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showDebug, setShowDebug] = useState(false);
  
  const showTodaysChat = () => {
    const todayDate = new Date().toISOString().split('T')[0];
    console.log("Manually selecting today's date:", todayDate);
    selectDate(todayDate);
    toast.success("Showing today's chat");
  };
  
  const handleStartNewSession = async () => {
    if (!canCreateNewChat) {
      toast.error("You can only create one chat per day");
      return;
    }
    
    console.log("Manually creating new session");
    await clearMessages();
    toast.success("Created new chat session");
  };

  return (
    <div 
      ref={chatContainerRef}
      className="absolute inset-0 overflow-y-auto pb-20"
      style={{ overscrollBehavior: "none" }}
    >
      {messages.length === 0 ? (
        <EmptyChatState 
          showDebug={showDebug} 
          setShowDebug={setShowDebug} 
          showTodaysChat={showTodaysChat}
          handleStartNewSession={handleStartNewSession} 
        />
      ) : (
        <>
          <MessageList messages={messages} />
          {loading && <LoadingIndicator />}
          
          <div className="fixed bottom-24 right-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setShowDebug(!showDebug)}
              className="bg-background/80 backdrop-blur-sm"
              title="Toggle Debug Mode"
            >
              <Bug size={16} />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatMessages;
