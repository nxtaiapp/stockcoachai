
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { toast } from "sonner";
import { useChat } from "@/context/ChatContext";

interface AudioRecorderProps {
  onTranscriptionComplete: (text: string) => void;
  disabled?: boolean;
}

const AudioRecorder = ({ onTranscriptionComplete, disabled = false }: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const { transcriptionWebhookUrl } = useChat();

  // Clean up media recorder on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
      }
    };
  }, [mediaRecorder]);

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
          
          // Create a FormData object for multipart/form-data submission
          const formData = new FormData();
          formData.append('file', audioBlob, 'recording.webm');
          
          // Use the configured transcription webhook URL or fall back to the default
          const webhookUrl = transcriptionWebhookUrl || "https://n8n-hyib.onrender.com/webhook/06598a09-d8be-4e1b-8916-d5123a6cac6d";
          
          // Send to the transcription webhook
          const response = await fetch(webhookUrl, {
            method: 'POST',
            body: formData,
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
            // Set the transcribed text in the input field instead of sending as a message
            onTranscriptionComplete(transcriptionResult.text);
            toast.success("Transcription complete!");
          } else if (transcriptionResult.error) {
            toast.error(`Transcription error: ${transcriptionResult.error}`);
          } else {
            toast.error("Failed to transcribe. Please try again.");
          }
          
        } catch (error) {
          console.error("Error processing audio:", error);
          toast.error("Failed to process audio. Please try again.");
        } finally {
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
  );
};

export default AudioRecorder;
