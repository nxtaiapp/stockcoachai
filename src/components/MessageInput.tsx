
import { useState, KeyboardEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Image } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string, imageFile?: File) => void;
  disabled?: boolean;
}

const MessageInput = ({ onSendMessage, disabled = false }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        // Reset the file input if the file is not an image
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        alert("Please upload only image files.");
      }
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2 max-w-3xl mx-auto">
      {imagePreview && (
        <div className="relative w-24 h-24 mx-auto">
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="w-full h-full object-cover rounded-lg border border-border" 
          />
          <button 
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 bg-background border border-border rounded-full p-1 text-muted-foreground hover:text-foreground"
            type="button"
          >
            <span className="sr-only">Remove image</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}
      
      <div className="flex items-end gap-2">
        <div className="relative flex-1">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Alexandra anything about trading..."
            disabled={disabled}
            className="pr-10 py-3 md:py-6 shadow-sm border border-input bg-background rounded-lg"
          />
        </div>
        
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full shadow-sm"
          disabled={disabled}
        >
          <Image className="h-5 w-5" />
          <span className="sr-only">Upload image</span>
        </Button>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
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
