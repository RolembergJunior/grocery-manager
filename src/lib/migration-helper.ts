import "server-only";
import { adminDb } from "./firebaseAdmin";
import { updateProfile } from "./firestore-helpers";

export async function migrateAllUsers(userId: string) {
  try {
    const usersSnapshot = await adminDb.collection("users").doc(userId).get();
    const user = usersSnapshot.data();

    await updateProfile(userId, {
      name: user?.name,
      email: user?.email,
      nameApp: "",
      imagePath: "",
    });

    return {
      success: true,
      migratedCount: 1,
      errors: [],
    };
  } catch (error) {
    console.error("Error migrating users:", error);
    return {
      success: false,
      migratedCount: 0,
      errors: ["Error migrating users"],
    };
  }
}
