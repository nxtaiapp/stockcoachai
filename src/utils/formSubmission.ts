
import { toast } from "sonner";

interface SubmissionOptions<T> {
  url: string;
  data: T;
  onSuccess?: () => void;
}

export async function submitForm<T>({ url, data, onSuccess }: SubmissionOptions<T>): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit form');
    }
    
    toast.success("You've been added to our waitlist!", {
      description: "We'll be in touch soon with updates."
    });
    
    if (onSuccess) {
      onSuccess();
    }
    
    return true;
  } catch (error) {
    console.error('Error submitting form:', error);
    toast.error("Couldn't submit your information", {
      description: "Please try again later."
    });
    return false;
  }
}
