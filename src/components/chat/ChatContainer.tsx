import { useEffect, useState } from "react";
import { useChat } from "../../context/ChatContext";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import ChatHeader from "./ChatHeader";
import ChatSettingsPanel from "./ChatSettingsPanel";
import ChatMessages from "./ChatMessages";
import ChatInputArea from "./ChatInputArea";
import ChatSidebar from "./ChatSidebar";
import { toast } from "sonner";

const ChatContainer = () => {
  const { 
    messages, 
    loading, 
    sendMessage, 
    isTodaySession, 
    hasTodayMessages,
    clearMessages,
    selectDate,
    chatDates,
    selectedDate,
    canCreateNewChat
  } = useChat();
  
  const [showSettings, setShowSettings] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [processingUrlParams, setProcessingUrlParams] = useState(true);
  
  const toggleSettings = () => setShowSettings(!showSettings);

  // Handle URL parameters once when the component first loads
  useEffect(() => {
    if (loading) {
      // Don't make decisions while still loading
      return;
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const isNewSession = urlParams.get('new') === 'true';
    
    console.log("URL params check:", { isNewSession, loading, processingUrlParams });
    
    if (processingUrlParams) {
      // Force create a new session when explicitly requested via URL
      if (isNewSession && canCreateNewChat) {
        console.log("Creating new session via URL parameter");
        clearMessages();
        
        // Clear the URL parameter after processing
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
      
      setProcessingUrlParams(false);
    }
  }, [loading, processingUrlParams, canCreateNewChat, clearMessages]);

  // Handle session initialization after URL parameters have been processed
  useEffect(() => {
    if (loading || processingUrlParams) {
      // Wait until loading is complete and URL params have been processed
      return;
    }
    
    if (initialLoadComplete) {
      // Skip subsequent runs after initial setup is done
      return;
    }
    
    console.log("Initializing chat session:", { 
      selectedDate, 
      chatDates,
      isTodaySession,
      hasTodayMessages,
      canCreateNewChat,
      messagesLoaded: messages.length > 0
    });
    
    // If there are no messages for today and we can create a new chat, do it automatically
    // But ONLY if we don't have any messages loaded at all (first visit)
    if (!hasTodayMessages && canCreateNewChat && messages.length === 0 && chatDates.length === 0) {
      console.log("No messages for today or in history, automatically creating new session");
      clearMessages();
    }
    // If we're not showing today's session but there are messages for today, switch to today
    else if (!isTodaySession && hasTodayMessages) {
      console.log("Switching to today's session with existing messages");
      const todayDate = new Date().toISOString().split('T')[0];
      selectDate(todayDate);
    }
    // Otherwise, if we're not showing today's session and there are previous sessions,
    // ensure we're showing the most recent one
    else if (!isTodaySession && !hasTodayMessages && chatDates.length > 0) {
      console.log("Not today's session, selecting most recent date:", chatDates[0]);
      selectDate(chatDates[0]);
    }
    
    // Mark setup as complete
    setInitialLoadComplete(true);
  }, [
    messages, 
    chatDates, 
    selectDate, 
    selectedDate, 
    isTodaySession, 
    hasTodayMessages, 
    canCreateNewChat, 
    clearMessages, 
    loading, 
    initialLoadComplete,
    processingUrlParams
  ]);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <ChatSidebar />
        <SidebarInset className="flex flex-col w-full overflow-hidden">
          <ChatHeader 
            toggleSettings={toggleSettings} 
            showSettings={showSettings} 
          />
          
          <ChatSettingsPanel 
            showSettings={showSettings} 
            toggleSettings={toggleSettings} 
          />
          
          <div className="relative flex-1 overflow-hidden">
            <ChatMessages 
              messages={messages} 
              loading={loading} 
            />
            <ChatInputArea onSendMessage={sendMessage} disabled={loading} />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ChatContainer;
