
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ChatProvider, useChat } from "../context/ChatContext";
import ChatMessage from "../components/ChatMessage";
import MessageInput from "../components/MessageInput";
import Header from "../components/Header";
import { BarChart3 } from "lucide-react";

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
    <div className="flex flex-col h-screen bg-secondary/30">
      <Header />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden mt-16">
        {/* Chat area */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto py-6 px-4"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center">
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
                <div className="message-container ai-message">
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
        
        {/* Input area */}
        <div className="border-t border-border p-4">
          <MessageInput onSendMessage={sendMessage} disabled={loading} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
