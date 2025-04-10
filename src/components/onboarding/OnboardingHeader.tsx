
import { BarChart3 } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

interface OnboardingHeaderProps {
  children: React.ReactNode;
}

export const OnboardingHeader = ({ children }: OnboardingHeaderProps) => {
  return (
    <>
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">StockCoach.ai</span>
        </div>
      </div>
      
      <Card className="w-full animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Personalize Your Experience</CardTitle>
          <CardDescription>
            Tell us about your trading experience so we can tailor our guidance to your needs
          </CardDescription>
        </CardHeader>
        {children}
      </Card>
    </>
  );
};
