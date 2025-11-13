"use client";

import ChatPanel from "@/components/chat/chat-panel";
import ChatConvSidebar from "@/components/chat/chat-conv-sidebar";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const ChatPageWithParams = () => {
  const searchParams = useSearchParams();
  const resetKey = searchParams.get("reset") ?? "default";

  return (
    <ChatConvSidebar>
      <ChatPanel key={resetKey} />
    </ChatConvSidebar>
  );
};

const ChatPage = () => (
  <Suspense fallback={null}>
    <ChatPageWithParams />
  </Suspense>
);

export default ChatPage;
