
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ChatProvider } from "../context/ChatContext";
import ChatContainer from "../components/chat/ChatContainer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useChat } from "../context/ChatContext";

// Component wrapped with ChatProvider that handles auto-session creation
const ChatContent = () => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [checkingMessages, setCheckingMessages] = useState(false);
  const { canCreateNewChat, clearMessages, hasTodayMessages } = useChat();

  // Auto-create session when component mounts if needed
  useEffect(() => {
    const createSessionIfNeeded = async () => {
      // If we can create a new chat and don't have any messages for today, create a new session
      if (canCreateNewChat && !hasTodayMessages) {
        console.log("Auto-creating new session for today");
        try {
          await clearMessages();
          toast.success("Started a new trading session for today");
        } catch (error) {
          console.error("Failed to auto-create session:", error);
        }
      }
    };

    if (user && !loading) {
      createSessionIfNeeded();
    }
  }, [user, loading, canCreateNewChat, hasTodayMessages, clearMessages]);

  const checkSupabaseMessages = async () => {
    if (!user?.id) return;
    
    try {
      setCheckingMessages(true);
      
      // Check if the table can be accessed
      const { data, error, status } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        setDebugInfo(`Error fetching messages: ${JSON.stringify(error)} (Status: ${status})`);
        toast.error("Error checking messages in database");
        return;
      }
      
      setDebugInfo(`Found ${data?.length || 0} messages in the database for user ${user.id}`);
      toast.success(`Found ${data?.length || 0} messages in the database`);
    } catch (err) {
      console.error("Error checking Supabase messages:", err);
      setDebugInfo(`Exception: ${JSON.stringify(err)}`);
      toast.error("Exception while checking messages");
    } finally {
      setCheckingMessages(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Ensure we only render ChatContainer when user is available
  if (!user) {
    return null; // Will redirect in the parent component's useEffect
  }

  return (
    <>
      {isAdmin && (
        <div className="fixed top-20 right-4 z-50">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkSupabaseMessages}
            disabled={checkingMessages}
            className="bg-background/80 backdrop-blur-sm"
          >
            {checkingMessages ? 'Checking...' : 'Debug Messages'}
          </Button>
          {debugInfo && (
            <div className="mt-2 p-3 bg-background/90 backdrop-blur-sm border border-border rounded-md text-sm max-w-[300px] overflow-auto">
              {debugInfo}
            </div>
          )}
        </div>
      )}
      <ChatContainer />
    </>
  );
};

// Main Chat page component
const ChatPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/signin");
      } else {
        // If user is logged in and hasn't been to the welcome page yet, 
        // redirect to welcome
        const hasVisitedWelcome = sessionStorage.getItem('visited_welcome');
        if (!hasVisitedWelcome) {
          sessionStorage.setItem('visited_welcome', 'true');
          navigate("/welcome");
        }
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ChatProvider>
      <ChatContent />
    </ChatProvider>
  );
};

export default ChatPage;
