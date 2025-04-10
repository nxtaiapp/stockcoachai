
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Loader2 } from "lucide-react";

const EmailConfirmation = () => {
  const { resendVerificationEmail } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState(() => {
    // Try to get the email from localStorage if it exists
    return localStorage.getItem("signupEmail") || "";
  });

  const handleResend = async () => {
    if (!email) {
      toast.error("No email address found. Please try signing up again.");
      return;
    }

    try {
      setIsResending(true);
      await resendVerificationEmail(email);
      toast.success("Verification email resent. Please check your inbox.");
    } catch (error) {
      console.error("Error resending verification email:", error);
      toast.error("Failed to resend verification email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Check Your Email</CardTitle>
          <CardDescription>
            We've sent a verification link to {email ? <span className="font-medium">{email}</span> : "your inbox"}. Please click the link to verify your account and get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-sm text-muted-foreground">
            <p>Didn't receive the email? Check your spam folder or</p>
            <Button 
              variant="link" 
              className="p-0 h-auto font-normal" 
              onClick={handleResend}
              disabled={isResending}
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "resend the verification link"
              )}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already verified? {" "}
            <Link to="/signin" className="text-primary hover:underline">
              Sign in here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmailConfirmation;
