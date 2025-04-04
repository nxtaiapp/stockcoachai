
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, ArrowLeft } from "lucide-react";

const ComingSoon = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pageName = new URLSearchParams(location.search).get("page") || "This page";

  // Set page title based on the page parameter
  useEffect(() => {
    document.title = `${pageName} - Coming Soon | StockCoach.ai`;
    return () => {
      document.title = "StockCoach.ai";
    };
  }, [pageName]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex justify-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <ClipboardCheck className="h-10 w-10 text-primary" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">{pageName} is Coming Soon</h1>
        
        <p className="text-xl text-muted-foreground mb-8">
          We're working hard to bring you this feature. Please check back later!
        </p>
        
        <div className="flex justify-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)} 
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Go Back
          </Button>
          
          <Button 
            onClick={() => navigate("/")} 
            className="gap-2"
          >
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
