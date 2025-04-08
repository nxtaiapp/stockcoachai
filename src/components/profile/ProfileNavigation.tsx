
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
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
          <Link to="/welcome">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
