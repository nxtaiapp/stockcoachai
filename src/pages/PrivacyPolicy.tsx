import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  
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
            <FileText className="h-6 w-6 text-primary mr-2" />
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-muted-foreground mb-6">Last updated: Mar 25, 2025</p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p>StockCoach.ai ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy outlines our practices concerning the collection, use, storage, and sharing of your personal data.</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">1. Information We Collect:</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-medium">Personal Identifiers:</span> Name, email address, and other contact information.
            </li>
            <li>
              <span className="font-medium">Trading Data:</span> Your trading history, including assets traded, trade dates, and performance metrics.
            </li>
            <li>
              <span className="font-medium">Trading Plans:</span> Any plans or strategies you create on our platform.
            </li>
            <li>
              <span className="font-medium">Chat Messages:</span> Messages you send through our platform's chat feature.
            </li>
            <li>
              <span className="font-medium">IP Addresses:</span> To track and analyze usage patterns.
            </li>
            <li>
              <span className="font-medium">Payment Information:</span> We collect payment details through our payment processor, Stripe, for subscription purposes. We do not store your payment information ourselves.
            </li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">2. How We Use Your Information:</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-medium">Provide, improve, and personalize services:</span> We use your personal and trading data to deliver our services, tailor your experience, and improve our platform.
            </li>
            <li>
              <span className="font-medium">Analytics and performance measurement:</span> We analyze usage data to understand how our platform is used and to make improvements.
            </li>
            <li>
              <span className="font-medium">Marketing and promotional communications:</span> We may use your contact information to send you updates, news, and promotional materials about our services, unless you opt-out.
            </li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">3. Data Sharing:</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-medium">Stripe:</span> We share necessary payment information with Stripe for processing your subscription payments.
            </li>
            <li>
              <span className="font-medium">Google:</span> We use Google analytics to track website performance, which may include your IP address and other non-personal data.
            </li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">4. Data Storage & Security:</h2>
          <p>Your data is stored on Supabase servers located in the United States. We employ encryption at rest and in transit, role-based access controls, and perform regular security audits to protect your data.</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">5. Data Retention:</h2>
          <p>We retain your personal data for as long as your account is active and for one year following account closure to handle any potential issues or requests. After that, your data is deleted or anonymized. Aggregated analytics data may be retained longer but will not contain personally identifiable information.</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">6. Your Rights:</h2>
          <p>You have the right to access, modify, or delete your personal data. To exercise these rights, please contact us at info@nxtai.app.</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">7. California Privacy Rights:</h2>
          <p>If you are a California resident, you have specific rights under the California Consumer Protection Act (CCPA), including the right to know what personal information we collect, the right to request deletion of your personal information, and the right to opt-out of certain data sales or sharing (though we do not currently sell or share your data for value).</p>
          
          <p className="mt-8 text-lg">Contact: <a href="mailto:info@nxtai.app" className="text-primary hover:underline">info@nxtai.app</a></p>
        </div>

        <div className="flex justify-center space-x-4 mt-8">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)} 
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Go Back
          </Button>
          
          <Button 
            onClick={() => navigate("/")} 
            className="gap-2"
          >
            Return to Home
          </Button>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
