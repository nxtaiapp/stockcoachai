
import { Link, useLocation } from "react-router-dom";
import { BarChart3 } from "lucide-react";

const Footer = () => {
  const location = useLocation();
  
  // Don't show footer in the chat interface
  if (location.pathname === "/chat") {
    return null;
  }

  return (
    <footer className="w-full py-8 px-6 border-t border-border bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-6 h-6 text-primary" />
              <span className="font-semibold text-xl">StockCoach.ai</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-4">
              Your AI-powered trading assistant, helping you make smarter investment decisions.
            </p>
          </div>
          
          <div className="col-span-1 flex flex-col">
            <h3 className="font-medium mb-3">Company</h3>
            <Link to="/" className="text-muted-foreground hover:text-foreground mb-2 text-sm">About</Link>
            <Link to="/" className="text-muted-foreground hover:text-foreground mb-2 text-sm">Careers</Link>
            <Link to="/" className="text-muted-foreground hover:text-foreground mb-2 text-sm">Blog</Link>
          </div>
          
          <div className="col-span-1 flex flex-col">
            <h3 className="font-medium mb-3">Resources</h3>
            <Link to="/" className="text-muted-foreground hover:text-foreground mb-2 text-sm">Documentation</Link>
            <Link to="/" className="text-muted-foreground hover:text-foreground mb-2 text-sm">Help Center</Link>
            <Link to="/" className="text-muted-foreground hover:text-foreground mb-2 text-sm">Pricing</Link>
          </div>
          
          <div className="col-span-1 flex flex-col">
            <h3 className="font-medium mb-3">Legal</h3>
            <Link to="/privacy-policy" className="text-muted-foreground hover:text-foreground mb-2 text-sm">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-muted-foreground hover:text-foreground mb-2 text-sm">Terms of Service</Link>
            <Link to="/cookie-policy" className="text-muted-foreground hover:text-foreground mb-2 text-sm">Cookie Policy</Link>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} StockCoach.ai. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Twitter
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              LinkedIn
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
