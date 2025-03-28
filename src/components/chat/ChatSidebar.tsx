
import { format } from "date-fns";
import { Calendar } from "lucide-react";
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

const ChatSidebar = () => {
  const { chatDates, selectDate, selectedDate } = useChat();

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-6">
        {/* Removed StockCoach.ai title and icon */}
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
                        {format(new Date(date), "MMM d, yyyy")}
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
