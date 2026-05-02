import "server-only";
import { adminDb } from "./firebaseAdmin";

export interface MigrationResult {
  migrated: boolean;
}

export async function ensureMigrated(
  uid: string,
  email: string
): Promise<MigrationResult> {
  const userRef = adminDb.collection("users").doc(uid);
  const userSnap = await userRef.get();

  if (userSnap.exists) {
    return { migrated: false };
  }

  const oldUserQuery = await adminDb
    .collection("users")
    .where("email", "==", email)
    .limit(1)
    .get();

  const oldDoc = oldUserQuery.docs.find((d) => d.id !== uid);

  if (!oldDoc) {
    await userRef.set({
      uid,
      email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { migrated: false };
  }

  const oldId = oldDoc.id;
  const oldData = oldDoc.data();

  const batch = adminDb.batch();

  batch.set(userRef, {
    ...oldData,
    uid,
    updatedAt: new Date().toISOString(),
  });
  batch.delete(oldDoc.ref);

  const collections = ["products", "categories", "lists", "list_items"];
  const counts: Record<string, number> = {};

  for (const col of collections) {
    const snap = await adminDb
      .collection(col)
      .where("userId", "==", oldId)
      .get();
    counts[col] = snap.size;
    snap.docs.forEach((doc) => {
      batch.update(doc.ref, { userId: uid });
    });
  }

  const migrationRef = adminDb.collection("migrations").doc(uid);
  batch.set(migrationRef, {
    email,
    oldNextAuthId: oldId,
    newFirebaseUid: uid,
    migratedAt: new Date().toISOString(),
    counts: {
      products: counts["products"] ?? 0,
      categories: counts["categories"] ?? 0,
      lists: counts["lists"] ?? 0,
      list_items: counts["list_items"] ?? 0,
    },
  });

  await batch.commit();

  return { migrated: true };
}
