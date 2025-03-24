
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ChatProvider, useChat } from "../context/ChatContext";
import ChatMessage from "../components/ChatMessage";
import MessageInput from "../components/MessageInput";
import { BarChart3, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

// Wrapper component for chat functionality
const ChatPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/signin");
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
      <ChatInterface />
    </ChatProvider>
  );
};

// Inner component that uses chat context
const ChatInterface = () => {
  const { messages, loading, sendMessage } = useChat();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border z-10 py-3 px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span className="font-semibold text-lg">StockCoach.ai</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {user && (
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground hidden md:block">
                {user.name || user.email}
              </div>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
            </div>
          )}
        </div>
      </header>
      
      {/* Chat Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto pb-20"
        style={{ overscrollBehavior: "none" }}
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-4 md:p-8">
            <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-center mb-2">Welcome to StockCoach.ai</h2>
            <p className="text-center text-muted-foreground max-w-md">
              Your AI-powered trading assistant. Ask any question about trading strategies, market analysis, or investment advice.
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            {messages.map((message, index) => (
              <ChatMessage 
                key={message.id} 
                message={message}
                isLatest={index === messages.length - 1}
              />
            ))}
            {loading && (
              <div className="p-4 max-w-3xl mx-auto">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      StockCoach AI
                    </div>
                    <div className="mt-1 text-muted-foreground">
                      <div className="flex gap-1">
                        <div className="h-2 w-2 bg-primary/60 rounded-full animate-pulse"></div>
                        <div className="h-2 w-2 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                        <div className="h-2 w-2 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Message Input (Fixed at bottom) */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-background p-3 md:p-4">
        <MessageInput onSendMessage={sendMessage} disabled={loading} />
      </div>
    </div>
  );
};

export default ChatPage;
