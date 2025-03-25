
import MessageInput from "../MessageInput";

interface ChatInputAreaProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

const ChatInputArea = ({ onSendMessage, disabled }: ChatInputAreaProps) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-background p-3 md:p-4">
      <MessageInput onSendMessage={onSendMessage} disabled={disabled} />
    </div>
  );
};

export default ChatInputArea;
