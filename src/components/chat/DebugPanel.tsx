
import { Button } from "@/components/ui/button";
import { Calendar, RefreshCw } from "lucide-react";
import { useChat } from "../../context/ChatContext";

interface DebugPanelProps {
  showTodaysChat: () => void;
  handleStartNewSession: () => Promise<void>;
}

const DebugPanel = ({ showTodaysChat, handleStartNewSession }: DebugPanelProps) => {
  const { 
    selectedDate, 
    isTodaySession, 
    hasTodayMessages, 
    chatDates, 
    canCreateNewChat 
  } = useChat();

  return (
    <div className="bg-yellow-100 p-3 rounded-md mb-4 text-sm">
      <p>Current date: {selectedDate}</p>
      <p>Today's session: {isTodaySession ? "Yes" : "No"}</p>
      <p>Has messages today: {hasTodayMessages ? "Yes" : "No"}</p>
      <p>Can create new chat: {canCreateNewChat ? "Yes" : "No"}</p>
      <p>Available dates: {chatDates.join(', ')}</p>
      <div className="flex gap-2 mt-2">
        <Button 
          variant="secondary" 
          size="sm"
          onClick={showTodaysChat}
        >
          <Calendar className="h-4 w-4 mr-1" />
          Show Today
        </Button>
        
        <Button 
          variant="secondary" 
          size="sm"
          onClick={handleStartNewSession}
          disabled={!canCreateNewChat}
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          New Session
        </Button>
      </div>
    </div>
  );
};

export default DebugPanel;
