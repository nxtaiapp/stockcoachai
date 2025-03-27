
import { useState, KeyboardEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import AudioRecorder from "./chat/AudioRecorder";
import ImageUploader from "./chat/ImageUploader";
import ImagePreview from "./chat/ImagePreview";

interface MessageInputProps {
  onSendMessage: (message: string, imageFile?: File) => void;
  disabled?: boolean;
}

const MessageInput = ({ onSendMessage, disabled = false }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if ((message.trim() || imageFile) && !disabled) {
      onSendMessage(message, imageFile || undefined);
      setMessage("");
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageSelect = (file: File, previewUrl: string) => {
    setImageFile(file);
    setImagePreview(previewUrl);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleTranscriptionComplete = (text: string) => {
    // Set the transcribed text as the message
    setMessage(text);
    
    // Add the transcription to the chat
    onSendMessage(text);
    
    // Focus the input to allow editing
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col gap-2 max-w-3xl mx-auto">
      {imagePreview && (
        <ImagePreview imageUrl={imagePreview} onRemove={handleRemoveImage} />
      )}
      
      <div className="flex items-end gap-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Alexandra anything about trading..."
            disabled={disabled}
            className="pr-10 py-3 md:py-6 shadow-sm border border-input bg-background rounded-lg"
          />
        </div>
        
        <AudioRecorder 
          onTranscriptionComplete={handleTranscriptionComplete}
          disabled={disabled}
        />
        
        <ImageUploader 
          onImageSelect={handleImageSelect}
          disabled={disabled}
        />
        
        <Button
          onClick={handleSend}
          disabled={(!message.trim() && !imageFile) || disabled}
          size="icon"
          className="h-10 w-10 rounded-full shadow-sm"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
