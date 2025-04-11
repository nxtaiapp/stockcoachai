import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { Message } from "../../context/ChatContext";
import ChatMessage from "../ChatMessage";
import { BarChart3, Bug, Calendar, RefreshCw } from "lucide-react";
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
    chatDates,
    canCreateNewChat,
    clearMessages
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
  
  const handleStartNewSession = async () => {
    if (!canCreateNewChat) {
      toast.error("You can only create one chat per day");
      return;
    }
    
    console.log("Manually creating new session");
    await clearMessages();
    toast.success("Created new chat session");
  };
  
  console.log("ChatMessages rendering with:", { 
    isTodaySession,
    hasTodayMessages,
    selectedDate,
    filteredMessagesLength: filteredMessages.length,
    showWelcomeScreen: isTodaySession && filteredMessages.length === 0,
    availableDates: chatDates,
    canCreateNewChat
  });

  return (
    <div 
      ref={chatContainerRef}
      className="absolute inset-0 overflow-y-auto pb-20"
      style={{ overscrollBehavior: "none" }}
    >
      {filteredMessages.length === 0 ? (
        <EmptyChatState 
          showDebug={showDebug} 
          setShowDebug={setShowDebug} 
          showTodaysChat={showTodaysChat}
          handleStartNewSession={handleStartNewSession} 
        />
      ) : (
        <div className="max-w-3xl mx-auto">
          {showDebug && (
            <div className="bg-yellow-100 p-3 rounded-md mb-4 text-sm">
              <p>Current date: {selectedDate}</p>
              <p>Today's session: {isTodaySession ? "Yes" : "No"}</p>
              <p>Has messages today: {hasTodayMessages ? "Yes" : "No"}</p>
              <p>Can create new chat: {canCreateNewChat ? "Yes" : "No"}</p>
              <p>Available dates: {chatDates.join(', ')}</p>
              <div className="flex gap-2 mt-2">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={showTodaysChat}
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Show Today
                </Button>
                
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={handleStartNewSession}
                  disabled={!canCreateNewChat}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  New Session
                </Button>
              </div>
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

const EmptyChatState = ({ 
  showDebug, 
  setShowDebug, 
  showTodaysChat,
  handleStartNewSession 
}: {
  showDebug: boolean;
  setShowDebug: (value: boolean) => void;
  showTodaysChat: () => void;
  handleStartNewSession: () => void;
}) => {
  const { isTodaySession, hasTodayMessages, selectedDate, chatDates, canCreateNewChat } = useChat();
  
  console.log("EmptyChatState rendering with:", { 
    isTodaySession, 
    hasTodayMessages,
    selectedDate,
    availableDates: chatDates,
    canCreateNewChat
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
            <p>Can create new chat: {canCreateNewChat ? "Yes" : "No"}</p>
            <p>Available dates: {chatDates.join(', ')}</p>
            <div className="flex gap-2 mt-2">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={showTodaysChat}
              >
                <Calendar className="h-4 w-4 mr-1" />
                Show Today
              </Button>
              
              <Button 
                variant="secondary" 
                size="sm"
                onClick={handleStartNewSession}
                disabled={!canCreateNewChat}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                New Session
              </Button>
            </div>
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
      
      <div className="mt-6 space-x-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setShowDebug(!showDebug)}
          className="bg-background/80 backdrop-blur-sm"
          title="Toggle Debug Mode"
        >
          <Bug size={16} />
        </Button>
        
        {canCreateNewChat && (
          <Button 
            variant="outline" 
            onClick={handleStartNewSession}
            className="bg-background/80 backdrop-blur-sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Start New Session
          </Button>
        )}
      </div>
      
      {showDebug && (
        <div className="mt-4 bg-yellow-100 p-3 rounded-md text-sm">
          <p>Current date: {selectedDate}</p>
          <p>Today's session: {isTodaySession ? "Yes" : "No"}</p>
          <p>Has messages today: {hasTodayMessages ? "Yes" : "No"}</p>
          <p>Can create new chat: {canCreateNewChat ? "Yes" : "No"}</p>
          <p>Available dates: {chatDates.join(', ')}</p>
          <div className="flex gap-2 mt-2">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={showTodaysChat}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Show Today
            </Button>
            
            <Button 
              variant="secondary" 
              size="sm"
              onClick={handleStartNewSession}
              disabled={!canCreateNewChat}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              New Session
            </Button>
          </div>
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
