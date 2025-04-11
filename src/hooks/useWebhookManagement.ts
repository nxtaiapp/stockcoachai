
import { useLocalStorage } from './useLocalStorage';

/**
 * Hook for managing webhook URLs and settings
 */
export const useWebhookManagement = (isAdmin: boolean) => {
  const [n8nWebhookUrl, setN8nWebhookUrl] = useLocalStorage<string>('n8n_webhook_url', '');
  const [transcriptionWebhookUrl, setTranscriptionWebhookUrl] = useLocalStorage<string>('transcription_webhook_url', '');
  
  // Default webhook URL if none is provided
  const defaultWebhookUrl = "https://n8n-hyib.onrender.com/webhook/06598a09-d8be-4e1b-8916-d5123a6cac6d";
  
  // Only allow admins to see/set webhook URLs
  const visibleWebhookUrl = isAdmin ? n8nWebhookUrl : '';
  const visibleTranscriptionUrl = isAdmin ? transcriptionWebhookUrl : '';
  
  const setVisibleWebhookUrl = isAdmin ? setN8nWebhookUrl : () => {};
  const setVisibleTranscriptionUrl = isAdmin ? setTranscriptionWebhookUrl : () => {};
  
  return {
    n8nWebhookUrl,
    transcriptionWebhookUrl,
    visibleWebhookUrl,
    visibleTranscriptionUrl,
    setVisibleWebhookUrl,
    setVisibleTranscriptionUrl,
    defaultWebhookUrl
  };
};
