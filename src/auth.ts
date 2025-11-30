import NextAuth from "next-auth";

import { FirestoreAdapter } from "@auth/firebase-adapter";
import { cert } from "firebase-admin/app";
import Google from "next-auth/providers/google";
import { adminDb } from "./lib/firebaseAdmin";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  adapter: FirestoreAdapter({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(
        /\\n/g,
        "\n"
      ),
    }),
  }),
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user && (user as any).id) {
        token.sub = (user as any).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token?.sub) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      await adminDb
        .collection("users")
        .doc(user.id!)
        .update({
          subscriptionStatus: "free",
          subscriptionTier: null,
          subscriptionStartDate: null,
          subscriptionEndDate: null,
          nameApp: user.name || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
    },
  },
});
