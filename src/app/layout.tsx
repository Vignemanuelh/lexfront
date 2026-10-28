import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "LexBénin — Code du numérique de la République du Bénin",
  description:
    "Assistant numérique citoyen de vulgarisation et de conformité sur le Code du numérique de la République du Bénin. Réponses claires et sourcées.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#F7F7F5] text-[#0A0D14] antialiased">
        <Header />
        <main className="flex-1 flex flex-col items-center w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

