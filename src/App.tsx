
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Footer from "./components/Footer";
import GeoRestriction from "./components/GeoRestriction";

// Pages
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import EmailConfirmation from "./pages/EmailConfirmation";
import Onboarding from "./pages/Onboarding";
import TradingPlan from "./pages/TradingPlan";
import Chat from "./pages/Chat";
import Welcome from "./pages/Welcome";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import ComingSoon from "./pages/ComingSoon";
import MessageLimit from "./pages/MessageLimit";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <GeoRestriction>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/email-confirmation" element={<EmailConfirmation />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/trading-plan" element={<TradingPlan />} />
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/coming-soon" element={<ComingSoon />} />
                <Route path="/message-limit" element={<MessageLimit />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
            </BrowserRouter>
          </AuthProvider>
        </GeoRestriction>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
