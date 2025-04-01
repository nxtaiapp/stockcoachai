
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  footerText?: string;
  footerLink?: {
    text: string;
    href: string;
  };
}

export const AuthLayout = ({
  children,
  title,
  description,
  footerText,
  footerLink,
}: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-secondary/30">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">StockCoach.ai</span>
          </Link>
        </div>
        
        <Card className="w-full animate-fade-in">
          {children}
        </Card>
      </div>
    </div>
  );
};
