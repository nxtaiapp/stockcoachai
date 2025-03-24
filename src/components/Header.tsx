
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  LogOut, 
  Menu, 
  X,
  BarChart3,
  User
} from "lucide-react";

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Don't show the header on the landing page or during auth
  if (["/", "/signin", "/signup"].includes(location.pathname)) {
    return null;
  }

  return (
    <header className="w-full py-4 px-6 border-b border-border bg-background/80 backdrop-blur-md fixed top-0 z-10 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link to="/chat" className="flex items-center gap-2" onClick={closeMenu}>
            <BarChart3 className="w-6 h-6 text-primary" />
            <span className="font-semibold text-xl hidden sm:inline-block">StockCoach.ai</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {user && (
            <>
              <Button variant="ghost" onClick={() => navigate("/chat")}>Chat</Button>
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
            </>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="text-foreground p-2">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 border-b border-border bg-background animate-slide-in">
          <div className="flex flex-col p-4 gap-4">
            {user ? (
              <>
                <div className="py-2 px-4 rounded-md bg-secondary/50">
                  <p className="text-sm text-muted-foreground">Signed in as</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <Button variant="ghost" className="justify-start" onClick={() => { navigate("/chat"); closeMenu(); }}>
                  Chat
                </Button>
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
            ) : (
              <>
                <Button 
                  variant="default" 
                  className="w-full" 
                  onClick={() => { navigate("/signin"); closeMenu(); }}
                >
                  Sign In
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => { navigate("/signup"); closeMenu(); }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
