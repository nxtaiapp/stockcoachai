
import React from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, PieChart, Star, BookOpen, Settings } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import QuickAction from "./QuickAction";

const QuickActionsPanel = () => {
  const navigate = useNavigate();
  
  const quickActions = [
    {
      icon: <LineChart className="h-4 w-4" />,
      label: "Market Analysis",
      comingSoon: true
    }, 
    {
      icon: <PieChart className="h-4 w-4" />,
      label: "Portfolio Overview",
      comingSoon: true
    }, 
    {
      icon: <Star className="h-4 w-4" />,
      label: "Saved Strategies",
      comingSoon: true
    }, 
    {
      icon: <BookOpen className="h-4 w-4" />,
      label: "Learning Resources",
      comingSoon: true
    }, 
    {
      icon: <Settings className="h-4 w-4" />,
      label: "Settings",
      comingSoon: false,
      onClick: () => navigate("/profile")
    }
  ];

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {quickActions.map((action, index) => (
          <QuickAction
            key={index}
            icon={action.icon}
            label={action.label}
            comingSoon={action.comingSoon}
            onClick={action.onClick}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default QuickActionsPanel;
