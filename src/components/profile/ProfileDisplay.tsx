
import { UserProfile } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface ProfileDisplayProps {
  user: UserProfile;
}

export const ProfileDisplay = ({ user }: ProfileDisplayProps) => {
  // Fetch the message count for the current user
  const { data: messageCount = 0, isLoading } = useQuery({
    queryKey: ['messageCount', user.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_ai', false); // Only count messages sent by the user, not AI responses
      
      if (error) {
        console.error('Error fetching message count:', error);
        return 0;
      }
      
      return count || 0;
    }
  });

  // All users are allocated 100 messages
  const allocatedMessages = 100;

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
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Monthly Messages</p>
          <p className="text-base font-medium">
            {isLoading ? (
              <span className="text-muted-foreground">Loading...</span>
            ) : (
              <span>
                <span className={messageCount > allocatedMessages * 0.8 ? "text-amber-500 font-semibold" : ""}>
                  {messageCount}
                </span>
                /{allocatedMessages}
              </span>
            )}
          </p>
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
