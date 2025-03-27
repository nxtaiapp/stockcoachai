
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";

interface ImageUploaderProps {
  onImageSelect: (file: File, previewUrl: string) => void;
  disabled?: boolean;
}

const ImageUploader = ({ onImageSelect, disabled = false }: ImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          onImageSelect(file, reader.result as string);
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

  return (
    <>
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
    </>
  );
};

export default ImageUploader;
