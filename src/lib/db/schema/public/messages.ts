import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";
import { conversations } from "./conversations";

// Enum para los roles de mensaje
export const messageRoles = ["user", "assistant", "system"] as const;
export type MessageRole = (typeof messageRoles)[number];

// Tabla de mensajes
export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversation_id: uuid("conversation_id")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  role: text("role").notNull().$type<MessageRole>(),
  content: text("content").notNull(),
  // Metadatos adicionales (como archivos adjuntos, fuentes, etc.)
  metadata: jsonb("metadata"),
  // Orden del mensaje en la conversación
  sequence: integer("sequence").notNull(),
  // Información del modelo usado (solo para mensajes del assistant)
  model_used: text("model_used"),
  // Tokens utilizados (útil para billing)
  tokens_used: integer("tokens_used"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Tipos TypeScript para la tabla
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
