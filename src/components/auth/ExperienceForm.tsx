
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup } from "@/components/ui/radio-group";
import { TradingStyleOptions } from "./TradingStyleOptions";

interface ExperienceFormProps {
  experience: string;
  tradingStyle: string;
  skillLevel: string;
  setExperience: (value: string) => void;
  setTradingStyle: (value: string) => void;
  setSkillLevel: (value: string) => void;
}

export const ExperienceForm = ({
  experience,
  tradingStyle,
  skillLevel,
  setExperience,
  setTradingStyle,
  setSkillLevel,
}: ExperienceFormProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="experience">Trading Experience</Label>
        <Select 
          value={experience} 
          onValueChange={setExperience}
          required
        >
          <SelectTrigger id="experience">
            <SelectValue placeholder="Select your experience level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
            <SelectItem value="intermediate">Intermediate (1-5 years)</SelectItem>
            <SelectItem value="advanced">Advanced (5+ years)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-4">
        <Label>Trading Style</Label>
        <RadioGroup value={tradingStyle} onValueChange={setTradingStyle}>
          <div className="grid grid-cols-1 gap-3">
            <TradingStyleOptions selectedStyle={tradingStyle} />
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="skillLevel">Trading Skill Level</Label>
        <Select 
          value={skillLevel} 
          onValueChange={setSkillLevel}
          required
        >
          <SelectTrigger id="skillLevel">
            <SelectValue placeholder="Select your skill level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="novice">Novice - Just getting started</SelectItem>
            <SelectItem value="beginner">Beginner - Some basic knowledge</SelectItem>
            <SelectItem value="intermediate">Intermediate - Regular trader with experience</SelectItem>
            <SelectItem value="advanced">Advanced - Experienced and confident</SelectItem>
            <SelectItem value="expert">Expert - Professional level knowledge</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
