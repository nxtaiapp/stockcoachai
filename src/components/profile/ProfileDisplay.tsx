
import { UserProfile } from "@/lib/types";

interface ProfileDisplayProps {
  user: UserProfile;
}

export const ProfileDisplay = ({ user }: ProfileDisplayProps) => {
  return (
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
  );
};
