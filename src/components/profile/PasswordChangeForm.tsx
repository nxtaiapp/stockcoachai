
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changeUserPassword } from "@/services/authService";
import { toast } from "sonner";

export function PasswordChangeForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate that passwords match
    if (newPassword !== confirmPassword) {
      setError("New passwords don't match");
      return;
    }
    
    // Validate password length
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await changeUserPassword(currentPassword, newPassword);
      
      // Clear the form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      toast.success("Password updated successfully");
    } catch (error) {
      console.error("Error changing password:", error);
      setError(
        error instanceof Error 
          ? error.message 
          : "Failed to update password. Please try again."
      );
      toast.error("Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="current-password">Current Password</Label>
        <Input
          id="current-password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="new-password">New Password</Label>
        <Input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm New Password</Label>
        <Input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
      </div>
      
      {error && (
        <div className="text-destructive text-sm font-medium">{error}</div>
      )}
      
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Updating..." : "Update Password"}
      </Button>
    </form>
  );
}
