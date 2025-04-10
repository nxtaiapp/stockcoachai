
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { OnboardingForm } from "@/components/onboarding/OnboardingForm";

const Onboarding = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !user) {
      navigate("/signin");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-secondary/30">
      <div className="w-full max-w-xl">
        <OnboardingHeader>
          <OnboardingForm />
        </OnboardingHeader>
      </div>
    </div>
  );
};

export default Onboarding;
