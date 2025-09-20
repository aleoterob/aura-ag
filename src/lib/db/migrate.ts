import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./index";

async function runMigrations() {
  try {
    console.log("🔄 Running migrations...");
    await migrate(db, { migrationsFolder: "./src/lib/db/migrations" });
    console.log("✅ Migrations completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

// Solo ejecutar si este archivo se ejecuta directamente
if (require.main === module) {
  runMigrations();
}

export { runMigrations };
