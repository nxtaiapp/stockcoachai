
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
    
    console.log("URL params check:", { isNewSession });
    
    const createNewSession = async () => {
      console.log("Attempting to create new session");
      await clearMessages();
      console.log("New session created successfully");
    };
    
    if (isNewSession && canCreateNewChat && !hasTodayMessages) {
      // Only create a new session if explicitly requested with the 'new' parameter
      // AND we can create a new chat AND there are no messages for today
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
