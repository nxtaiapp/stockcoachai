
import { useState } from "react";
import { useChat } from "../../context/ChatContext";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import ChatHeader from "./ChatHeader";
import ChatSettingsPanel from "./ChatSettingsPanel";
import ChatMessages from "./ChatMessages";
import ChatInputArea from "./ChatInputArea";
import ChatSidebar from "./ChatSidebar";

const ChatContainer = () => {
  const { messages, loading, sendMessage } = useChat();
  const [showSettings, setShowSettings] = useState(false);
  
  const toggleSettings = () => setShowSettings(!showSettings);

  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-background w-full">
        <ChatSidebar />
        <SidebarInset className="overflow-hidden">
          <div className="flex flex-col h-full w-full">
            <ChatHeader 
              toggleSettings={toggleSettings} 
              showSettings={showSettings} 
            />
            
            <ChatSettingsPanel 
              showSettings={showSettings} 
              toggleSettings={toggleSettings} 
            />
            
            <ChatMessages messages={messages} loading={loading} />
            
            <ChatInputArea onSendMessage={sendMessage} disabled={loading} />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ChatContainer;
