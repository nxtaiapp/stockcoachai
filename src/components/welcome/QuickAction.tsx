
import React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  comingSoon?: boolean;
  onClick?: () => void;
}

const QuickAction = ({ icon, label, comingSoon = false, onClick }: QuickActionProps) => {
  return (
    <Button 
      variant="outline" 
      className="justify-start h-auto py-3" 
      disabled={comingSoon}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-md">
          {icon}
        </div>
        <div className="text-left">
          <div className="font-medium">{label}</div>
          {comingSoon && <span className="text-xs text-muted-foreground">Coming soon</span>}
        </div>
      </div>
    </Button>
  );
};

export default QuickAction;
