import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Importar todas las entidades
import * as profilesSchema from "./schema/public/profiles";

// Crear la conexión a PostgreSQL
const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Crear el cliente de postgres
const client = postgres(connectionString);

// Combinar todos los esquemas
const schema = {
  ...profilesSchema,
};

// Crear la instancia de drizzle con el esquema
export const db = drizzle(client, { schema });

// Exportar todas las entidades para uso en queries
export * from "./schema/public/profiles";
