
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const StatsPanel = () => {
  return (
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
  );
};

export default StatsPanel;
