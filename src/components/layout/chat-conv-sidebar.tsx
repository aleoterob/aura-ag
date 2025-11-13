"use client";

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
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useChat, type Conversation } from "@/hooks/use-chat";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { MessageCircle, Plus } from "lucide-react";

export const ChatConvSidebar = () => {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const router = useRouter();
  const { conversations, selectConversation, currentConversation } = useChat();

  const handleNewChat = () => {
    router.push(`/${locale}/chat?reset=${Date.now()}`);
  };

  const handleSelectConversation = async (conversation: Conversation) => {
    await selectConversation(conversation);
    router.push(`/${locale}/chat`);
  };

  return (
    <Sidebar side="right" collapsible="icon">
      <SidebarHeader>
        <div className="flex justify-start px-2 py-1 group-data-[collapsible=icon]:justify-center">
          <SidebarTrigger />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Chat</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleNewChat}
                  tooltip={t("newChat")}
                >
                  <Plus className="h-4 w-4" />
                  <span>{t("newChat")}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {conversations.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>{t("conversations")}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {conversations.slice(0, 10).map((conversation) => (
                  <SidebarMenuItem key={conversation.id}>
                    <SidebarMenuButton
                      onClick={() =>
                        void handleSelectConversation(conversation)
                      }
                      tooltip={conversation.title}
                      isActive={currentConversation?.id === conversation.id}
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="truncate">{conversation.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
};
