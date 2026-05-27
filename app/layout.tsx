import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { GeistSans } from "geist/font/sans";
import { colors } from "@/lib/colors";
import { AppBodyShell } from "@/components/ui/app-body-shell";
import ScrollToTop from "@/components/ScrollToTop";
import "./globals.css";

export const metadata: Metadata = {
  title: "Motionr — L'IA qui transforme tes mots en vidéos",
  description:
    "Crée des vidéos motion design professionnelles en quelques minutes grâce à l'IA. Script, animations, voix — tout est automatique.",
  keywords: "motion design, vidéo IA, générateur vidéo, motion video, AI video",
  openGraph: {
    title: "Motionr — L'IA qui transforme tes mots en vidéos",
    description: "Crée des vidéos motion design professionnelles en quelques minutes.",
    url: "https://motionr.app",
    siteName: "Motionr",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Motionr — L'IA qui transforme tes mots en vidéos",
    description: "Crée des vidéos motion design professionnelles en quelques minutes.",
  },
  icons: {
    icon: "/favicon.ico",
  },
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
          <AppBodyShell>
            <ScrollToTop />
            {children}
          </AppBodyShell>
        </body>
      </html>
    </ClerkProvider>
  );
}
