"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "./use-auth";
import type { Conversation } from "@/lib/db/schema/public/conversations";
import type { Message, MessageRole } from "@/lib/db/schema/public/messages";

export type { Conversation, Message, MessageRole };

export function useChat() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const conversationCreatedEventName = "chat-conversation-created";

  // Cargar conversaciones del usuario y configurar suscripción en tiempo real
  useEffect(() => {
    if (user) {
      loadConversations();

      // Suscribirse a cambios en tiempo real de la tabla conversations
      const channel = supabase
        .channel("conversations-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "conversations",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log("Conversation change:", payload);
            // Recargar conversaciones cuando hay cambios
            loadConversations();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setConversations([]);
      setCurrentConversation(null);
      setMessages([]);
    }
  }, [user]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleConversationCreated = (event: Event) => {
      const customEvent = event as CustomEvent<Conversation>;
      const conversation = customEvent.detail;

      if (!conversation || conversation.user_id !== user?.id) {
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
  }, [user?.id]);

  const loadConversations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("user_id", user.id)
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
  };

  const loadMessages = async (conversationId: string) => {
    try {
      setLoading(true);
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
  };

  const createConversation = async (title?: string, model?: string) => {
    if (!user) throw new Error("User not authenticated");

    try {
      const { data, error } = await supabase
        .from("conversations")
        .insert({
          user_id: user.id,
          title: title || "Nueva conversación",
          model: model || "openai/gpt-4o",
        })
        .select()
        .single();

      if (error) throw error;

      // Actualizar la lista de conversaciones
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
  };

  const updateConversation = async (
    conversationId: string,
    updates: Partial<
      Omit<Conversation, "id" | "user_id" | "created_at" | "updated_at">
    >
  ) => {
    try {
      const { data, error } = await supabase
        .from("conversations")
        .update(updates)
        .eq("id", conversationId)
        .eq("user_id", user?.id)
        .select()
        .single();

      if (error) throw error;

      // Actualizar el estado local
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
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from("conversations")
        .delete()
        .eq("id", conversationId)
        .eq("user_id", user?.id);

      if (error) throw error;

      // Actualizar el estado local
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
  };

  const addMessage = async (
    conversationId: string,
    role: MessageRole,
    content: string,
    metadata?: Record<string, unknown>,
    modelUsed?: string,
    tokensUsed?: number
  ) => {
    try {
      // Verificar si el mensaje ya existe (evitar duplicados)
      const { data: existingMessage } = await supabase
        .from("messages")
        .select("id")
        .eq("conversation_id", conversationId)
        .eq("role", role)
        .eq("content", content)
        .limit(1)
        .single();

      if (existingMessage) {
        return existingMessage; // Mensaje ya existe, no crear duplicado
      }

      // Obtener el siguiente número de secuencia
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

      // Actualizar mensajes si es la conversación actual
      if (currentConversation?.id === conversationId) {
        setMessages((prev) => [...prev, data]);
      }

      // Actualizar la fecha de la conversación
      await supabase
        .from("conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", conversationId)
        .eq("user_id", user?.id);

      return data;
    } catch (error) {
      console.error("Error adding message:", error);
      throw error;
    }
  };

  const selectConversation = async (conversation: Conversation) => {
    setCurrentConversation(conversation);
    await loadMessages(conversation.id);
  };

  const archiveConversation = async (conversationId: string) => {
    await updateConversation(conversationId, { is_archived: true });
  };

  return {
    conversations,
    currentConversation,
    messages,
    loading,
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
