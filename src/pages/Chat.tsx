
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ChatProvider } from "../context/ChatContext";
import ChatContainer from "../components/chat/ChatContainer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const ChatPage = () => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/signin");
    }
  }, [user, loading, navigate]);

  const checkSupabaseMessages = async () => {
    if (!user?.id) return;
    
    try {
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
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ChatProvider>
      {isAdmin && (
        <div className="fixed top-20 right-4 z-50">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkSupabaseMessages}
            className="bg-background/80 backdrop-blur-sm"
          >
            Debug Messages
          </Button>
          {debugInfo && (
            <div className="mt-2 p-2 bg-background/90 backdrop-blur-sm border border-border rounded-md text-xs max-w-[300px] overflow-auto">
              {debugInfo}
            </div>
          )}
        </div>
      )}
      <ChatContainer />
    </ChatProvider>
  );
};

export default ChatPage;
