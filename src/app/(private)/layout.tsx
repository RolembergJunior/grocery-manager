import Header from "@/components/Header";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="md:pb-0 md:pt-20">{children}</main>
      <Header />
    </>
  );
}
