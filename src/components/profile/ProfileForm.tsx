
import { useState } from "react";
import { UserProfile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User, Mail } from "lucide-react";

interface ProfileFormProps {
  user: UserProfile;
  onSubmit: (formData: Partial<UserProfile>) => void;
}

export const ProfileForm = ({ user, onSubmit }: ProfileFormProps) => {
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    experience_level: user?.experience_level || "beginner",
    trading_style: user?.trading_style || "income",
    skill_level: user?.skill_level || "beginner"
  });

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
    
    onSubmit({
      name,
      first_name: formData.first_name,
      last_name: formData.last_name,
      experience_level: formData.experience_level,
      trading_style: formData.trading_style,
      skill_level: formData.skill_level
    });
  };

  return (
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
  );
};
