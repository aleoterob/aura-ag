import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

// Tabla de perfiles de usuarios (sincronizada con auth.users de Supabase)
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  full_name: text("full_name"),
  email: text("email"),
  bio: text("bio"),
  avatar_url: text("avatar_url"),
  role: text("role").default("user"),
  status: text("status").default("active"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Tipos TypeScript para la tabla
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
