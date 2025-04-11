
import React from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../context/AuthContext";

interface WelcomeHeaderProps {
  title: string;
}

const WelcomeHeader = ({ title }: WelcomeHeaderProps) => {
  const { signOut, user } = useAuth();
  
  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Sign out button clicked");
    await signOut();
  };
  
  return (
    <div className="flex justify-end w-full">
      {user && (
        <Button 
          variant="outline" 
          className="flex items-center gap-2" 
          onClick={handleSignOut}
          size="sm"
        >
          <LogOut size={16} />
          Sign Out
        </Button>
      )}
    </div>
  );
};

export default WelcomeHeader;
