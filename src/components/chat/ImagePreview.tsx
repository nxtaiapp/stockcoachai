
interface ImagePreviewProps {
  imageUrl: string;
  onRemove: () => void;
}

const ImagePreview = ({ imageUrl, onRemove }: ImagePreviewProps) => {
  return (
    <div className="relative w-24 h-24 mx-auto">
      <img 
        src={imageUrl} 
        alt="Preview" 
        className="w-full h-full object-cover rounded-lg border border-border" 
      />
      <button 
        onClick={onRemove}
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
  );
};

export default ImagePreview;
