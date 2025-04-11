import React from "react";
import { BarChart3, ArrowRight, LineChart, PieChart, Star, BookOpen, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { getWelcomeMessageContent } from "../services/welcomeMessageService";
import { ChatProvider } from "@/context/ChatContext";
import { useChat } from "@/context/ChatContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Header from "../components/Header";

const WelcomeContent = () => {
  const { user, signOut } = useAuth();
  const { clearMessages, canCreateNewChat } = useChat();
  const navigate = useNavigate();
  
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

  const welcomeMessage = getWelcomeMessageContent(firstName, user?.skill_level, user?.experience_level);
  
  const handleStartChat = async () => {
    if (canCreateNewChat) {
      await clearMessages();
    }
    navigate("/chat");
  };

  const quickActions = [{
    icon: <LineChart className="h-4 w-4" />,
    label: "Market Analysis",
    comingSoon: true
  }, {
    icon: <PieChart className="h-4 w-4" />,
    label: "Portfolio Overview",
    comingSoon: true
  }, {
    icon: <Star className="h-4 w-4" />,
    label: "Saved Strategies",
    comingSoon: true
  }, {
    icon: <BookOpen className="h-4 w-4" />,
    label: "Learning Resources",
    comingSoon: true
  }, {
    icon: <Settings className="h-4 w-4" />,
    label: "Settings",
    comingSoon: false,
    onClick: () => navigate("/profile")
  }];
  
  return <div className="min-h-screen bg-background pb-10">
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
              onClick={signOut}
            >
              <LogOut size={16} />
              Sign Out
            </Button>
          )}
        </div>
      </div>
      
      <div className="container mx-auto px-4 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-md animate-fade-in">
              <CardHeader className="flex flex-col md:flex-row md:items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-xl font-bold">Your Trading Coach</CardTitle>
                  <CardDescription>Alexandra is ready to assist with your trading strategy</CardDescription>
                </div>
                <div className="mt-4 md:mt-0 bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
              </CardHeader>
              
              <Separator />
              
              <CardContent className="pt-6 space-y-6">
                <div className="bg-muted/50 p-6 rounded-lg">
                  <h2 className="text-xl font-medium mb-4">Today's Coaching Message</h2>
                  <p className="text-lg text-muted-foreground">{welcomeMessage}</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">How Alexandra helps you:</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-2">
                    <li>Analyze your trading patterns and decisions</li>
                    <li>Understand market movements and trends</li>
                    <li>Develop and refine your trading strategy</li>
                    <li>Learn from your past trades</li>
                  </ul>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col items-start pt-2">
                <Button onClick={handleStartChat} size="lg" className="w-full sm:w-auto flex items-center gap-2 text-center">
                  {canCreateNewChat ? "Start New Session" : "Continue Current Session"}
                  <ArrowRight className="h-5 w-5" />
                </Button>
                
                {!canCreateNewChat && <p className="text-sm text-muted-foreground mt-2">
                    You already have a session for today.
                  </p>}
              </CardFooter>
            </Card>
            
            <Card className="mt-6 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
                <CardDescription>Your latest trading conversations and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-40 border border-dashed border-muted-foreground/50 rounded-md bg-muted/30">
                  <p className="text-muted-foreground">Coming Soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                {quickActions.map((action, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    className="justify-start h-auto py-3" 
                    disabled={action.comingSoon}
                    onClick={action.onClick}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-md">
                        {action.icon}
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{action.label}</div>
                        {action.comingSoon && <span className="text-xs text-muted-foreground">Coming soon</span>}
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
            
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Trading Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-40 border border-dashed border-muted-foreground/50 rounded-md bg-muted/30">
                  <p className="text-muted-foreground">Coming Soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>;
};

const WelcomePage = () => {
  return <ChatProvider>
      <WelcomeContent />
    </ChatProvider>;
};

export default WelcomePage;
