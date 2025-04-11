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
  
  const toggleSettings = () => setShowSettings(!showSettings);

  // When the component first renders, check URL parameters and session status
  useEffect(() => {
    console.log("ChatContainer mounted", { 
      selectedDate, 
      chatDates,
      isTodaySession,
      hasTodayMessages,
      canCreateNewChat
    });
    
    const urlParams = new URLSearchParams(window.location.search);
    const isNewSession = urlParams.get('new') === 'true';
    
    console.log("URL params check:", { isNewSession });
    
    // Always force create a new session when explicitly requested
    if (isNewSession && canCreateNewChat) {
      console.log("Creating new session via URL parameter");
      clearMessages();
      
      // Clear the URL parameter after processing
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      return;
    }
    
    // If there are no messages for today and we can create a new chat, do it automatically
    if (!hasTodayMessages && canCreateNewChat && !loading) {
      console.log("No messages for today, automatically creating new session");
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
  }, [chatDates, selectDate, selectedDate, isTodaySession, hasTodayMessages, canCreateNewChat, clearMessages, loading]);

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
