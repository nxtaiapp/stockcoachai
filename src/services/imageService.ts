
/**
 * Utility functions for handling images
 */

// Function to convert an image file to a data URL
export async function uploadImageAndGetUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error("Failed to read image file"));
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Error reading image file"));
    };
    
    reader.readAsDataURL(file);
  });
}
