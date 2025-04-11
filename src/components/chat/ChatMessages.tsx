
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { Message } from "../../context/ChatContext";
import ChatMessage from "../ChatMessage";
import { BarChart3, Bug } from "lucide-react";
import { useChat } from "../../context/ChatContext";
import PromptSuggestions from "./PromptSuggestions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ChatMessagesProps {
  messages: Message[];
  loading: boolean;
}

const ChatMessages = ({ messages, loading }: ChatMessagesProps) => {
  const { 
    selectedDate, 
    isTodaySession, 
    hasTodayMessages,
    selectDate,
    chatDates 
  } = useChat();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showDebug, setShowDebug] = useState(false);
  
  // Filter messages by selected date
  const filteredMessages = messages.filter(message => {
    const messageDate = format(new Date(message.timestamp), 'yyyy-MM-dd');
    return messageDate === selectedDate;
  });
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [filteredMessages]);
  
  const showTodaysChat = () => {
    const todayDate = new Date().toISOString().split('T')[0];
    console.log("Manually selecting today's date:", todayDate);
    selectDate(todayDate);
    toast.success("Showing today's chat");
  };
  
  console.log("ChatMessages rendering with:", { 
    isTodaySession,
    hasTodayMessages,
    selectedDate,
    filteredMessagesLength: filteredMessages.length,
    showWelcomeScreen: isTodaySession && filteredMessages.length === 0,
    availableDates: chatDates
  });

  return (
    <div 
      ref={chatContainerRef}
      className="absolute inset-0 overflow-y-auto pb-20"
      style={{ overscrollBehavior: "none" }}
    >
      {filteredMessages.length === 0 ? (
        <EmptyChatState showDebug={showDebug} setShowDebug={setShowDebug} showTodaysChat={showTodaysChat} />
      ) : (
        <div className="max-w-3xl mx-auto">
          {showDebug && (
            <div className="bg-yellow-100 p-3 rounded-md mb-4 text-sm">
              <p>Current date: {selectedDate}</p>
              <p>Today's session: {isTodaySession ? "Yes" : "No"}</p>
              <p>Has messages today: {hasTodayMessages ? "Yes" : "No"}</p>
              <p>Available dates: {chatDates.join(', ')}</p>
              <Button 
                variant="secondary" 
                size="sm" 
                className="mt-2"
                onClick={showTodaysChat}
              >
                Show Today's Chat
              </Button>
            </div>
          )}
          
          {filteredMessages.map((message, index) => (
            <ChatMessage 
              key={message.id} 
              message={message}
              isLatest={index === filteredMessages.length - 1}
            />
          ))}
          {loading && <LoadingIndicator />}
        </div>
      )}
    </div>
  );
};

const EmptyChatState = ({ showDebug, setShowDebug, showTodaysChat }: {
  showDebug: boolean;
  setShowDebug: (value: boolean) => void;
  showTodaysChat: () => void;
}) => {
  const { isTodaySession, hasTodayMessages, selectedDate, chatDates } = useChat();
  
  console.log("EmptyChatState rendering with:", { 
    isTodaySession, 
    hasTodayMessages,
    selectedDate,
    availableDates: chatDates
  });
  
  // Show prompt suggestions when viewing today's session and there are no messages
  if (isTodaySession) {
    return (
      <>
        {showDebug && (
          <div className="max-w-3xl mx-auto bg-yellow-100 p-3 rounded-md mb-4 text-sm">
            <p>Current date: {selectedDate}</p>
            <p>Today's session: {isTodaySession ? "Yes" : "No"}</p>
            <p>Has messages today: {hasTodayMessages ? "Yes" : "No"}</p>
            <p>Available dates: {chatDates.join(', ')}</p>
            <Button 
              variant="secondary" 
              size="sm" 
              className="mt-2"
              onClick={showTodaysChat}
            >
              Show Today's Chat
            </Button>
          </div>
        )}
        <PromptSuggestions />
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
    );
  }
  
  // Show generic welcome message for previous days' chats
  return (
    <div className="h-full flex flex-col items-center justify-center p-4 md:p-8">
      <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-xl font-semibold text-center mb-2">StockCoach.ai</h2>
      <p className="text-center text-muted-foreground max-w-md">
        Your AI-powered trading coach. This chat session doesn't have any messages yet.
      </p>
      
      <div className="mt-6">
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
      
      {showDebug && (
        <div className="mt-4 bg-yellow-100 p-3 rounded-md text-sm">
          <p>Current date: {selectedDate}</p>
          <p>Today's session: {isTodaySession ? "Yes" : "No"}</p>
          <p>Has messages today: {hasTodayMessages ? "Yes" : "No"}</p>
          <p>Available dates: {chatDates.join(', ')}</p>
          <Button 
            variant="secondary" 
            size="sm" 
            className="mt-2"
            onClick={showTodaysChat}
          >
            Show Today's Chat
          </Button>
        </div>
      )}
    </div>
  );
};

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
