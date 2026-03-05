import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ListaAí - Perfil",
  description: "ListaAí - A plataforma de gestão de listas de compras",
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
