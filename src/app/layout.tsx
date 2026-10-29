import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/lib/theme";

export const metadata: Metadata = {
  title: "LexBénin — Code du numérique de la République du Bénin",
  description:
    "Assistant numérique citoyen de vulgarisation et de conformité sur le Code du numérique de la République du Bénin. Réponses claires et sourcées.",
};

const themeInitScript = `
  (function() {
    try {
      var saved = localStorage.getItem('lexbenin-theme');
      var isDark = saved === 'dark' || ((!saved || saved === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider>
          <Header />
          <main className="flex-1 flex flex-col items-center w-full">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

