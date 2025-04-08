
import { format, parseISO } from "date-fns";
import { Calendar } from "lucide-react";
import { useChat } from "../../context/ChatContext";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

const ChatSidebar = () => {
  const {
    chatDates,
    selectDate,
    selectedDate,
    userTimezone
  } = useChat();

  // Format date string considering user's timezone
  const formatChatDate = (dateString: string) => {
    try {
      // Parse the ISO date string
      const date = parseISO(dateString);

      // Format the date for display
      return format(date, "MMM d, yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString; // Return original string if parsing fails
    }
  };
  
  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-6">
        <h2 className="text-lg font-semibold">Trading Coach</h2>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Session History</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chatDates.length === 0 ? (
                <div className="text-sm text-muted-foreground px-4 py-2">
                  No chat history yet
                </div>
              ) : (
                chatDates.map(date => (
                  <SidebarMenuItem key={date}>
                    <SidebarMenuButton 
                      isActive={date === selectedDate} 
                      onClick={() => selectDate(date)}
                    >
                      <Calendar className="h-4 w-4" />
                      <span>
                        {formatChatDate(date)}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default ChatSidebar;
