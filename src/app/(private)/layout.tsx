import { redirect } from "next/navigation";
import Header from "@/components/Header";
import SubscriptionGate from "@/components/SubscriptionGate";
import { getUidFromSession } from "@/lib/auth-server";

export default async function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const uid = await getUidFromSession();
  if (!uid) redirect("/login");

  return (
    <>
      <SubscriptionGate>
        <main className="md:pb-0 md:pt-20">{children}</main>
      </SubscriptionGate>
      <Header />
    </>
  );
}
