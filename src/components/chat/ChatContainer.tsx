
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
    userTimezone
  } = useChat();
  const [showSettings, setShowSettings] = useState(false);
  
  const toggleSettings = () => setShowSettings(!showSettings);

  // When rendering for the first time and we have no messages for today,
  // ensure we're showing today's session
  useEffect(() => {
    if (!isTodaySession && !hasTodayMessages) {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      selectDate(today);
    }
  }, [isTodaySession, hasTodayMessages, selectDate]);

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
