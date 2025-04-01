
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";

const tradingStyles = [
  {
    id: "day-trading",
    title: "Day Trading",
    description: "Make multiple trades within the same day"
  },
  {
    id: "swing-trading",
    title: "Swing Trading",
    description: "Hold positions for several days to weeks"
  },
  {
    id: "long-term",
    title: "Long-Term Investing",
    description: "Build wealth through long-term positions"
  },
  {
    id: "options",
    title: "Options Trading",
    description: "Trade options contracts for leverage"
  }
];

interface TradingStyleOptionsProps {
  selectedStyle: string;
}

export const TradingStyleOptions = ({ selectedStyle }: TradingStyleOptionsProps) => {
  return (
    <>
      {tradingStyles.map((style) => (
        <div key={style.id} className={`
          flex items-start space-x-2 border rounded-lg p-3 transition-all
          ${selectedStyle === style.id ? 'border-primary bg-primary/5' : 'border-border'}
        `}>
          <RadioGroupItem value={style.id} id={`style-${style.id}`} className="mt-1" />
          <Label htmlFor={`style-${style.id}`} className="flex-1 cursor-pointer">
            <div className="font-medium">{style.title}</div>
            <div className="text-sm text-muted-foreground">{style.description}</div>
          </Label>
        </div>
      ))}
    </>
  );
};
