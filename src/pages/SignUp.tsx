
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignUpForm } from "@/components/auth/SignUpForm";

const SignUp = () => {
  return (
    <AuthLayout 
      title="Create your account" 
      description="Start your 14-day free trial. No credit card required."
      footerText="Already have an account?"
      footerLink={{
        text: "Sign in",
        href: "/signin"
      }}
    >
      <SignUpForm />
    </AuthLayout>
  );
};

export default SignUp;
