
import { BarChart3, Bug, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChat } from "../../context/ChatContext";
import PromptSuggestions from "./PromptSuggestions";
import DebugPanel from "./DebugPanel";

interface EmptyChatStateProps {
  showDebug: boolean;
  setShowDebug: (value: boolean) => void;
  showTodaysChat: () => void;
  handleStartNewSession: () => Promise<void>;
}

const EmptyChatState = ({ 
  showDebug, 
  setShowDebug, 
  showTodaysChat, 
  handleStartNewSession 
}: EmptyChatStateProps) => {
  const { isTodaySession, canCreateNewChat } = useChat();
  
  if (isTodaySession) {
    return (
      <>
        {showDebug && (
          <DebugPanel 
            showTodaysChat={showTodaysChat} 
            handleStartNewSession={handleStartNewSession} 
          />
        )}
        
        <PromptSuggestions />
        
        <div className="fixed bottom-24 right-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setShowDebug(!showDebug)}
            className="bg-background/80 backdrop-blur-sm"
            title="Toggle Debug Mode"
          >
            <Bug size={16} />
          </Button>
        </div>
      </>
    );
  }
  
  return (
    <div className="h-full flex flex-col items-center justify-center p-4 md:p-8">
      <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-xl font-semibold text-center mb-2">StockCoach.ai</h2>
      <p className="text-center text-muted-foreground max-w-md">
        Your AI-powered trading coach. This chat session doesn't have any messages yet.
      </p>
      
      <div className="mt-6 space-x-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setShowDebug(!showDebug)}
          className="bg-background/80 backdrop-blur-sm"
          title="Toggle Debug Mode"
        >
          <Bug size={16} />
        </Button>
        
        {canCreateNewChat && (
          <Button 
            variant="outline" 
            onClick={handleStartNewSession}
            className="bg-background/80 backdrop-blur-sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Start New Session
          </Button>
        )}
      </div>
      
      {showDebug && (
        <DebugPanel 
          showTodaysChat={showTodaysChat} 
          handleStartNewSession={handleStartNewSession} 
        />
      )}
    </div>
  );
};

export default EmptyChatState;
