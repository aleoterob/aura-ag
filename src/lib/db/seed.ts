// Seed file for database initialization

export async function seedDatabase() {
  try {
    console.log("🌱 Seeding database...");

    // Nota: Los perfiles se crean automáticamente cuando se registran usuarios en Supabase
    // Este seed es principalmente para datos adicionales si los necesitamos

    console.log("✅ Database seeded successfully!");
    console.log(
      "ℹ️  Profiles are automatically created when users register via Supabase Auth"
    );
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}
