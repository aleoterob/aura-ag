import { eq, desc, count } from "drizzle-orm";
import { db } from "./index";
import {
  profiles,
  type Profile,
  type NewProfile,
} from "./schema/public/profiles";

// ===== PERFILES =====
export async function getAllProfiles(): Promise<Profile[]> {
  return await db.select().from(profiles).orderBy(desc(profiles.created_at));
}

export async function getProfileById(id: string): Promise<Profile | null> {
  const result = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, id))
    .limit(1);
  return result[0] || null;
}

export async function getProfileByEmail(
  email: string
): Promise<Profile | null> {
  const result = await db
    .select()
    .from(profiles)
    .where(eq(profiles.email, email))
    .limit(1);
  return result[0] || null;
}

export async function createProfile(profileData: NewProfile): Promise<Profile> {
  const result = await db.insert(profiles).values(profileData).returning();
  return result[0];
}

export async function updateProfile(
  id: string,
  profileData: Partial<NewProfile>
): Promise<Profile | null> {
  const result = await db
    .update(profiles)
    .set({ ...profileData, updated_at: new Date() })
    .where(eq(profiles.id, id))
    .returning();
  return result[0] || null;
}

export async function deleteProfile(id: string): Promise<boolean> {
  const result = await db
    .delete(profiles)
    .where(eq(profiles.id, id))
    .returning();
  return result.length > 0;
}

// ===== ESTADÍSTICAS =====
export async function getProfileStats() {
  const totalProfiles = await db.select({ count: count() }).from(profiles);
  const activeProfiles = await db
    .select({ count: count() })
    .from(profiles)
    .where(eq(profiles.status, "active"));

  return {
    total: totalProfiles[0].count,
    active: activeProfiles[0].count,
  };
}
