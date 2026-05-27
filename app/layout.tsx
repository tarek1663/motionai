import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { GeistSans } from "geist/font/sans";
import { colors } from "@/lib/colors";
import { GlobalAnnouncementBar } from "@/components/ui/global-announcement-bar";
import "./globals.css";

export const metadata: Metadata = {
  title: "MotionAI — Génère des vidéos motion design en secondes",
  description:
    "Tape un prompt. MotionAI génère le script, la voix, la musique et les animations automatiquement.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: colors.accent,
          colorBackground: colors.text,
          colorInputBackground: "#111111",
          colorInputText: "#ffffff",
          borderRadius: "12px",
          fontFamily: "inherit",
        },
        elements: {
          card: "bg-[#111111] border border-white/10",
          headerTitle: "text-white font-bold",
          headerSubtitle: "text-gray-400",
          socialButtonsBlockButton: "border border-white/10 bg-white/5 hover:bg-white/10",
          formButtonPrimary: "bg-white text-black hover:bg-gray-100",
          footerActionLink: "text-white hover:text-gray-300",
        },
      }}
    >
      <html lang="fr" className={GeistSans.className}>
        <body
          style={{
            margin: 0,
            padding: 0,
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
          }}
        >
          <GlobalAnnouncementBar />
          <div style={{ paddingTop: 44 }}>{children}</div>
        </body>
      </html>
    </ClerkProvider>
  );
}
