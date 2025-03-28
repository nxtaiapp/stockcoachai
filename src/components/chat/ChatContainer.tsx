
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
            <ChatMessages messages={messages} loading={loading} />
            <ChatInputArea onSendMessage={sendMessage} disabled={loading} />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ChatContainer;
