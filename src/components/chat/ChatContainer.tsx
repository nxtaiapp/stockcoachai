
import { useEffect, useState } from "react";
import { useChat } from "../../context/ChatContext";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import ChatHeader from "./ChatHeader";
import ChatSettingsPanel from "./ChatSettingsPanel";
import ChatMessages from "./ChatMessages";
import ChatInputArea from "./ChatInputArea";
import ChatSidebar from "./ChatSidebar";

const ChatContainer = () => {
  const { 
    messages, 
    loading, 
    sendMessage, 
    isTodaySession, 
    hasTodayMessages,
    selectDate,
    chatDates,
    selectedDate
  } = useChat();
  
  const [showSettings, setShowSettings] = useState(false);
  
  const toggleSettings = () => setShowSettings(!showSettings);

  // When the component first renders, check URL parameters
  useEffect(() => {
    console.log("ChatContainer mounted", { selectedDate, chatDates });
    
    const urlParams = new URLSearchParams(window.location.search);
    const isNewSession = urlParams.get('new') === 'true';
    const todayDate = new Date().toISOString().split('T')[0];
    
    if (isNewSession) {
      // Always select today's date when creating a new session
      console.log("Creating new session - forcing today's date:", todayDate);
      selectDate(todayDate);
      
      // Clear the URL parameter after processing
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    } else if (isTodaySession && !hasTodayMessages && chatDates.length > 0 && chatDates[0] !== selectedDate) {
      // Otherwise, if we're showing today's session but it doesn't have messages, 
      // and user has previous sessions, show the most recent one by default
      console.log("Auto-selecting most recent date:", chatDates[0]);
      selectDate(chatDates[0]);
    }
  }, [chatDates, selectDate, selectedDate, isTodaySession, hasTodayMessages]);

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
