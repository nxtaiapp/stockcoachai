
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const TermsOfService = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-10 px-4 md:px-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center mb-6">
            <Shield className="h-6 w-6 text-primary mr-2" />
            <h1 className="text-3xl font-bold">Terms of Service</h1>
          </div>
          <p className="text-muted-foreground mb-6">Last updated: March 25, 2025</p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p>Welcome to StockCoach.ai. By using our service, you agree to these Terms of Service.</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">1. Description of Service:</h2>
          <p>StockCoach.ai provides an AI-powered trading assistant designed to offer personalized insights and journaling support to enhance day trading performance.</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">2. Eligibility:</h2>
          <p>You must be at least 18 years old to use our service. If you are a minor in your jurisdiction, you must have parental or guardian consent to use our service.</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">3. User Accounts:</h2>
          <p>You must provide accurate and complete information when creating your account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. We are not liable for any loss or damage arising from your failure to protect your account information.</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">4. Subscription and Payment:</h2>
          <p>After a 14-day free trial, continued access to our premium features requires a monthly subscription. Payments are processed via Stripe. Your subscription will auto-renew each month unless you cancel it through your account settings. There are no refunds for partial months. To cancel, log into your account and follow the cancellation instructions.</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">5. Intellectual Property:</h2>
          <p>All logos, brands, and other intellectual property on our platform belong exclusively to StockCoach.ai. You must not use our logos or brands without our written consent.</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">6. User-Generated Content:</h2>
          <p>You retain ownership of any content you create on our platform, such as trading plans or journal entries. However, by sharing this content, you grant us a non-exclusive, royalty-free license to use, display, and store your content solely for the purpose of providing our services to you. You are responsible for the content you upload and agree not to upload any material that is illegal, harmful, or violates the rights of others.</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">7. Liability disclaimer:</h2>
          <p>StockCoach.ai provides informational and educational services only. We do not provide financial or investment advice. You acknowledge that trading involves significant risk, and you assume sole responsibility for all trading decisions and their outcomes. We are not responsible for any losses or damages resulting from your use of our service.</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">8. Termination:</h2>
          <p>We may terminate or suspend your account if you violate these Terms of Service or engage in any activity that we deem harmful or inappropriate. We reserve the right to refuse or terminate service to anyone at our sole discretion.</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">9. Modifications to Terms:</h2>
          <p>We may modify these Terms of Service at any time. The updated terms will be effective immediately upon posting. Your continued use of our service after any modifications constitutes your acceptance of the new terms.</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">10. Governing Law:</h2>
          <p>These Terms of Service are governed by the laws of the State of California, USA, without regard to its conflict of law provisions.</p>
          
          <p className="mt-8 text-lg">Contact: <a href="mailto:info@nxtai.app" className="text-primary hover:underline">info@nxtai.app</a></p>
        </div>
      </main>
    </div>
  );
};

export default TermsOfService;
