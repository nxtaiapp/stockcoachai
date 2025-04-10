
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { TradingPlanLayout } from "@/components/trading-plan/TradingPlanLayout";
import { TradingPlanForm } from "@/components/trading-plan/TradingPlanForm";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

const TradingPlan = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !user) {
      navigate("/signin");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <TradingPlanLayout>
      <TradingPlanForm />
    </TradingPlanLayout>
  );
};

export default TradingPlan;
