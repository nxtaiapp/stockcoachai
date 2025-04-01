
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { User, Edit, Mail, Lock, MessageSquare, BarChart3 } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const Profile = () => {
  const { user, setUserData } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    experience_level: user?.experience_level || "beginner",
    trading_style: user?.trading_style || "income",
    skill_level: user?.skill_level || "beginner"
  });

  if (!user) {
    navigate("/signin");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct full name from first and last
    const name = `${formData.first_name} ${formData.last_name}`.trim();
    
    setUserData({
      name,
      first_name: formData.first_name,
      last_name: formData.last_name,
      experience_level: formData.experience_level,
      trading_style: formData.trading_style,
      skill_level: formData.skill_level
    });
    
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="container max-w-4xl py-20 px-4 md:px-6">
      <div className="mb-8">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/chat">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Back to Chat
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  StockCoach.ai
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        value={formData.email}
                        readOnly
                        disabled
                        className="pl-10 bg-muted"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Experience Level</Label>
                  <RadioGroup 
                    value={formData.experience_level} 
                    onValueChange={(value) => handleRadioChange("experience_level", value)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="beginner" id="exp-beginner" />
                      <Label htmlFor="exp-beginner">Beginner</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="intermediate" id="exp-intermediate" />
                      <Label htmlFor="exp-intermediate">Intermediate</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="advanced" id="exp-advanced" />
                      <Label htmlFor="exp-advanced">Advanced</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Trading Style</Label>
                  <RadioGroup 
                    value={formData.trading_style} 
                    onValueChange={(value) => handleRadioChange("trading_style", value)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="income" id="goal-income" />
                      <Label htmlFor="goal-income">Generate Income</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="growth" id="goal-growth" />
                      <Label htmlFor="goal-growth">Long-term Growth</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="trading" id="goal-trading" />
                      <Label htmlFor="goal-trading">Active Trading</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Skill Level</Label>
                  <RadioGroup 
                    value={formData.skill_level} 
                    onValueChange={(value) => handleRadioChange("skill_level", value)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="beginner" id="skill-beginner" />
                      <Label htmlFor="skill-beginner">Beginner</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="intermediate" id="skill-intermediate" />
                      <Label htmlFor="skill-intermediate">Intermediate</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="advanced" id="skill-advanced" />
                      <Label htmlFor="skill-advanced">Advanced</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              
              <Button type="submit" className="w-full">Save Changes</Button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">First Name</p>
                  <p className="text-base font-medium">{user.first_name || (user.name ? user.name.split(' ')[0] : '')}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Last Name</p>
                  <p className="text-base font-medium">{user.last_name || (user.name && user.name.includes(' ') ? user.name.split(' ').slice(1).join(' ') : '')}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-base font-medium">{user.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Experience Level</p>
                  <p className="text-base font-medium capitalize">{user.experience_level || "Not set"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Trading Style</p>
                  <p className="text-base font-medium capitalize">{user.trading_style || "Not set"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Skill Level</p>
                  <p className="text-base font-medium capitalize">{user.skill_level || "Not set"}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t px-6 py-4 bg-muted/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span>Your data is stored securely</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;
