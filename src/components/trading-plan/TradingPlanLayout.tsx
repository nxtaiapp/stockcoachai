
import { BarChart3 } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

interface TradingPlanLayoutProps {
  children: React.ReactNode;
}

export const TradingPlanLayout = ({ children }: TradingPlanLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-secondary/30">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">StockCoach.ai</span>
          </div>
        </div>
        
        <Card className="w-full animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Your Trading Plan</CardTitle>
            <CardDescription>
              Document your trading strategy, rules, and goals to stay disciplined
            </CardDescription>
          </CardHeader>
          {children}
        </Card>
      </div>
    </div>
  );
};
