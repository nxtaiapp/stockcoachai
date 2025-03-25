
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { Cookie, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const CookiePolicy = () => {
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
            <Cookie className="h-6 w-6 text-primary mr-2" />
            <h1 className="text-3xl font-bold">Cookie Policy</h1>
          </div>
          <p className="text-muted-foreground mb-6">Last updated: March 25, 2025</p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p>StockCoach.ai uses cookies and similar technologies to enhance your experience on our website. Here's how we use them:</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">1. Types of Cookies Used:</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-medium">Session Cookies:</span> These are necessary for basic website functionality, such as maintaining your login session. They are deleted when you close your browser.
            </li>
            <li>
              <span className="font-medium">Analytics Cookies:</span> We use Google analytics to track and analyze website performance, which helps us improve our services. These cookies collect data like IP addresses, page views, and other non-personal information.
            </li>
            <li>
              <span className="font-medium">Marketing Cookies:</span> These are first-party cookies used to track your engagement with our services and to provide personalized content and recommendations. We do not use these cookies for third-party advertising purposes.
            </li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">2. Cookie Consent:</h2>
          <p>By using our website, you consent to our cookie policy. You can manage your cookie preferences at any time through your browser settings or via our cookie consent banner on the website.</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">3. No Third-Party Advertising Cookies:</h2>
          <p>We do not use third-party advertising services that place their own cookies on your device for tracking or advertising purposes.</p>
          
          <p className="mt-8 text-lg">Contact: <a href="mailto:info@nxtai.app" className="text-primary hover:underline">info@nxtai.app</a></p>
        </div>
      </main>
    </div>
  );
};

export default CookiePolicy;
