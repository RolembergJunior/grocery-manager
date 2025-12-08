"use server";

import { authenticatedFetch } from "@/lib/api-helper";

interface MigrationResult {
  success: boolean;
  migratedCount: number;
  skippedCount: number;
  totalProcessed: number;
  message: string;
}

export async function migrateRecurrency(): Promise<MigrationResult> {
  try {
    const result = await authenticatedFetch<MigrationResult>(
      "/api/migrate-recurrency",
      {
        method: "POST",
      }
    );

    return result;
  } catch (error) {
    console.error("Migration error:", error);
    return {
      success: false,
      migratedCount: 0,
      skippedCount: 0,
      totalProcessed: 0,
      message: "Migration failed",
    };
  }
}
