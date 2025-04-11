
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

  // When the component first renders, check URL parameters
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
    const todayDate = new Date().toISOString().split('T')[0];
    
    console.log("URL params check:", { isNewSession, todayDate });
    
    const createNewSession = async () => {
      console.log("Attempting to create new session");
      // Fix: Don't check the return value directly since clearMessages returns Promise<void>
      await clearMessages();
      console.log("New session created successfully");
      // The clearMessages function should have already selected today's date
    };
    
    if (isNewSession) {
      // Always select today's date when creating a new session
      console.log("Creating new session - calling createNewSession()");
      createNewSession();
      
      // Clear the URL parameter after processing
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    } else if (!isTodaySession && !hasTodayMessages && chatDates.length > 0) {
      // If we're not showing today's session and there are no messages for today,
      // but we have previous sessions, ensure we're showing the most recent one
      console.log("Not today's session, selecting most recent date:", chatDates[0]);
      selectDate(chatDates[0]);
    } else if (isTodaySession && !hasTodayMessages && canCreateNewChat) {
      // If we're showing today's empty session and can create a new one, create it
      console.log("Today's session is empty, creating new session");
      createNewSession();
    }
  }, [chatDates, selectDate, selectedDate, isTodaySession, hasTodayMessages, canCreateNewChat, clearMessages]);

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
