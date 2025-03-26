
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { BarChart3, Menu, User, LogOut, Settings } from "lucide-react";

interface ChatHeaderProps {
  toggleSettings: () => void;
  showSettings: boolean;
}

const ChatHeader = ({ toggleSettings, showSettings }: ChatHeaderProps) => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
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
          {isAdmin && (
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
          )}
          
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
    </>
  );
};

export default ChatHeader;
