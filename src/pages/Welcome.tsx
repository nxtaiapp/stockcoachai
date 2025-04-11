
import React from "react";
import { ChatProvider } from "@/context/ChatContext";
import DashboardHeader from "../components/welcome/DashboardHeader";
import CoachingCard from "../components/welcome/CoachingCard";
import RecentActivityPanel from "../components/welcome/RecentActivityPanel";
import QuickActionsPanel from "../components/welcome/QuickActionsPanel";
import StatsPanel from "../components/welcome/StatsPanel";

const WelcomeContent = () => {
  return (
    <div className="min-h-screen bg-background pb-10">
      <DashboardHeader />
      
      <div className="container mx-auto px-4 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CoachingCard />
            <RecentActivityPanel />
          </div>
          
          <div className="space-y-6">
            <QuickActionsPanel />
            <StatsPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

const WelcomePage = () => {
  return (
    <ChatProvider>
      <WelcomeContent />
    </ChatProvider>
  );
};

export default WelcomePage;
