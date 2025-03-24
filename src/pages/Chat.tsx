
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ChatProvider, useChat } from "../context/ChatContext";
import ChatMessage from "../components/ChatMessage";
import MessageInput from "../components/MessageInput";
import WebhookSettings from "../components/WebhookSettings";
import { BarChart3, Menu, User, LogOut, Settings, X } from "lucide-react";
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
  const { user, signOut } = useAuth(); 
  const navigate = useNavigate();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleSettings = () => setShowSettings(!showSettings);
  
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
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span className="font-semibold text-lg">StockCoach.ai</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Make the Settings button more visible with a title */}
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleSettings}
            className="relative flex items-center"
            title="Settings"
          >
            <Settings className="h-5 w-5" />
            {!showSettings && (
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full animate-pulse"></span>
            )}
          </Button>
          
          {user && (
            <div className="flex items-center gap-2">
              <div className="hidden md:flex gap-4">
                <Button variant="ghost" onClick={() => navigate("/profile")}>
                  <User size={16} className="mr-2" />
                  Profile
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2" 
                  onClick={signOut}
                >
                  <LogOut size={16} />
                  Sign Out
                </Button>
              </div>
              <div 
                className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer"
                onClick={() => navigate("/profile")}
              >
                <span className="text-sm font-medium">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
            </div>
          )}
        </div>
      </header>
      
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-[61px] left-0 right-0 border-b border-border bg-background animate-slide-in z-20">
          <div className="flex flex-col p-4 gap-4">
            {user && (
              <>
                <div className="py-2 px-4 rounded-md bg-secondary/50">
                  <p className="text-sm text-muted-foreground">Signed in as</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <Button 
                  variant="ghost" 
                  className="justify-start" 
                  onClick={() => { navigate("/profile"); closeMenu(); }}
                >
                  <User size={16} className="mr-2" />
                  Profile
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 justify-start" 
                  onClick={() => { signOut(); closeMenu(); }}
                >
                  <LogOut size={16} />
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-[61px] right-0 w-full md:w-96 border-b md:border-l border-border bg-background shadow-lg z-20 animate-fade-in">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Settings</h3>
              <Button variant="ghost" size="icon" onClick={toggleSettings}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <WebhookSettings />
          </div>
        </div>
      )}
      
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
