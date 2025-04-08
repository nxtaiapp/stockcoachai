
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User, Edit, Lock, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import components
import { ProfileNavigation } from "@/components/profile/ProfileNavigation";
import { ProfileDisplay } from "@/components/profile/ProfileDisplay";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { PasswordChangeForm } from "@/components/profile/PasswordChangeForm";

const Profile = () => {
  const { user, setUserData } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    navigate("/signin");
    return null;
  }

  const handleSubmit = (formData: any) => {
    setUserData(formData);
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="container max-w-4xl py-20 px-4 md:px-6">
      <div className="mb-8">
        <ProfileNavigation />
      </div>

      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList>
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Personal Info
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Manage your account details</CardDescription>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <ProfileForm user={user} onSubmit={handleSubmit} />
              ) : (
                <ProfileDisplay user={user} />
              )}
            </CardContent>
            <CardFooter className="border-t px-6 py-4 bg-muted/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span>Your data is stored securely</span>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your account password</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <PasswordChangeForm />
            </CardContent>
            <CardFooter className="border-t px-6 py-4 bg-muted/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>We recommend using a password manager for security</span>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
