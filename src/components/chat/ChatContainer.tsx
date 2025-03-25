
import { useState } from "react";
import { useChat } from "../../context/ChatContext";
import ChatHeader from "./ChatHeader";
import ChatSettingsPanel from "./ChatSettingsPanel";
import ChatMessages from "./ChatMessages";
import ChatInputArea from "./ChatInputArea";

const ChatContainer = () => {
  const { messages, loading, sendMessage } = useChat();
  const [showSettings, setShowSettings] = useState(false);
  
  const toggleSettings = () => setShowSettings(!showSettings);

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-background">
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
  );
};

export default ChatContainer;
