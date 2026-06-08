import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/site/language-provider";
import { SideMenu } from "@/components/site/side-menu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RogerTorres — Vídeo · Foto · Disseny · Web · 3D",
  description:
    "Portfolio creatiu multidisciplinari: producció de vídeo, fotografia, disseny gràfic, desenvolupament web i 3D.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ca"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <LanguageProvider>
          <SideMenu />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
