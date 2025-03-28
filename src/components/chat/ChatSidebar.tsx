
import { format, parseISO } from "date-fns";
import { Calendar, PlusCircle } from "lucide-react";
import { useChat } from "../../context/ChatContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ChatSidebar = () => {
  const { chatDates, selectDate, selectedDate, clearMessages, userTimezone, canCreateNewChat } = useChat();

  const handleNewChat = () => {
    clearMessages();
  };

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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button 
                  variant="outline"
                  className="w-full flex items-center justify-start gap-2"
                  onClick={handleNewChat}
                  disabled={!canCreateNewChat}
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>New Chat</span>
                </Button>
              </div>
            </TooltipTrigger>
            {!canCreateNewChat && (
              <TooltipContent>
                <p>You can only create one chat per day</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Chat History</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chatDates.length === 0 ? (
                <div className="text-sm text-muted-foreground px-4 py-2">
                  No chat history yet
                </div>
              ) : (
                chatDates.map((date) => (
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
