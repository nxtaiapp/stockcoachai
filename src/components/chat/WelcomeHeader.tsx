
import React from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../context/AuthContext";

interface WelcomeHeaderProps {
  title: string;
}

const WelcomeHeader = ({ title }: WelcomeHeaderProps) => {
  const { signOut, user } = useAuth();
  
  return (
    <div className="flex justify-end w-full">
      {user && (
        <Button 
          variant="outline" 
          className="flex items-center gap-2" 
          onClick={signOut}
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
