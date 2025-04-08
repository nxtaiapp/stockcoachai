
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const MessageLimit = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-muted/20">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Message Limit Reached</CardTitle>
          <CardDescription>
            Thank you for trying StockCoach.ai
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4">
            You have exceeded the number of messages allocated for the free trial.
          </p>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-center text-muted-foreground">
              We'll be introducing premium plans soon that will allow for additional messages.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => navigate("/profile")} variant="default">
            Go to Profile
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MessageLimit;
