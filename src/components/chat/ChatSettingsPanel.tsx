
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import WebhookSettings from "../WebhookSettings";

interface ChatSettingsPanelProps {
  showSettings: boolean;
  toggleSettings: () => void;
}

const ChatSettingsPanel = ({ showSettings, toggleSettings }: ChatSettingsPanelProps) => {
  if (!showSettings) return null;
  
  return (
    <div className="absolute top-[61px] right-0 w-full md:w-96 border-b md:border-l border-border bg-background shadow-lg z-20 animate-fade-in">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Settings</h3>
          <Button variant="ghost" size="icon" onClick={toggleSettings}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <WebhookSettings />
      </div>
    </div>
  );
};

export default ChatSettingsPanel;
