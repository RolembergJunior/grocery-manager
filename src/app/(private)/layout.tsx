import Header from "@/components/Header";
import SubscriptionGate from "@/components/SubscriptionGate";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SubscriptionGate>
        <main className="md:pb-0 md:pt-20">{children}</main>
      </SubscriptionGate>
      <Header />
    </>
  );
}
