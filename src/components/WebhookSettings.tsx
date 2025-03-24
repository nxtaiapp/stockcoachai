
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { toast } from "sonner";

const WebhookSettings = () => {
  const { n8nWebhookUrl, setN8nWebhookUrl } = useChat();
  const [url, setUrl] = useState(n8nWebhookUrl);

  const handleSave = () => {
    setN8nWebhookUrl(url);
    toast.success("n8n webhook URL saved successfully");
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-2">
        <h2 className="text-lg font-semibold">AI Connection Settings</h2>
        <p className="text-sm text-muted-foreground">
          Enter your n8n webhook URL to connect StockCoach.ai to your AI workflow.
        </p>
      </div>
      
      <div className="flex gap-2">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://your-n8n-instance.com/webhook/path"
          className="flex-1"
        />
        <Button onClick={handleSave} className="shrink-0">
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>
      
      <div className="text-xs text-muted-foreground">
        {!url ? (
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
  );
};

export default WebhookSettings;
