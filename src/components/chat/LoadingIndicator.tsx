
import { BarChart3 } from "lucide-react";

const LoadingIndicator = () => (
  <div className="p-4 max-w-3xl mx-auto">
    <div className="flex gap-3">
      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
        <BarChart3 className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium">
          StockCoach AI
        </div>
        <div className="mt-1 text-muted-foreground">
          <div className="flex gap-1">
            <div className="h-2 w-2 bg-primary/60 rounded-full animate-pulse"></div>
            <div className="h-2 w-2 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
            <div className="h-2 w-2 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default LoadingIndicator;
