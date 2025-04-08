
import { useState, useEffect } from "react";
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
    canCreateNewChat, 
    hasTodayMessages,
    selectDate,
    chatDates,
    selectedDate,
    userTimezone
  } = useChat();
  const [showSettings, setShowSettings] = useState(false);
  
  const toggleSettings = () => setShowSettings(!showSettings);

  // When the component first renders, if there are no messages for today,
  // but there are previous chat sessions, don't automatically switch to today's date
  useEffect(() => {
    console.log("ChatContainer mounted", { selectedDate, chatDates });
    
    // If we're showing today's session but it doesn't have messages, 
    // and user has previous sessions, show the most recent one by default
    if (isTodaySession && !hasTodayMessages && chatDates.length > 0 && chatDates[0] !== selectedDate) {
      // Select the most recent chat date (first in the array since they're sorted newest first)
      console.log("Auto-selecting most recent date:", chatDates[0]);
      selectDate(chatDates[0]);
    }
  }, []);

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
