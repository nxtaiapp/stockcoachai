
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface SignUpFormFooterProps {
  isLoading: boolean;
}

export const SignUpFormFooter = ({ isLoading }: SignUpFormFooterProps) => {
  return (
    <>
      <Button 
        type="submit" 
        className="w-full flex items-center gap-2" 
        disabled={isLoading}
      >
        Create Account
        {isLoading ? (
          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <ArrowRight className="h-4 w-4" />
        )}
      </Button>
      
      <p className="text-xs text-center text-muted-foreground">
        By creating an account, you agree to our{" "}
        <Link to="/" className="text-primary hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link to="/" className="text-primary hover:underline">
          Privacy Policy
        </Link>
      </p>
    </>
  );
};
