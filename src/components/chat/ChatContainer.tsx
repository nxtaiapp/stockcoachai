
import { useEffect, useState, useCallback } from "react";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
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
  
  const { sessionChecked } = useAuth();
  
  const [showSettings, setShowSettings] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [processingUrlParams, setProcessingUrlParams] = useState(true);
  
  const toggleSettings = () => setShowSettings(!showSettings);

  // Handle URL parameters once when the component first loads
  useEffect(() => {
    // Wait for both loading to complete and session to be checked
    if (loading || !sessionChecked) {
      return;
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const isNewSession = urlParams.get('new') === 'true';
    
    console.log("URL params check:", { isNewSession, loading, processingUrlParams, sessionChecked });
    
    if (processingUrlParams) {
      // Force create a new session when explicitly requested via URL
      if (isNewSession && canCreateNewChat) {
        console.log("Creating new session via URL parameter");
        clearMessages().then(() => {
          // Clear the URL parameter after processing
          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
        }).catch(error => {
          console.error("Failed to create new session from URL parameter:", error);
          toast.error("Could not create a new session");
        });
      } else {
        // Clear the URL parameter if we're not creating a new session
        if (isNewSession) {
          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
        }
      }
      
      setProcessingUrlParams(false);
    }
  }, [loading, processingUrlParams, canCreateNewChat, clearMessages, sessionChecked]);

  // Safely create a new chat session
  const safelyCreateNewSession = useCallback(() => {
    if (canCreateNewChat && messages.length === 0 && chatDates.length === 0) {
      console.log("No messages for today or in history, automatically creating new session");
      clearMessages().catch(error => {
        console.error("Failed to automatically create new session:", error);
        // Not showing error toast here since this is an automatic operation
      });
      return true;
    }
    return false;
  }, [canCreateNewChat, messages.length, chatDates.length, clearMessages]);

  // Handle session initialization after URL parameters have been processed
  useEffect(() => {
    // Wait for all conditions to be met
    if (loading || processingUrlParams || !sessionChecked) {
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
      messagesLoaded: messages.length > 0,
      sessionChecked
    });
    
    // If there are no messages for today and we can create a new chat, do it automatically
    // But ONLY if we don't have any messages loaded at all (first visit)
    const newSessionCreated = safelyCreateNewSession();
    
    if (!newSessionCreated) {
      // If we're not showing today's session but there are messages for today, switch to today
      if (!isTodaySession && hasTodayMessages) {
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
    processingUrlParams,
    sessionChecked,
    safelyCreateNewSession
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
              loading={loading || !sessionChecked} 
            />
            <ChatInputArea onSendMessage={sendMessage} disabled={loading || !sessionChecked} />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ChatContainer;
