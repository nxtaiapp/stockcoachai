
import { useState, KeyboardEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, X, Check } from "lucide-react";
import AudioRecorder from "./AudioRecorder";
import ImageUploader from "./ImageUploader";
import ImagePreview from "./ImagePreview";
import { Textarea } from "@/components/ui/textarea";

interface MessageInputProps {
  onSendMessage: (message: string, imageFile?: File) => void;
  disabled?: boolean;
}

const MessageInput = ({ onSendMessage, disabled = false }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isReviewingTranscription, setIsReviewingTranscription] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if ((message.trim() || imageFile) && !disabled) {
      onSendMessage(message, imageFile || undefined);
      setMessage("");
      setImageFile(null);
      setImagePreview(null);
      setIsReviewingTranscription(false);
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
    // Set the transcribed text for review
    setTranscribedText(text);
    setIsReviewingTranscription(true);
    
    // Focus the textarea to allow editing
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 100);
  };

  const handleApproveTranscription = () => {
    setMessage(transcribedText);
    setIsReviewingTranscription(false);
    
    // Focus the input after approval
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleCancelTranscription = () => {
    setTranscribedText("");
    setIsReviewingTranscription(false);
  };

  return (
    <div className="flex flex-col gap-2 max-w-3xl mx-auto">
      {imagePreview && (
        <ImagePreview imageUrl={imagePreview} onRemove={handleRemoveImage} />
      )}
      
      {isReviewingTranscription ? (
        <div className="flex flex-col gap-2 border border-primary/20 rounded-lg p-3 bg-primary/5">
          <p className="text-sm font-medium text-primary">Review your transcription:</p>
          <Textarea
            ref={textareaRef}
            value={transcribedText}
            onChange={(e) => setTranscribedText(e.target.value)}
            placeholder="Edit your transcription..."
            className="min-h-[100px] text-base border-muted"
            autoFocus
          />
          <div className="flex gap-2 justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCancelTranscription}
              className="gap-1"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={handleApproveTranscription}
              className="gap-1"
            >
              <Check className="h-4 w-4" />
              Approve
            </Button>
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default MessageInput;
