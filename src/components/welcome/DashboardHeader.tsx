
import React from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../context/AuthContext";

const DashboardHeader = () => {
  const { user, signOut } = useAuth();
  
  const getUserFirstName = () => {
    if (!user) return "";
    if (user.name && !user.name.includes('-')) {
      return user.name.split(' ')[0];
    }
    if (user.email) {
      return user.email.split('@')[0];
    }
    return "";
  };
  
  const firstName = getUserFirstName();
  
  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Sign out button clicked in DashboardHeader");
    await signOut();
  };
  
  return (
    <div className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {firstName || "Trader"}</p>
        </div>
        {user && (
          <Button 
            variant="outline" 
            className="flex items-center gap-2" 
            onClick={handleSignOut}
          >
            <LogOut size={16} />
            Sign Out
          </Button>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
