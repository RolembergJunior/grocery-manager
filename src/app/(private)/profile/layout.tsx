import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grocery Manager - Perfil",
  description: "Grocery Manager - A plataforma de gestão de listas de compras",
};

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="md:pb-0 md:pt-20">{children}</main>
    </>
  );
}
