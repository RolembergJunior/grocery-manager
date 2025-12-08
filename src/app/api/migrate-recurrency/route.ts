import "server-only";
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { COLLECTIONS } from "@/lib/helpers/constants";
import type { Product, RecurrencyConfig } from "@/app/type";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get all products for the user that have old recurrency
    const snapshot = await adminDb
      .collection(COLLECTIONS.PRODUCTS)
      .where("userId", "==", userId)
      .where("isRemoved", "==", 0)
      .get();

    const batch = adminDb.batch();
    let migratedCount = 0;
    let skippedCount = 0;

    snapshot.docs.forEach((doc) => {
      const product = doc.data() as Product;

      // Skip if already has new config or no old recurrency
      if (
        product.reccurencyConfig ||
        !product.reccurency ||
        product.reccurency <= 0
      ) {
        skippedCount++;
        return;
      }

      // Create new config from old recurrency
      const newConfig: RecurrencyConfig = {
        type: "daily",
        interval: product.reccurency,
        startDate: product.updatedAt || new Date().toISOString(),
        endDate: new Date(
          new Date(product.updatedAt || new Date()).getTime() +
            product.reccurency * 24 * 60 * 60 * 1000
        ).toISOString(),
      };

      // Update the product
      const docRef = adminDb.collection(COLLECTIONS.PRODUCTS).doc(product.id);
      batch.update(docRef, {
        reccurencyConfig: newConfig,
        reccurency: null, // Remove old field
      });

      migratedCount++;
    });

    // Commit the batch update
    if (migratedCount > 0) {
      await batch.commit();
    }

    return NextResponse.json({
      success: true,
      migratedCount,
      skippedCount,
      totalProcessed: snapshot.docs.length,
      message: `Successfully migrated ${migratedCount} products. Skipped ${skippedCount} products.`,
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json(
      {
        error: "Failed to migrate products",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
