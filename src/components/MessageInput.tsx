
import { useState, KeyboardEvent, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Image, Mic, MicOff } from "lucide-react";
import { toast } from "sonner";

interface MessageInputProps {
  onSendMessage: (message: string, imageFile?: File) => void;
  disabled?: boolean;
}

const MessageInput = ({ onSendMessage, disabled = false }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Clean up media recorder on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
      }
    };
  }, [mediaRecorder]);

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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];
      
      recorder.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });
      
      recorder.addEventListener("stop", async () => {
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
        
        if (audioChunks.length === 0) {
          toast.error("No audio recorded. Please try again.");
          setIsRecording(false);
          return;
        }
        
        // Create audio blob and convert to base64
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        
        try {
          setIsTranscribing(true);
          toast.info("Transcribing your message...");
          
          // Convert to base64 for sending to API
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            try {
              const base64Audio = reader.result?.toString().split(',')[1];
              
              // Send to the provided transcription API
              const response = await fetch("https://nxtaisolutions.app.n8n.cloud/webhook-test/c749cf70-e75b-4620-8a95-2e3f69e77f61", {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  audio: base64Audio
                }),
              });
              
              // Wait for the response with a timeout of at least 1 minute
              const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error("Transcription timed out after 65 seconds")), 65000)
              );
              
              let transcriptionResult;
              try {
                transcriptionResult = await Promise.race([
                  response.json(),
                  timeoutPromise
                ]);
              } catch (error) {
                console.error("Error or timeout in transcription:", error);
                toast.error("Transcription timed out. Please try again.");
                setIsTranscribing(false);
                return;
              }
              
              if (transcriptionResult.text) {
                // Set the transcribed text as the message
                setMessage(transcriptionResult.text);
                toast.success("Transcription complete!");
                
                // Add the transcription to the chat
                onSendMessage(transcriptionResult.text);
              } else if (transcriptionResult.error) {
                toast.error(`Transcription error: ${transcriptionResult.error}`);
              } else {
                toast.error("Failed to transcribe. Please try again.");
              }
              
              // Reset recording state
              setIsTranscribing(false);
              
              // Focus the input to allow editing
              if (inputRef.current) {
                inputRef.current.focus();
              }
            } catch (error) {
              console.error("Error processing audio:", error);
              toast.error("Failed to process audio. Please try again.");
              setIsTranscribing(false);
            }
          };
        } catch (error) {
          console.error("Error transcribing audio:", error);
          toast.error("Failed to transcribe audio. Please try again.");
          setIsTranscribing(false);
        }
      });
      
      // Start recording
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      toast.success("Recording started. Click the microphone again to stop.");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Failed to access microphone. Please check your browser permissions and try again.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
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
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Alexandra anything about trading..."
            disabled={disabled || isRecording || isTranscribing}
            className="pr-10 py-3 md:py-6 shadow-sm border border-input bg-background rounded-lg"
          />
        </div>
        
        <Button
          type="button"
          onClick={toggleRecording}
          variant="outline"
          size="icon"
          className={`h-10 w-10 rounded-full shadow-sm ${isRecording ? 'bg-red-500 text-white hover:bg-red-600' : ''} ${isTranscribing ? 'bg-yellow-500 text-white hover:bg-yellow-600 animate-pulse' : ''}`}
          disabled={disabled || isTranscribing}
        >
          {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          <span className="sr-only">{isRecording ? 'Stop recording' : 'Start recording'}</span>
        </Button>
        
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full shadow-sm"
          disabled={disabled || isRecording || isTranscribing}
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
          disabled={disabled || isRecording || isTranscribing}
        />
        
        <Button
          onClick={handleSend}
          disabled={(!message.trim() && !imageFile) || disabled || isRecording || isTranscribing}
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
