import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

import AuthProvider from "@/components/AuthProvider";
import LoadingFetch from "@/components/LoadingFetch";
import { GoogleAnalytics } from "nextjs-google-analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gerenciador de Compras",
  description: "Gerencie e realize suas compras com facilidade",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <GoogleAnalytics trackPageViews />
          <Toaster richColors position="top-center" />
          {children}
          <LoadingFetch />
        </AuthProvider>
      </body>
    </html>
  );
}
