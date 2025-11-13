"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useChat, type Conversation } from "@/hooks/use-chat";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, MessageCircle, Plus, Settings } from "lucide-react";
import type { PropsWithChildren } from "react";

export const ChatConvSidebar = ({ children }: PropsWithChildren) => {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const router = useRouter();
  const { signOut, profile, user } = useAuth();
  const { conversations, selectConversation, currentConversation } = useChat();

  const handleLogout = async () => {
    await signOut();
    router.push(`/${locale}/login`);
  };

  const handleNewChat = () => {
    router.push(`/${locale}/chat?reset=${Date.now()}`);
  };

  const handleSelectConversation = async (conversation: Conversation) => {
    await selectConversation(conversation);
    router.push(`/${locale}/chat`);
  };

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex flex-col gap-2">
            <div className="flex justify-end px-2 py-1 group-data-[collapsible=icon]:justify-center">
              <SidebarTrigger />
            </div>
            <div className="flex items-center gap-2 px-2 py-1 group-data-[collapsible=icon]:hidden">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {profile?.full_name || t("user")}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {profile?.email || user?.email}
                </p>
              </div>
            </div>
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

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t("settings")}>
                <Link href={`/${locale}/settings`}>
                  <Settings className="h-4 w-4" />
                  <span>{t("settings")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} tooltip={t("signOut")}>
                <LogOut className="h-4 w-4" />
                <span>{t("signOut")}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="overflow-hidden">
        <div className="h-screen overflow-hidden">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ChatConvSidebar;
