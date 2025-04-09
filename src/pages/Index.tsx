import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { BarChart3, ArrowRight, TrendingUp, LineChart, Shield, Zap } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { WaitlistForm } from "@/components/WaitlistForm";
const Index = () => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();

  // If user is already logged in, redirect to chat
  useEffect(() => {
    if (user) {
      navigate("/chat");
    }
  }, [user, navigate]);
  return <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="w-full py-4 px-6 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-primary" />
            <span className="font-semibold text-xl">StockCoach.ai</span>
          </div>
          <div className="flex items-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Join Waitlist</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px] max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>Join Our Waitlist</DialogTitle>
                  <DialogDescription>
                    Thanks for your interest in StockCoach.ai! We're currently in closed beta. Fill out this form to join our waitlist.
                  </DialogDescription>
                </DialogHeader>
                <WaitlistForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight animate-fade-in">
              Your <span className="text-primary">Personal</span> Trading Coach
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 animate-fade-in" style={{
            animationDelay: "0.1s"
          }}>
              Accelerate your growth with AI-powered trade reviews and performance insights — customized just for you.
            </p>
            <div className="flex justify-center animate-fade-in" style={{
            animationDelay: "0.2s"
          }}>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" className="gap-2 text-lg">
                    Join Our Waitlist <ArrowRight className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px] max-h-[90vh]">
                  <DialogHeader>
                    <DialogTitle>Join Our Waitlist</DialogTitle>
                    <DialogDescription>
                      We're currently in closed beta. Fill out this form to join our waitlist and be notified when spots become available.
                    </DialogDescription>
                  </DialogHeader>
                  <WaitlistForm />
                </DialogContent>
              </Dialog>
            </div>
            <p className="text-sm text-muted-foreground mt-4 animate-fade-in" style={{
            animationDelay: "0.3s"
          }}>
              Limited spots available. Join the waitlist today.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-6 bg-secondary/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">How StockCoach.ai Helps You</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="premium-card p-8 rounded-lg animate-slide-up" style={{
              animationDelay: "0.1s"
            }}>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Trade Analysis</h3>
                <p className="text-muted-foreground">
                  Get real-time market insights and analysis to make informed trading decisions based on current trends.
                </p>
              </div>
              <div className="premium-card p-8 rounded-lg animate-slide-up" style={{
              animationDelay: "0.2s"
            }}>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Plan Development</h3>
                <p className="text-muted-foreground">Build and refine your trading strategies with AI-powered recommendations.</p>
              </div>
              <div className="premium-card p-8 rounded-lg animate-slide-up" style={{
              animationDelay: "0.3s"
            }}>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Motivation &amp; Discipline</h3>
                <p className="text-muted-foreground">
                  Learn effective risk management techniques to protect your capital and maximize returns.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        

        {/* CTA */}
        <section className="py-20 px-6 bg-primary/5">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Trading?</h2>
            <p className="text-xl text-muted-foreground mb-10">
              Join thousands of traders who are improving their skills and results with StockCoach.ai
            </p>
            <div className="flex justify-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" className="gap-2 text-lg">
                    Join Our Waitlist <Zap className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px] max-h-[90vh]">
                  <DialogHeader>
                    <DialogTitle>Join Our Waitlist</DialogTitle>
                    <DialogDescription>
                      StockCoach.ai is currently available by invitation only. Fill out this form to join our waitlist.
                    </DialogDescription>
                  </DialogHeader>
                  <WaitlistForm />
                </DialogContent>
              </Dialog>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Limited availability. Priority access for serious traders.
            </p>
          </div>
        </section>
      </main>
    </div>;
};
export default Index;