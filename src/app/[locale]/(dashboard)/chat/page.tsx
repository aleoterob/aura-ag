"use client";

import ChatPanel from "@/components/chat/chat-panel";
import { ChatConvSidebar } from "@/components/layout/chat-conv-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const ChatPageWithParams = () => {
  const searchParams = useSearchParams();
  const resetKey = searchParams.get("reset") ?? "default";

  return (
    <SidebarInset className="overflow-hidden">
      <SidebarProvider>
        <div
          className="fixed top-0 h-screen w-full max-w-3xl overflow-hidden"
          style={{ left: "50%", transform: "translateX(-50%)" }}
        >
          <ChatPanel key={resetKey} />
        </div>
        <ChatConvSidebar />
      </SidebarProvider>
    </SidebarInset>
  );
};

const ChatPage = () => (
  <Suspense fallback={null}>
    <ChatPageWithParams />
  </Suspense>
);

export default ChatPage;
