
import { Link } from "react-router-dom";
import { MessageSquare, BarChart3 } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export const ProfileNavigation = () => {
  return (
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
  );
};
