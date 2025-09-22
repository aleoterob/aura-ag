import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { profiles } from "./profiles";

// Tabla de conversaciones
export const conversations = pgTable("conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  title: text("title").notNull().default("Nueva conversación"),
  model: text("model").notNull().default("openai/gpt-4o"),
  system_prompt: text("system_prompt"),
  web_search_enabled: boolean("web_search_enabled").default(false),
  is_archived: boolean("is_archived").default(false),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Tipos TypeScript para la tabla
export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;
