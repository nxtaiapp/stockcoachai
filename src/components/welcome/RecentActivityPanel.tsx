
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const RecentActivityPanel = () => {
  return (
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
  );
};

export default RecentActivityPanel;
