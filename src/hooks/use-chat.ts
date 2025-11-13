"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "./use-auth";
import type { Conversation } from "@/lib/db/schema/public/conversations";
import type { Message, MessageRole } from "@/lib/db/schema/public/messages";

export type { Conversation, Message, MessageRole };

const conversationCreatedEventName = "chat-conversation-created";

type ConversationStore = {
  conversations: Conversation[];
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  currentConversation: Conversation | null;
  setCurrentConversation: React.Dispatch<
    React.SetStateAction<Conversation | null>
  >;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

type UserIdentifier = string | null;

// Exposes the shared state containers for conversations, current conversation, messages, and loading flags.
function useConversationStore(): ConversationStore {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  return {
    conversations,
    setConversations,
    currentConversation,
    setCurrentConversation,
    messages,
    setMessages,
    loading,
    setLoading,
  };
}

// Fetches conversations for the active user and keeps the list refreshed with Supabase.
function useConversationLoader({
  userId,
  setConversations,
  setLoading,
}: {
  userId: UserIdentifier;
  setConversations: ConversationStore["setConversations"];
  setLoading: ConversationStore["setLoading"];
}) {
  return useCallback(async () => {
    if (!userId) {
      setConversations([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("user_id", userId)
        .eq("is_archived", false)
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("Error loading conversations:", error);
      } else {
        setConversations(data || []);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, setConversations, setLoading]);
}

// Initializes real-time Supabase subscriptions and resets state when the user context changes.
function useConversationInitialization({
  userId,
  loadConversations,
  setConversations,
  setCurrentConversation,
  setMessages,
}: {
  userId: UserIdentifier;
  loadConversations: () => Promise<void>;
  setConversations: ConversationStore["setConversations"];
  setCurrentConversation: ConversationStore["setCurrentConversation"];
  setMessages: ConversationStore["setMessages"];
}) {
  useEffect(() => {
    if (!userId) {
      setConversations([]);
      setCurrentConversation(null);
      setMessages([]);
      return;
    }

    loadConversations();

    const channel = supabase
      .channel("conversations-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("Conversation change:", payload);
          loadConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [
    userId,
    loadConversations,
    setConversations,
    setCurrentConversation,
    setMessages,
  ]);
}

// Listens for local browser events to keep the conversation list in sync across components.
function useConversationCreationListener({
  userId,
  setConversations,
}: {
  userId: UserIdentifier;
  setConversations: ConversationStore["setConversations"];
}) {
  useEffect(() => {
    if (!userId || typeof window === "undefined") return;

    const handleConversationCreated = (event: Event) => {
      const customEvent = event as CustomEvent<Conversation>;
      const conversation = customEvent.detail;

      if (!conversation || conversation.user_id !== userId) {
        return;
      }

      setConversations((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.id === conversation.id
        );
        if (existingIndex === 0) {
          return prev;
        }

        if (existingIndex > 0) {
          const updated = [...prev];
          updated.splice(existingIndex, 1);
          return [conversation, ...updated];
        }

        return [conversation, ...prev];
      });
    };

    window.addEventListener(
      conversationCreatedEventName,
      handleConversationCreated as EventListener
    );

    return () => {
      window.removeEventListener(
        conversationCreatedEventName,
        handleConversationCreated as EventListener
      );
    };
  }, [userId, setConversations]);
}

// Provides the CRUD operations and persistence helpers for conversations and messages.
function useConversationActions({
  userId,
  currentConversation,
  setCurrentConversation,
  setConversations,
  setMessages,
  setLoading,
  loadConversations,
}: {
  userId: UserIdentifier;
  currentConversation: Conversation | null;
  setCurrentConversation: ConversationStore["setCurrentConversation"];
  setConversations: ConversationStore["setConversations"];
  setMessages: ConversationStore["setMessages"];
  setLoading: ConversationStore["setLoading"];
  loadConversations: () => Promise<void>;
}) {
  const loadMessages = useCallback(
    async (conversationId: string) => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", conversationId)
          .order("sequence", { ascending: true });

        if (error) {
          console.error("Error loading messages:", error);
        } else {
          setMessages(data || []);
        }
      } catch (error) {
        console.error("Error loading messages:", error);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setMessages]
  );

  const createConversation = useCallback(
    async (title?: string, model?: string) => {
      if (!userId) throw new Error("User not authenticated");

      try {
        const { data, error } = await supabase
          .from("conversations")
          .insert({
            user_id: userId,
            title: title || "Nueva conversación",
            model: model || "openai/gpt-4o",
          })
          .select()
          .single();

        if (error) throw error;

        await loadConversations();
        setCurrentConversation(data);
        setMessages([]);

        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent<Conversation>(conversationCreatedEventName, {
              detail: data,
            })
          );
        }

        return data;
      } catch (error) {
        console.error("Error creating conversation:", error);
        throw error;
      }
    },
    [userId, loadConversations, setCurrentConversation, setMessages]
  );

  const updateConversation = useCallback(
    async (
      conversationId: string,
      updates: Partial<
        Omit<Conversation, "id" | "user_id" | "created_at" | "updated_at">
      >
    ) => {
      if (!userId) throw new Error("User not authenticated");

      try {
        const { data, error } = await supabase
          .from("conversations")
          .update(updates)
          .eq("id", conversationId)
          .eq("user_id", userId)
          .select()
          .single();

        if (error) throw error;

        setConversations((prev) =>
          prev.map((conv) => (conv.id === conversationId ? data : conv))
        );

        if (currentConversation?.id === conversationId) {
          setCurrentConversation(data);
        }

        return data;
      } catch (error) {
        console.error("Error updating conversation:", error);
        throw error;
      }
    },
    [userId, setConversations, currentConversation?.id, setCurrentConversation]
  );

  const deleteConversation = useCallback(
    async (conversationId: string) => {
      if (!userId) throw new Error("User not authenticated");

      try {
        const { error } = await supabase
          .from("conversations")
          .delete()
          .eq("id", conversationId)
          .eq("user_id", userId);

        if (error) throw error;

        setConversations((prev) =>
          prev.filter((conv) => conv.id !== conversationId)
        );

        if (currentConversation?.id === conversationId) {
          setCurrentConversation(null);
          setMessages([]);
        }
      } catch (error) {
        console.error("Error deleting conversation:", error);
        throw error;
      }
    },
    [
      userId,
      setConversations,
      currentConversation?.id,
      setCurrentConversation,
      setMessages,
    ]
  );

  const addMessage = useCallback(
    async (
      conversationId: string,
      role: MessageRole,
      content: string,
      metadata?: Record<string, unknown>,
      modelUsed?: string,
      tokensUsed?: number
    ) => {
      if (!userId) throw new Error("User not authenticated");

      try {
        const { data: existingMessage } = await supabase
          .from("messages")
          .select("id")
          .eq("conversation_id", conversationId)
          .eq("role", role)
          .eq("content", content)
          .limit(1)
          .single();

        if (existingMessage) {
          return existingMessage;
        }

        const { data: lastMessage } = await supabase
          .from("messages")
          .select("sequence")
          .eq("conversation_id", conversationId)
          .order("sequence", { ascending: false })
          .limit(1)
          .single();

        const nextSequence = (lastMessage?.sequence || 0) + 1;

        const { data, error } = await supabase
          .from("messages")
          .insert({
            conversation_id: conversationId,
            role,
            content,
            metadata,
            sequence: nextSequence,
            model_used: modelUsed,
            tokens_used: tokensUsed,
          })
          .select()
          .single();

        if (error) throw error;

        if (currentConversation?.id === conversationId) {
          setMessages((prev) => [...prev, data]);
        }

        await supabase
          .from("conversations")
          .update({ updated_at: new Date().toISOString() })
          .eq("id", conversationId)
          .eq("user_id", userId);

        return data;
      } catch (error) {
        console.error("Error adding message:", error);
        throw error;
      }
    },
    [currentConversation?.id, setMessages, userId]
  );

  const selectConversation = useCallback(
    async (conversation: Conversation) => {
      setCurrentConversation(conversation);
      await loadMessages(conversation.id);
    },
    [setCurrentConversation, loadMessages]
  );

  const archiveConversation = useCallback(
    async (conversationId: string) => {
      await updateConversation(conversationId, { is_archived: true });
    },
    [updateConversation]
  );

  return {
    loadMessages,
    createConversation,
    updateConversation,
    deleteConversation,
    addMessage,
    selectConversation,
    archiveConversation,
  };
}

// Composes all conversation-related hooks and exposes the public chat API.
export function useChat() {
  const { user } = useAuth();
  const store = useConversationStore();
  const userId = user?.id ?? null;

  const loadConversations = useConversationLoader({
    userId,
    setConversations: store.setConversations,
    setLoading: store.setLoading,
  });

  useConversationInitialization({
    userId,
    loadConversations,
    setConversations: store.setConversations,
    setCurrentConversation: store.setCurrentConversation,
    setMessages: store.setMessages,
  });

  useConversationCreationListener({
    userId,
    setConversations: store.setConversations,
  });

  const {
    loadMessages,
    createConversation,
    updateConversation,
    deleteConversation,
    addMessage,
    selectConversation,
    archiveConversation,
  } = useConversationActions({
    userId,
    currentConversation: store.currentConversation,
    setCurrentConversation: store.setCurrentConversation,
    setConversations: store.setConversations,
    setMessages: store.setMessages,
    setLoading: store.setLoading,
    loadConversations,
  });

  return {
    conversations: store.conversations,
    currentConversation: store.currentConversation,
    messages: store.messages,
    loading: store.loading,
    loadConversations,
    loadMessages,
    createConversation,
    updateConversation,
    deleteConversation,
    addMessage,
    selectConversation,
    archiveConversation,
  };
}
