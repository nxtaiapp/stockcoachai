
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { toast } from "sonner";

const WebhookSettings = () => {
  const { isAdmin, n8nWebhookUrl, setN8nWebhookUrl, transcriptionWebhookUrl, setTranscriptionWebhookUrl } = useChat();
  const [aiUrl, setAiUrl] = useState(n8nWebhookUrl);
  const [transcriptionUrl, setTranscriptionUrl] = useState(transcriptionWebhookUrl);

  const handleSaveAI = () => {
    if (!isAdmin) {
      toast.error("You don't have permission to modify these settings");
      return;
    }
    
    setN8nWebhookUrl(aiUrl);
    toast.success("n8n webhook URL saved successfully");
  };

  const handleSaveTranscription = () => {
    if (!isAdmin) {
      toast.error("You don't have permission to modify these settings");
      return;
    }
    
    setTranscriptionWebhookUrl(transcriptionUrl);
    toast.success("Transcription webhook URL saved successfully");
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-4">
        <h2 className="text-lg font-semibold">AI Connection Settings</h2>
        <p className="text-sm text-muted-foreground">
          Enter your n8n webhook URL to connect StockCoach.ai to your AI workflow.
        </p>
        
        <div className="flex gap-2">
          <Input
            value={aiUrl}
            onChange={(e) => setAiUrl(e.target.value)}
            placeholder="https://n8n-hyib.onrender.com/webhook/06598a09-d8be-4e1b-8916-d5123a6cac6d"
            className="flex-1"
          />
          <Button onClick={handleSaveAI} className="shrink-0">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground">
          {!aiUrl ? (
            <span className="text-yellow-500">
              No webhook URL configured. The chatbot will use mock responses.
            </span>
          ) : (
            <span className="text-green-500">
              AI connected. Your messages will be processed through your n8n workflow.
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col space-y-4 border-t pt-6">
        <h2 className="text-lg font-semibold">Transcription API Settings</h2>
        <p className="text-sm text-muted-foreground">
          Enter your transcription webhook URL to process voice recordings.
        </p>
        
        <div className="flex gap-2">
          <Input
            value={transcriptionUrl}
            onChange={(e) => setTranscriptionUrl(e.target.value)}
            placeholder="https://your-transcription-api.com/webhook/path"
            className="flex-1"
          />
          <Button onClick={handleSaveTranscription} className="shrink-0">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground">
          {!transcriptionUrl ? (
            <span className="text-yellow-500">
              No transcription URL configured. The default transcription service will be used.
            </span>
          ) : (
            <span className="text-green-500">
              Transcription API connected. Your voice recordings will be processed through your webhook.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebhookSettings;
