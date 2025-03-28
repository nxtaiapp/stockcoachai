
import MessageInput from "../MessageInput";
import { useChat } from "../../context/ChatContext";
import { AlertCircle } from "lucide-react";

interface ChatInputAreaProps {
  onSendMessage: (message: string, imageFile?: File) => void;
  disabled: boolean;
}

const ChatInputArea = ({ onSendMessage, disabled }: ChatInputAreaProps) => {
  const { isTodaySession } = useChat();
  
  const isInputDisabled = disabled || !isTodaySession;
  
  return (
    <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-background p-3 md:p-4">
      {!isTodaySession && (
        <div className="flex items-center gap-2 mb-2 p-2 text-sm text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400 rounded-md">
          <AlertCircle className="h-4 w-4" />
          <p>You can only send messages in today's chat session</p>
        </div>
      )}
      <MessageInput onSendMessage={onSendMessage} disabled={isInputDisabled} />
    </div>
  );
};

export default ChatInputArea;
