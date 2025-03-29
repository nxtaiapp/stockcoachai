
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { PersonalInfoSection } from "./waitlist/PersonalInfoSection";
import { TradingExperienceSection } from "./waitlist/TradingExperienceSection";
import { SubmitButton } from "./waitlist/SubmitButton";
import { waitlistFormSchema, WaitlistFormValues } from "@/schemas/waitlistFormSchema";
import { submitForm } from "@/utils/formSubmission";

export function WaitlistForm({
  onClose
}: {
  onClose?: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<WaitlistFormValues>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: {
      name: "",
      email: "",
      emailUpdates: false,
      markets: "",
      challenges: "",
      insights: ""
    }
  });

  async function onSubmit(values: WaitlistFormValues) {
    console.log(values);
    
    // Set loading state
    setIsSubmitting(true);
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    
    try {
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = 'Submitting...';
      }
      
      await submitForm({
        url: 'https://nxtaisolutions.app.n8n.cloud/webhook/92ab66bc-0d1e-4d7f-a7c3-e157319891c5',
        data: values,
        onSuccess: onClose
      });
    } finally {
      setIsSubmitting(false);
      
      // Reset button state
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Submit';
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto px-1">
        <PersonalInfoSection />
        <TradingExperienceSection />
        <SubmitButton />
      </form>
    </Form>
  );
}
