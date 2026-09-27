import { redirect } from "next/navigation";
import Header from "@/components/Header";
import SubscriptionGate from "@/components/SubscriptionGate";
import { getUidFromSession } from "@/lib/auth-server";
import { cleanupOrphans } from "@/lib/helpers/delete-cascade-helpers";

export default async function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const uid = await getUidFromSession();
  if (!uid) redirect("/login");

  // Repair data left behind by earlier deletes before any page loads it.
  try {
    await cleanupOrphans(uid);
  } catch (error) {
    console.error("Error cleaning up orphan data:", error);
  }

  return (
    <>
      <SubscriptionGate>
        <main className="md:pb-0 md:pt-20">{children}</main>
      </SubscriptionGate>
      <Header />
    </>
  );
}
