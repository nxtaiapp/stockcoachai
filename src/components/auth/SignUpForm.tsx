
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { UserInfoForm } from "./UserInfoForm";
import { ExperienceForm } from "./ExperienceForm";
import { SignUpFormFooter } from "./SignUpFormFooter";

export const SignUpForm = () => {
  const { signUp } = useAuth();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("");
  const [tradingStyle, setTradingStyle] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!firstName || !lastName || !email || !password || !experience || !tradingStyle || !skillLevel) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      const fullName = `${firstName} ${lastName}`.trim();
      await signUp(email, password, fullName, experience, tradingStyle, skillLevel);
      // Navigate is handled in the AuthContext after successful sign-up
    } catch (err) {
      setError("An error occurred during registration. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Create your account</CardTitle>
        <CardDescription>
          Start your 14-day free trial. No credit card required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}
          
          <UserInfoForm
            firstName={firstName}
            lastName={lastName}
            email={email}
            password={password}
            setFirstName={setFirstName}
            setLastName={setLastName}
            setEmail={setEmail}
            setPassword={setPassword}
          />
          
          <ExperienceForm
            experience={experience}
            tradingStyle={tradingStyle}
            skillLevel={skillLevel}
            setExperience={setExperience}
            setTradingStyle={setTradingStyle}
            setSkillLevel={setSkillLevel}
          />
          
          <SignUpFormFooter isLoading={isLoading} />
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/signin" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </>
  );
};
