"use client";

import { Fragment, type CSSProperties, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaLinkedinIn } from "react-icons/fa6";
import {
  siFacebook,
  siInstagram,
  siPinterest,
  siSnapchat,
  siTiktok,
  siX,
  siYoutube,
} from "simple-icons";

import { BackgroundComponents } from "@/components/ui/background-components";

const accent = "#10B981";
const accentLight = "#ffffff";

type SocialBrand =
  | "instagram"
  | "tiktok"
  | "youtube"
  | "linkedin"
  | "x"
  | "facebook"
  | "pinterest"
  | "snapchat";

const socialPlatforms: Array<{ name: string; brand: SocialBrand }> = [
  { name: "Instagram", brand: "instagram" },
  { name: "TikTok", brand: "tiktok" },
  { name: "YouTube", brand: "youtube" },
  { name: "LinkedIn", brand: "linkedin" },
  { name: "Twitter / X", brand: "x" },
  { name: "Facebook", brand: "facebook" },
  { name: "Pinterest", brand: "pinterest" },
  { name: "Snapchat", brand: "snapchat" },
];

const socialPlatformSequence = [...socialPlatforms, ...socialPlatforms, ...socialPlatforms];

function SimpleBrandLogo({
  icon,
  size = 36,
}: {
  icon: { path: string; hex: string };
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={`#${icon.hex}`}
      aria-hidden="true"
    >
      <path d={icon.path} />
    </svg>
  );
}

function SocialBrandLogo({ brand }: { brand: SocialBrand }) {
  switch (brand) {
    case "instagram":
      return <SimpleBrandLogo icon={siInstagram} size={38} />;
    case "tiktok":
      return <SimpleBrandLogo icon={siTiktok} size={38} />;
    case "youtube":
      return <SimpleBrandLogo icon={siYoutube} size={40} />;
    case "linkedin":
      return <FaLinkedinIn size={36} color="#0a66c2" aria-hidden="true" />;
    case "x":
      return <SimpleBrandLogo icon={siX} size={37} />;
    case "facebook":
      return <SimpleBrandLogo icon={siFacebook} size={38} />;
    case "pinterest":
      return <SimpleBrandLogo icon={siPinterest} size={38} />;
    case "snapchat":
      return <SimpleBrandLogo icon={siSnapchat} size={38} />;
  }
}

export default function LandingPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [showProductMenu, setShowProductMenu] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleGenerate = () => {
    if (prompt.trim()) {
      router.push(`/signup?prompt=${encodeURIComponent(prompt)}`);
    } else {
      router.push("/signup");
    }
  };

  const scrollToSection = (sectionId: string, align: ScrollLogicalPosition = "start") => {
    const section = document.getElementById(sectionId);
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: align });
  };

  const steps = [
    { num: "01", title: "Décris ton message" },
    { num: "02", title: "L'IA crée ta vidéo" },
    { num: "03", title: "Télécharge et partage" },
  ];

  const comparisonRows = [
    {
      without: "Faire appel à une agence vidéo coûteuse",
      with: {
        title: "Vidéo pro générée en quelques minutes",
        desc: "De l'idée à la vidéo publiable sans intermédiaire.",
      },
    },
    {
      without: "Attendre des jours avant d'avoir un résultat",
      with: {
        title: "Script, animations et voix automatiques",
        desc: "L'IA gère tout de A à Z pour toi.",
      },
    },
    {
      without: "Multiplier les allers-retours avec un prestataire",
      with: {
        title: "Résultat 1080p dès la première génération",
        desc: "Moins d'ajustements, plus de vitesse.",
      },
    },
    {
      without: "Avoir besoin de compétences techniques",
      with: {
        title: "Zéro compétence technique requise",
        desc: "Si tu peux écrire, tu peux créer.",
      },
    },
    {
      without: "Produire un seul format à la fois",
      with: {
        title: "9:16, 16:9 et 1:1 en un clic",
        desc: "Tous les formats pour tous les réseaux.",
      },
    },
    {
      without: "Réserver la vidéo aux plus gros budgets",
      with: {
        title: "Accessible dès 0€",
        desc: "Commence gratuitement, sans carte bancaire.",
      },
    },
  ];

  const faqs = [
    {
      q: "Comment fonctionne Motionr ?",
      a: "Tu décris ton message ou tu écris ton script. Notre IA génère automatiquement le script, choisit les animations, crée la voix off et rend la vidéo en 1080p.",
    },
    {
      q: "Puis-je utiliser mes propres textes ?",
      a: "Oui — le mode script te permet d'écrire librement. L'IA découpe et adapte ton texte pour créer une vidéo motion design professionnelle.",
    },
    {
      q: "Quelle est la qualité des vidéos ?",
      a: "Toutes les vidéos sont rendues en 1080p à 60fps avec des animations fluides et une voix naturelle générée par ElevenLabs.",
    },
    {
      q: "Combien de vidéos puis-je générer ?",
      a: "Le plan gratuit inclut 3 vidéos/mois. Les plans payants vont de 60 à illimité selon tes besoins.",
    },
    {
      q: "Y a-t-il un engagement ?",
      a: "Non — tu peux annuler à tout moment depuis ton espace compte. Les plans Starter et Pro incluent 4 jours d'essai gratuit.",
    },
    {
      q: "Dans quelles langues puis-je générer ?",
      a: "Motionr supporte le français, l'anglais, l'espagnol, l'allemand et de nombreuses autres langues grâce à ElevenLabs.",
    },
  ];

  const plans = [
    {
      id: "free",
      name: "Gratuit",
      price: { monthly: 0, yearly: 0 },
      videos: "3 vidéos/mois",
      features: [
        "3 vidéos par mois",
        "Qualité 1080p",
        "72+ animations",
        "Filigrane Motionr",
      ],
      cta: "Commencer gratuitement",
      popular: false,
    },
    {
      id: "starter",
      name: "Starter",
      price: { monthly: 0, yearly: 0 },
      videos: "60 vidéos/mois",
      features: [
        "60 vidéos par mois",
        "Qualité 1080p",
        "72+ animations",
        "Sans filigrane",
        "Essai 4 jours gratuit",
      ],
      cta: "Essayer 4 jours gratuit",
      popular: false,
    },
    {
      id: "pro",
      name: "Pro",
      price: { monthly: 0, yearly: 0 },
      videos: "150 vidéos/mois",
      features: [
        "150 vidéos par mois",
        "Qualité 1080p",
        "72+ animations",
        "Sans filigrane",
        "Priorité de rendu",
        "Essai 4 jours gratuit",
      ],
      cta: "Essayer 4 jours gratuit",
      popular: true,
    },
    {
      id: "business",
      name: "Business",
      price: { monthly: 120, yearly: 99 },
      videos: "Illimité",
      features: [
        "Vidéos illimitées",
        "Qualité 1080p",
        "72+ animations",
        "Sans filigrane",
        "Rendu prioritaire",
        "Support dédié",
      ],
      cta: "Contacter les ventes",
      popular: false,
    },
  ];

  const sectionEyebrowStyle: CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    color: accent,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    marginBottom: 12,
  };

  const sectionTitleStyle: CSSProperties = {
    fontSize: 44,
    fontWeight: 700,
    letterSpacing: "-0.045em",
    lineHeight: 1.08,
    color: "#1f2937",
  };

  const sectionBodyStyle: CSSProperties = {
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 1.68,
    color: "#888",
  };

  const cardTitleStyle: CSSProperties = {
    fontSize: 19,
    fontWeight: 600,
    letterSpacing: "-0.025em",
    color: "#1f2937",
  };

  const cardBodyStyle: CSSProperties = {
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 1.7,
    color: "#888",
  };

  const mutedMetaStyle: CSSProperties = {
    fontSize: 12,
    fontWeight: 500,
    color: "#aaa",
  };

  const surfaceCardStyle: CSSProperties = {
    background: "#fff",
    borderRadius: 24,
    border: "1.5px solid #e8e8e8",
    boxShadow: "0 18px 44px rgba(15,23,42,0.04)",
  };

  const featureTagStyle: CSSProperties = {
    fontSize: 12,
    fontWeight: 700,
    color: accent,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    marginBottom: 12,
  };

  const featureLightCardStyle: CSSProperties = {
    ...surfaceCardStyle,
    borderRadius: 26,
    padding: "36px",
    display: "flex",
    flexDirection: "column",
    minHeight: "100%",
    background: "linear-gradient(180deg, #ffffff 0%, #fcfbfa 100%)",
    border: "1px solid rgba(16,185,129,0.24)",
    boxShadow:
      "0 0 0 1px rgba(16,185,129,0.12), 0 0 18px rgba(16,185,129,0.18), 0 0 34px rgba(16,185,129,0.14), 0 20px 46px rgba(24,19,15,0.07)",
    overflow: "hidden",
  };

  const featureDarkCardStyle: CSSProperties = {
    borderRadius: 26,
    padding: "36px",
    display: "flex",
    flexDirection: "column",
    minHeight: "100%",
    background: "linear-gradient(180deg, #171311 0%, #110e0c 100%)",
    border: "1px solid rgba(16,185,129,0.28)",
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.05), 0 0 0 1px rgba(16,185,129,0.12), 0 0 20px rgba(16,185,129,0.22), 0 0 38px rgba(16,185,129,0.16), 0 20px 46px rgba(10,10,10,0.18)",
    overflow: "hidden",
  };

  const featureLightDemoStyle: CSSProperties = {
    marginTop: "auto",
    background: "#fafaf8",
    borderRadius: 18,
    padding: "22px",
    border: "1px solid rgba(23,19,17,0.08)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
  };

  const featureDarkDemoStyle: CSSProperties = {
    marginTop: "auto",
    background: "rgba(255,255,255,0.03)",
    borderRadius: 18,
    padding: "22px",
    border: "1px solid rgba(255,255,255,0.06)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
  };

  return (
    <div
      style={{
        fontFamily: "inherit",
        background: "#ffffff",
        color: "#171311",
        overflowX: "hidden",
      }}
    >
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        .nav-link { text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.15s; color: rgba(23,19,17,0.5); }
        .nav-link:hover { color: #171311; }
        .prompt-input::placeholder { color: rgba(97,90,84,0.72); }
        .btn-primary { background: ${accent}; color: #fff; border: none; border-radius: 12px; padding: 12px 24px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.15s; text-decoration: none; display: inline-block; }
        .btn-primary:hover { background: ${accent}; transform: translateY(-1px); box-shadow: 0 8px 24px ${accent}44; }
        .btn-secondary { background: #fff; color: #0a0a0a; border: 1.5px solid #e8e8e8; border-radius: 12px; padding: 12px 24px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.15s; text-decoration: none; display: inline-block; }
        .btn-secondary:hover { border-color: #ccc; transform: translateY(-1px); }
        .plan-card { transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease; }
        .plan-card:hover { transform: translateY(-6px); }
        .faq-item { border-bottom: 1px solid #f0f0f0; }
        .footer-link { text-decoration: none; font-size: 13px; font-weight: 500; color: #888; transition: color 0.15s; }
        .footer-link:hover { color: #171311; }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .shimmer-bar {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          animation: shimmer 3s infinite;
        }
      `}</style>

      {/* ── BARRE D'ANNONCE ── */}
      <div
        style={{
          background: "#0a0a0a",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "10px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 101,
        }}
        onClick={() => router.push("/pricing")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            router.push("/pricing");
          }
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 100,
            padding: "5px 16px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div className="shimmer-bar" aria-hidden="true" />
          <span style={{ fontSize: 13, color: "#10B981", fontWeight: 700 }}>✨ Offre limitée</span>
          <span style={{ width: 1, height: 12, background: "rgba(255,255,255,0.1)" }} />
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 400 }}>
            Essaie le plan Starter
            <span style={{ color: "#ffffff", fontWeight: 600 }}> 4 jours gratuitement</span>
            {" "}— sans carte bancaire
          </span>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>→</span>
        </div>
      </div>

      <header
        style={{
          position: "fixed",
          top: 44,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 48px",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled ? "rgba(255,255,255,0.98)" : "rgba(255,255,255,0.94)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(23,19,17,0.08)",
          boxShadow: "0 8px 24px rgba(23,19,17,0.05)",
          transition: "all 0.3s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: "#10B981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 900,
              color: "#fff",
              boxShadow: "0 2px 8px rgba(16,185,129,0.4)",
            }}
          >
            M
          </div>
          <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.04em", color: "#0a0a0a" }}>
            Motionr
          </span>
        </div>

        <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div
            style={{ position: "relative" }}
            onMouseEnter={() => setShowProductMenu(true)}
            onMouseLeave={() => setShowProductMenu(false)}
          >
            <button
              style={{
                padding: "8px 14px",
                background: showProductMenu ? "rgba(16,185,129,0.08)" : "rgba(23,19,17,0.03)",
                border: "1px solid rgba(23,19,17,0.08)",
                color: showProductMenu ? "#0a0a0a" : "rgba(23,19,17,0.72)",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                gap: 4,
                transition: "color 0.15s",
                borderRadius: 8,
              }}
            >
              Produit
              <span
                style={{
                  fontSize: 10,
                  opacity: 0.5,
                  transform: showProductMenu ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s",
                }}
              >
                ▼
              </span>
            </button>

            {showProductMenu && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 360,
                  background: "#ffffff",
                  borderRadius: 16,
                  padding: "20px",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.05)",
                  zIndex: 200,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -6,
                    left: "50%",
                    transform: "translateX(-50%) rotate(45deg)",
                    width: 12,
                    height: 12,
                    background: "#ffffff",
                    borderTop: "1px solid rgba(0,0,0,0.05)",
                    borderLeft: "1px solid rgba(0,0,0,0.05)",
                  }}
                />

                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#aaa",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    Créer
                  </div>
                  {[
                    {
                      icon: "✨",
                      title: "Générer par IA",
                      desc: "Décris ton idée, l'IA fait le reste",
                      href: "/dashboard",
                    },
                    {
                      icon: "✍️",
                      title: "Mode Script",
                      desc: "Écris ton texte, on le met en vidéo",
                      href: "/dashboard",
                    },
                  ].map((item, i) => (
                    <a
                      key={i}
                      href={item.href}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        padding: "10px 10px",
                        borderRadius: 10,
                        textDecoration: "none",
                        transition: "background 0.15s",
                        background: "transparent",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 9,
                          background: "rgba(16,185,129,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 16,
                          flexShrink: 0,
                        }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#0a0a0a",
                            marginBottom: 2,
                          }}
                        >
                          {item.title}
                        </div>
                        <div style={{ fontSize: 12, color: "#888", lineHeight: 1.4 }}>
                          {item.desc}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>

                <div style={{ height: 1, background: "#f0f0f0", marginBottom: 16 }} />

                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#aaa",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    Animations
                  </div>
                  {[
                    {
                      icon: "🎬",
                      title: "72+ scènes",
                      desc: "Texte, data, cinéma, social media",
                      href: "#how",
                    },
                    {
                      icon: "📱",
                      title: "Multi-format",
                      desc: "9:16 · 16:9 · 1:1",
                      href: "#how",
                    },
                  ].map((item, i) => (
                    <a
                      key={i}
                      href={item.href}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        padding: "10px 10px",
                        borderRadius: 10,
                        textDecoration: "none",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 9,
                          background: "rgba(16,185,129,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 16,
                          flexShrink: 0,
                        }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#0a0a0a",
                            marginBottom: 2,
                          }}
                        >
                          {item.title}
                        </div>
                        <div style={{ fontSize: 12, color: "#888", lineHeight: 1.4 }}>
                          {item.desc}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>

                <div style={{ height: 1, background: "#f0f0f0", marginBottom: 16 }} />

                <div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#aaa",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    Qualité
                  </div>
                  {[
                    {
                      icon: "🎙️",
                      title: "Voix naturelle",
                      desc: "ElevenLabs · Multilingue",
                      href: "#how",
                    },
                    {
                      icon: "⚡",
                      title: "Rendu rapide",
                      desc: "Vidéo 1080p en 2-5 minutes",
                      href: "#how",
                    },
                  ].map((item, i) => (
                    <a
                      key={i}
                      href={item.href}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        padding: "10px 10px",
                        borderRadius: 10,
                        textDecoration: "none",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 9,
                          background: "rgba(16,185,129,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 16,
                          flexShrink: 0,
                        }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#0a0a0a",
                            marginBottom: 2,
                          }}
                        >
                          {item.title}
                        </div>
                        <div style={{ fontSize: 12, color: "#888", lineHeight: 1.4 }}>
                          {item.desc}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {[
            { label: "Tarifs", href: "#pricing" },
            { label: "FAQ", href: "#faq" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              style={{
                padding: "8px 14px",
                color: "rgba(23,19,17,0.72)",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500,
                borderRadius: 8,
                transition: "all 0.15s",
                background: "rgba(23,19,17,0.03)",
                border: "1px solid rgba(23,19,17,0.08)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#0a0a0a";
                e.currentTarget.style.background = "rgba(16,185,129,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(23,19,17,0.72)";
                e.currentTarget.style.background = "rgba(23,19,17,0.03)";
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => router.push("/login")}
            style={{
              padding: "8px 18px",
              background: "transparent",
              border: "1px solid rgba(23,19,17,0.12)",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              color: "#0a0a0a",
              textDecoration: "none",
              transition: "all 0.15s",
            }}
          >
            Connexion
          </button>
          <button
            onClick={() => router.push("/signup")}
            style={{
              padding: "8px 18px",
              background: "#10B981",
              color: "#ffffff",
              border: "none",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 4px 12px rgba(16,185,129,0.3)",
            }}
          >
            Commencer gratuitement
          </button>
        </div>
      </header>

      <section
        aria-label="Hero"
        style={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          background: "#ffffff",
          padding: "0 60px",
          justifyContent: "flex-start",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 1180,
            margin: "0 auto",
            paddingTop: 152,
            paddingBottom: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 34,
              alignItems: "center",
            }}
          >
            <h1
              style={{
                fontSize: 60,
                fontWeight: 700,
                letterSpacing: "-0.04em",
                lineHeight: 1.02,
                color: "#171311",
                maxWidth: 980,
                textAlign: "center",
                margin: "0 auto",
              }}
            >
              <span style={{ display: "block" }}>
                L&apos;IA qui transforme tes{" "}
                <span
                  style={{
                    display: "inline-block",
                    marginLeft: "0.01em",
                    marginRight: "0.01em",
                    fontStyle: "italic",
                    color: "#171311",
                  }}
                >
                  mots
                </span>{" "}
                en vidéos.
              </span>
            </h1>

            <p
              style={{
                maxWidth: 700,
                margin: "0 auto 20px",
                textAlign: "center",
                fontSize: 18,
                lineHeight: 1.7,
                color: "#000000",
                textShadow: "none",
                position: "relative",
                zIndex: 4,
              }}
            >
              Décris ton idée. L&apos;IA génère le script, les animations et la voix. Ta
              vidéo professionnelle est prête en quelques minutes.
            </p>

            <div
              style={{
                width: "100%",
                maxWidth: 980,
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                gap: 0,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "100%",
                  maxWidth: 700,
                  margin: "0 auto",
                  position: "relative",
                  isolation: "isolate",
                  zIndex: 1,
                }}
              >
                <BackgroundComponents
                  glow="green"
                  className="left-[-104px] right-[-104px] top-[-88px] bottom-[-52px]"
                />
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: -2,
                    zIndex: 1,
                    borderRadius: 20,
                    border: "1.5px solid rgba(16,185,129,0.72)",
                    boxShadow:
                      "0 0 0 1px rgba(16,185,129,0.16), 0 0 24px rgba(16,185,129,0.34), 0 0 60px rgba(16,185,129,0.18)",
                  }}
                />
                <div
                  style={{
                    position: "relative",
                    zIndex: 2,
                    width: "100%",
                    background: "#ffffff",
                    borderRadius: 18,
                    border: "1px solid rgba(16,185,129,0.14)",
                    boxShadow:
                      "0 14px 34px rgba(24,19,15,0.08), 0 0 0 1px rgba(16,185,129,0.05) inset",
                    padding: "18px 20px 14px",
                  }}
                >
                  <textarea
                    className="prompt-input"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Crée une vidéo de lancement pour..."
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleGenerate();
                      }
                    }}
                    style={{
                      width: "100%",
                      background: "none",
                      border: "none",
                      outline: "none",
                      fontSize: 15,
                      color: "#625b55",
                      fontFamily: "inherit",
                      resize: "none",
                      lineHeight: 1.5,
                      minHeight: 46,
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: 6,
                      paddingTop: 4,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                      {[
                        { label: "✦", value: "Launch video" },
                        { label: "◷ 5s", value: "Vidéo 5s" },
                        { label: "▯ 9:16", value: "Vidéo verticale 9:16" },
                      ].map((control) => (
                        <button
                          key={control.label}
                          onClick={() => setPrompt(control.value)}
                          style={{
                            padding: 0,
                            background: "transparent",
                            border: "none",
                            fontSize: 12,
                            color: "#4f4843",
                            cursor: "pointer",
                            fontFamily: "inherit",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          {control.label}
                        </button>
                      ))}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <button
                        onClick={() => setPrompt("Plan de vidéo")}
                        style={{
                          padding: 0,
                          background: "transparent",
                          border: "none",
                          fontSize: 12,
                          color: "#6b645f",
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        Plan
                      </button>
                      <button
                        onClick={handleGenerate}
                        style={{
                          width: 36,
                          height: 36,
                          background: accent,
                          color: "#ffffff",
                          border: "none",
                          borderRadius: 999,
                          fontSize: 18,
                          fontWeight: 700,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: `0 6px 18px ${accent}44`,
                        }}
                      >
                        ↑
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  marginTop: 38,
                  flexWrap: "wrap",
                  position: "relative",
                  zIndex: 4,
                }}
              >
                <button
                  onClick={() => router.push("/signup")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "12px 20px",
                    minWidth: 220,
                    borderRadius: 12,
                    background: accent,
                    color: "#ffffff",
                    border: "none",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    boxShadow: "0 10px 24px rgba(16,185,129,0.28)",
                  }}
                >
                  Créer ma première vidéo →
                </button>
                <a
                  href="#how"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("how", "center");
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "12px 20px",
                    minWidth: 220,
                    borderRadius: 12,
                    background: "#171311",
                    color: "#ffffff",
                    textDecoration: "none",
                    fontSize: 14,
                    fontWeight: 600,
                    border: "1px solid rgba(23,19,17,0.92)",
                    boxShadow: "0 8px 20px rgba(24,19,15,0.12)",
                    position: "relative",
                    zIndex: 5,
                  }}
                >
                  Voir comment ça fonctionne
                </a>
              </div>

              <div
                style={{
                  width: "100%",
                  marginTop: 46,
                  marginBottom: 24,
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                {[
                  { format: "9:16", width: 132, height: 235 },
                  { format: "1:1", width: 168, height: 168 },
                  { format: "16:9", width: 298, height: 168 },
                  { format: "1:1", width: 168, height: 168 },
                  { format: "9:16", width: 132, height: 235 },
                ].map((item, index) => (
                  <div
                    key={`${item.format}-${index}`}
                    style={{
                      width: item.width,
                      height: item.height,
                      borderRadius: 18,
                      background: "#ffffff",
                      border: "1px solid rgba(23,19,17,0.08)",
                      boxShadow: "0 10px 28px rgba(24,19,15,0.05)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        width: item.format === "16:9" ? 44 : 38,
                        height: item.format === "16:9" ? 44 : 38,
                        borderRadius: 999,
                        background: "#FFFFFF",
                        border: "1px solid rgba(23,19,17,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#171311",
                        fontSize: 14,
                        boxShadow: "0 4px 12px rgba(24,19,15,0.06)",
                      }}
                    >
                      ▶
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: "0.02em",
                        color: "#7A726A",
                      }}
                    >
                      {item.format}
                    </span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  width: "100%",
                  background: "#ffffff",
                  padding: "18px 0 22px",
                  marginBottom: 18,
                }}
              >
                <style>{`
                  @keyframes social-scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                  }
                  .social-scroll-track {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    animation: social-scroll 24s linear infinite;
                    width: max-content;
                    flex-wrap: nowrap;
                    will-change: transform;
                    pointer-events: none;
                    user-select: none;
                  }
                  .social-scroll-track * {
                    pointer-events: none;
                    user-select: none;
                  }
                `}</style>

                <div
                  style={{ maxWidth: 980, margin: "0 auto", position: "relative", padding: "0 8px" }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 8,
                      top: 0,
                      bottom: 0,
                      width: 84,
                      background: "linear-gradient(90deg, #ffffff, rgba(255,255,255,0))",
                      zIndex: 2,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      right: 8,
                      top: 0,
                      bottom: 0,
                      width: 84,
                      background: "linear-gradient(270deg, #ffffff, rgba(255,255,255,0))",
                      zIndex: 2,
                    }}
                  />

                  <div style={{ overflow: "hidden" }}>
                    <div className="social-scroll-track">
                      {[...socialPlatformSequence, ...socialPlatformSequence].map((item, i) => (
                        <div
                          key={`${item.name}-${i}`}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "8px 22px",
                            whiteSpace: "nowrap",
                            flex: "0 0 auto",
                          }}
                        >
                          <SocialBrandLogo brand={item.brand} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" style={{ padding: "52px 40px 72px", background: "#fff" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ ...sectionTitleStyle, marginBottom: 36 }}>
            3 étapes. C&apos;est tout.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
            {steps.map((step) => (
              <div key={step.num}>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: "transparent",
                    WebkitTextStroke: `1.1px ${accent}`,
                    marginBottom: 4,
                    letterSpacing: "-0.04em",
                  }}
                >
                  {step.num}
                </div>
                <h3
                  style={{
                    ...cardTitleStyle,
                    fontSize: 13,
                    lineHeight: 1.2,
                    marginBottom: 0,
                  }}
                >
                  {step.title}
                </h3>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 28,
              width: "100%",
              aspectRatio: "16 / 9",
              borderRadius: 22,
              border: "1.5px solid rgba(16,185,129,0.72)",
              background: "#fafafa",
              boxShadow:
                "0 0 0 1px rgba(16,185,129,0.16), 0 0 26px rgba(16,185,129,0.24), inset 0 0 0 1px rgba(16,185,129,0.08)",
            }}
          />
        </div>
      </section>

      <section style={{ padding: "108px 60px 100px", background: "#ffffff" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2
              style={{
                ...sectionTitleStyle,
                fontSize: 48,
                color: "#171311",
                margin: "0 auto 14px",
              }}
            >
              La création vidéo, enfin accessible à tous.
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                color: "#171311",
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                padding: "0 6px",
              }}
            >
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "#ef4444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  color: "#ffffff",
                }}
              >
                ✕
              </span>
              Sans Motionr
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                color: "#171311",
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                padding: "0 6px",
              }}
            >
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "#10B981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  color: "#ffffff",
                }}
              >
                ✓
              </span>
              Avec Motionr
            </div>
          </div>

          <div
            style={{
              ...surfaceCardStyle,
              position: "relative",
              borderRadius: 30,
              overflow: "hidden",
              border: "1px solid rgba(16,185,129,0.34)",
              background: "#ffffff",
              boxShadow:
                "0 0 0 1px rgba(16,185,129,0.18), 0 0 18px rgba(16,185,129,0.22), 0 0 36px rgba(16,185,129,0.16), 0 24px 54px rgba(24,19,15,0.08)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                alignItems: "stretch",
                background: "#ffffff",
              }}
            >
              {comparisonRows.map((item, i) => (
                <Fragment key={item.with.title}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 14,
                      padding: "22px 28px",
                      background: "#ffffff",
                      borderRight: "1px solid rgba(23,19,17,0.05)",
                      borderBottom:
                        i === comparisonRows.length - 1 ? "none" : "1px solid rgba(23,19,17,0.05)",
                    }}
                  >
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: "#ef4444",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        color: "#ffffff",
                        marginTop: 1,
                      }}
                    >
                      ✕
                    </div>
                    <span
                      style={{
                        fontSize: 14,
                        color: "#7b746d",
                        lineHeight: 1.55,
                      }}
                    >
                      {item.without}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 14,
                      padding: "22px 28px",
                      background: "#ffffff",
                      borderBottom:
                        i === comparisonRows.length - 1 ? "none" : "1px solid rgba(23,19,17,0.05)",
                    }}
                  >
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: "#10B981",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        color: "#ffffff",
                        marginTop: 2,
                      }}
                    >
                      ✓
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#171311",
                          lineHeight: 1.5,
                          marginBottom: 4,
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {item.with.title}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: "#7b746d",
                          lineHeight: 1.6,
                        }}
                      >
                        {item.with.desc}
                      </div>
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>

        </div>
      </section>

      <section id="features" style={{ padding: "108px 60px 100px", background: "#ffffff" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h2
              style={{
                ...sectionTitleStyle,
                fontSize: 48,
                color: "#171311",
                maxWidth: 720,
                margin: "0 auto",
              }}
            >
              Tout ce dont tu as besoin
              <br />
              pour créer des vidéos pro.
            </h2>
          </div>

          <div
            style={{
              position: "relative",
              borderRadius: 34,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 24,
                alignItems: "stretch",
                background: "transparent",
              }}
            >
              <div style={featureLightCardStyle}>
              <div style={featureTagStyle}>Génération par IA</div>
              <h3
                style={{
                  ...cardTitleStyle,
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#171311",
                  letterSpacing: "-0.04em",
                  marginBottom: 10,
                  lineHeight: 1.2,
                }}
              >
                Décris ton idée.
                <br />
                L&apos;IA fait le reste.
              </h3>
              <p
                style={{
                  ...cardBodyStyle,
                  fontSize: 14,
                  color: "#6F6862",
                  lineHeight: 1.72,
                  marginBottom: 30,
                }}
              >
                Claude analyse ton message et génère automatiquement le script, choisit les
                animations et synchronise la voix.
              </p>
              <div
                style={{
                  ...featureLightDemoStyle,
                  padding: "20px",
                }}
              >
                <div style={{ fontSize: 12, color: "#9b938c", marginBottom: 12 }}>Ton prompt</div>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    padding: "12px 14px",
                    border: "1px solid rgba(23,19,17,0.08)",
                    fontSize: 13,
                    color: "#625b55",
                    marginBottom: 12,
                    fontStyle: "italic",
                  }}
                >
                  &quot;Présente mon app de fitness...&quot;
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <div style={{ flex: 1, height: 1, background: "#e8e8e8" }} />
                  <div style={{ fontSize: 11, color: "#10B981", fontWeight: 600 }}>
                    IA en action
                  </div>
                  <div style={{ flex: 1, height: 1, background: "#e8e8e8" }} />
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["Script ✓", "Animations ✓", "Voix ✓"].map((s) => (
                    <div
                      key={s}
                      style={{
                        padding: "6px 10px",
                        background: "rgba(16,185,129,0.08)",
                        border: "1px solid rgba(16,185,129,0.2)",
                        borderRadius: 100,
                        fontSize: 11,
                        color: "#10B981",
                        fontWeight: 600,
                        boxShadow: "inset 0 0 0 1px rgba(16,185,129,0.02)",
                      }}
                    >
                      {s}
                    </div>
                  ))}
                </div>
              </div>
              </div>

              <div style={featureDarkCardStyle}>
              <div style={featureTagStyle}>Mode Script</div>
              <h3
                style={{
                  ...cardTitleStyle,
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: "-0.04em",
                  marginBottom: 10,
                  lineHeight: 1.2,
                }}
              >
                Écris librement.
                <br />
                On met en vidéo.
              </h3>
              <p
                style={{
                  ...cardBodyStyle,
                  fontSize: 14,
                  color: "rgba(255,255,255,0.58)",
                  lineHeight: 1.72,
                  marginBottom: 30,
                }}
              >
                Colle ton texte existant. L&apos;IA le découpe intelligemment et crée une vidéo
                avec ton contenu exact.
              </p>
              <div
                style={{
                  ...featureDarkDemoStyle,
                  padding: "20px",
                }}
              >
                {[
                  "Bienvenue chez Motionr.",
                  "La création vidéo réinventée.",
                  "Essaie gratuitement.",
                ].map((line, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      padding: "10px 0",
                      borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    }}
                  >
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: "rgba(16,185,129,0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 9,
                        color: "#10B981",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.62)",
                        lineHeight: 1.5,
                        flex: 1,
                      }}
                    >
                      {line}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#10B981",
                        padding: "4px 8px",
                        borderRadius: 999,
                        background: "rgba(16,185,129,0.12)",
                        whiteSpace: "nowrap",
                        fontWeight: 600,
                      }}
                    >
                      Scène {i + 1}
                    </div>
                  </div>
                ))}
              </div>
              </div>

              <div style={featureDarkCardStyle}>
              <div style={featureTagStyle}>Voix naturelle</div>
              <h3
                style={{
                  ...cardTitleStyle,
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: "-0.04em",
                  marginBottom: 10,
                  lineHeight: 1.2,
                }}
              >
                Une voix off
                <br />
                ultra-réaliste.
              </h3>
              <p
                style={{
                  ...cardBodyStyle,
                  fontSize: 14,
                  color: "rgba(255,255,255,0.58)",
                  lineHeight: 1.72,
                  marginBottom: 30,
                }}
              >
                ElevenLabs génère une voix naturelle synchronisée frame par frame avec les
                animations.
              </p>
              <div
                style={{
                  ...featureDarkDemoStyle,
                  padding: "24px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div style={{ fontSize: 20 }}>🎙️</div>
                <div style={{ display: "flex", alignItems: "center", gap: 3, flex: 1, minHeight: 40 }}>
                  {Array.from({ length: 40 }, (_, i) => (
                    <div
                      key={i}
                      style={{
                        width: 3,
                        borderRadius: 3,
                        height: `${10 + Math.abs(Math.sin(i * 0.6)) * 28}px`,
                        background: i % 4 === 0 ? "#10B981" : "rgba(255,255,255,0.12)",
                      }}
                    />
                  ))}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#10B981",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  Sync ✓
                </div>
              </div>
              </div>

              <div style={featureLightCardStyle}>
              <div style={featureTagStyle}>Multi-format</div>
              <h3
                style={{
                  ...cardTitleStyle,
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#171311",
                  letterSpacing: "-0.04em",
                  marginBottom: 10,
                  lineHeight: 1.2,
                }}
              >
                Tous les formats.
                <br />
                Tous les réseaux.
              </h3>
              <p
                style={{
                  ...cardBodyStyle,
                  fontSize: 14,
                  color: "#6F6862",
                  lineHeight: 1.72,
                  marginBottom: 30,
                }}
              >
                Génère en 9:16 pour les Reels, 16:9 pour YouTube ou 1:1 pour LinkedIn en un
                clic.
              </p>
              <div
                style={{
                  ...featureLightDemoStyle,
                  padding: "24px",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  gap: 20,
                }}
              >
                {[
                  { label: "9:16", w: 50, h: 89, network: "Reels · TikTok" },
                  { label: "1:1", w: 70, h: 70, network: "Feed · LinkedIn" },
                  { label: "16:9", w: 100, h: 56, network: "YouTube" },
                ].map((fmt) => (
                  <div
                    key={fmt.label}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        width: fmt.w,
                        height: fmt.h,
                        border: "1.5px solid rgba(16,185,129,0.4)",
                        borderRadius: 8,
                        background: "rgba(16,185,129,0.06)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        color: "#10B981",
                        fontWeight: 700,
                      }}
                    >
                      {fmt.label}
                    </div>
                    <div
                      style={{
                        fontSize: 9,
                        color: "#9b938c",
                        textAlign: "center",
                        lineHeight: 1.45,
                        maxWidth: 78,
                      }}
                    >
                      {fmt.network}
                    </div>
                  </div>
                ))}
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" style={{ padding: "84px 40px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ ...sectionTitleStyle, marginBottom: 24 }}>Simple et transparent.</h2>
            <div
              style={{
                display: "inline-flex",
                background: "#f5f5f5",
                borderRadius: 10,
                padding: 4,
                gap: 4,
              }}
            >
              {(["monthly", "yearly"] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => setBilling(option)}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 8,
                    border: "none",
                    background: billing === option ? "#fff" : "transparent",
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: "pointer",
                    color: billing === option ? "#0a0a0a" : "#888",
                    boxShadow: billing === option ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                  }}
                >
                  {option === "monthly" ? "Mensuel" : "Annuel -40%"}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="plan-card"
                style={{
                  borderRadius: 20,
                  padding: "28px",
                  minHeight: 470,
                  background: plan.popular
                    ? "linear-gradient(165deg, #10b981 0%, #0ea371 100%)"
                    : "linear-gradient(180deg, #ffffff 0%, #fbfbfb 100%)",
                  border: plan.popular
                    ? "1px solid rgba(255,255,255,0.18)"
                    : "1.5px solid rgba(16,185,129,0.35)",
                  color: plan.popular ? "#fff" : "#0a0a0a",
                  boxShadow: plan.popular
                    ? `0 0 0 1px rgba(255,255,255,0.14), 0 0 0 2px rgba(16,185,129,0.2), 0 0 20px rgba(16,185,129,0.42), 0 0 38px rgba(16,185,129,0.3), 0 0 64px rgba(16,185,129,0.2), 0 0 20px rgba(10,10,10,0.16)`
                    : "0 0 0 1px rgba(16,185,129,0.24), 0 0 0 2px rgba(16,185,129,0.1), 0 0 16px rgba(16,185,129,0.2), 0 0 30px rgba(16,185,129,0.14), 0 0 50px rgba(16,185,129,0.1), 0 0 16px rgba(15,23,42,0.1)",
                  position: "relative",
                }}
              >
                {plan.popular && (
                  <div
                    style={{
                      position: "absolute",
                      top: -12,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: accentLight,
                      color: accent,
                      borderRadius: 100,
                      padding: "4px 14px",
                      fontSize: 11,
                      fontWeight: 700,
                      border: `1px solid ${accent}20`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Populaire
                  </div>
                )}
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, letterSpacing: "-0.02em" }}>
                  {plan.name}
                </div>
                <div
                  style={{
                    fontSize: 52,
                    fontWeight: 800,
                    letterSpacing: "-0.045em",
                    lineHeight: 1,
                    marginBottom: 8,
                    color: "#0a0a0a",
                    display: "flex",
                    alignItems: "baseline",
                    gap: 10,
                    justifyContent: "center",
                    textShadow: "0 1px 0 rgba(255,255,255,0.3)",
                  }}
                >
                  {(plan.id === "starter" || plan.id === "pro") && (
                    <span
                      style={{
                        position: "relative",
                        display: "inline-block",
                        fontSize: 20,
                        fontWeight: 600,
                        opacity: 0.9,
                        color: "#111",
                        fontFamily:
                          '"Marker Felt", "Comic Sans MS", "Bradley Hand", "Segoe Print", cursive',
                        letterSpacing: "0.01em",
                        transform: "rotate(-7deg)",
                      }}
                    >
                      {plan.id === "starter"
                        ? `${billing === "monthly" ? 23 : 13}€`
                        : `${billing === "monthly" ? 45 : 35}€`}
                      <span
                        style={{
                          position: "absolute",
                          left: -10,
                          right: -8,
                          top: "49%",
                          height: 3,
                          background: "currentColor",
                          borderRadius: 999,
                          opacity: 0.95,
                          transform: "rotate(-9deg)",
                        }}
                      />
                    </span>
                  )}
                  {plan.price[billing] === 0 ? "0€" : `${plan.price[billing]}€`}
                  <span style={{ fontSize: 15, fontWeight: 600, opacity: 0.78, marginLeft: 2 }}>/mois</span>
                </div>
                <div
                  style={{
                    ...mutedMetaStyle,
                    opacity: plan.popular ? 0.92 : 0.9,
                    color: plan.popular ? "rgba(255,255,255,0.92)" : "#4a4a4a",
                    marginBottom: 24,
                    fontWeight: 600,
                  }}
                >
                  {plan.videos}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    marginBottom: 28,
                  }}
                >
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      style={{
                        fontSize: 13,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        color: plan.popular ? "rgba(255,255,255,0.88)" : "#666",
                        lineHeight: 1.6,
                      }}
                    >
                      <span style={{ color: plan.popular ? "#fff" : accent }}>✓</span>
                      {feature}
                    </div>
                  ))}
                </div>
                <Link
                  href={plan.id === "free" ? "/signup" : `/signup?plan=${plan.id}`}
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "13px",
                    borderRadius: 12,
                    background: plan.popular ? "#fff" : accent,
                    color: plan.popular ? accent : "#fff",
                    fontWeight: 800,
                    fontSize: 14,
                    textDecoration: "none",
                    boxShadow: plan.popular ? "0 8px 20px rgba(255,255,255,0.25)" : `0 10px 20px ${accent}33`,
                  }}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" style={{ padding: "84px 40px", maxWidth: 700, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={sectionEyebrowStyle}>FAQ</div>
          <h2 style={sectionTitleStyle}>Questions fréquentes.</h2>
        </div>
        {faqs.map((faq, index) => (
          <div key={faq.q} className="faq-item" style={{ padding: "20px 0" }}>
            <button
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
              style={{
                width: "100%",
                textAlign: "left",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 600, color: "#1f2937", letterSpacing: "-0.01em" }}>
                {faq.q}
              </span>
              <span
                style={{
                  width: 28,
                  height: 28,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  fontSize: 18,
                  color: "#888",
                  background: "#fafafa",
                  border: "1px solid #f0f0f0",
                  transform: openFaq === index ? "rotate(45deg)" : "none",
                  transition: "transform 0.2s",
                }}
              >
                +
              </span>
            </button>
            {openFaq === index && (
              <p style={{ ...cardBodyStyle, marginTop: 12, paddingRight: 32 }}>
                {faq.a}
              </p>
            )}
          </div>
        ))}
      </section>

      {/* ── MOCKUP FINAL ── */}
      <section
        style={{
          padding: "108px 60px 100px",
          background: "#ffffff",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: 1060,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: 56,
          }}
        >
          {/* Gauche — texte */}
          <div style={{ flex: 1, maxWidth: 440 }}>
            <h2
              style={{
                ...sectionTitleStyle,
                fontSize: 48,
                color: "#171311",
                marginBottom: 18,
              }}
            >
              Crée des vidéos pro depuis n&apos;importe où.
            </h2>
            <p style={{ ...sectionBodyStyle, marginBottom: 36, color: "#6F6862" }}>
              Accède à Motionr depuis ton ordinateur ou ton téléphone. Génère, télécharge et publie
              en quelques minutes.
            </p>
            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="btn-primary"
              style={{ fontSize: 15, padding: "14px 32px" }}
            >
              Commencer gratuitement →
            </button>
            <div style={{ ...mutedMetaStyle, marginTop: 14 }}>Aucune carte requise · 3 vidéos offertes</div>
          </div>

          {/* Droite — mockups */}
          <div
            style={{
              flex: 1,
              position: "relative",
              width: "100%",
              alignSelf: "stretch",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Mockup PC */}
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: 480,
                marginRight: 48,
              }}
            >
              {/* Ecran */}
              <div
                style={{
                  background: "linear-gradient(180deg, #171311 0%, #110e0c 100%)",
                  borderRadius: 16,
                  border: "1px solid rgba(16,185,129,0.28)",
                  overflow: "hidden",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.05), 0 0 20px rgba(16,185,129,0.16), 0 24px 48px rgba(15,23,42,0.12)",
                }}
              >
                {/* Barre navigateur */}
                <div
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    padding: "8px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    borderBottom: "1px solid rgba(16,185,129,0.18)",
                  }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f56" }} />
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ffbd2e" }} />
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#27c93f" }} />
                  <div
                    style={{
                      flex: 1,
                      background: "rgba(255,255,255,0.06)",
                      borderRadius: 4,
                      padding: "3px 10px",
                      fontSize: 10,
                      color: "rgba(255,255,255,0.35)",
                      marginLeft: 8,
                      textAlign: "center",
                      border: "1px solid rgba(16,185,129,0.12)",
                    }}
                  >
                    app.motionr.app
                  </div>
                </div>
                {/* Contenu — mini hero */}
                <div
                  style={{
                    background: "linear-gradient(180deg, #171311 0%, #110e0c 100%)",
                    padding: "24px 28px",
                    minHeight: 260,
                  }}
                >
                  {/* Mini nav */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 32,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 4,
                          background: accent,
                          boxShadow: `0 2px 8px ${accent}55`,
                        }}
                      />
                      <span style={{ fontSize: 10, fontWeight: 800, color: "#fff" }}>Motionr</span>
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                      {["Produit", "Tarifs", "FAQ"].map((n) => (
                        <span key={n} style={{ fontSize: 8, color: "rgba(255,255,255,0.3)" }}>
                          {n}
                        </span>
                      ))}
                    </div>
                    <div
                      style={{
                        background: accent,
                        borderRadius: 4,
                        padding: "3px 8px",
                        fontSize: 8,
                        color: "#fff",
                        fontWeight: 700,
                        boxShadow: `0 2px 8px ${accent}44`,
                      }}
                    >
                      Commencer
                    </div>
                  </div>
                  {/* Mini hero text */}
                  <div style={{ textAlign: "center", marginBottom: 20 }}>
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 900,
                        color: "#fff",
                        letterSpacing: "-0.04em",
                        lineHeight: 1.1,
                        marginBottom: 8,
                      }}
                    >
                      L&apos;IA qui transforme
                      <br />
                      tes mots en vidéos.
                    </div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginBottom: 16 }}>
                      Décris ton idée. Motionr génère le script, les animations et la voix.
                    </div>
                    {/* Mini prompt box */}
                    <div
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        borderRadius: 8,
                        padding: "10px 12px",
                        border: "1px solid rgba(16,185,129,0.22)",
                        boxShadow: "0 0 12px rgba(16,185,129,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        maxWidth: 300,
                        margin: "0 auto",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 8,
                          color: "rgba(255,255,255,0.3)",
                          fontStyle: "italic",
                        }}
                      >
                        Décris ta vidéo...
                      </span>
                      <div
                        style={{
                          background: accent,
                          borderRadius: 4,
                          padding: "3px 8px",
                          fontSize: 8,
                          color: "#fff",
                          fontWeight: 700,
                        }}
                      >
                        Générer →
                      </div>
                    </div>
                  </div>
                  {/* Mini vidéos placeholders */}
                  <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                    {[
                      { w: 42, h: 74 },
                      { w: 64, h: 36 },
                      { w: 42, h: 42 },
                      { w: 36, h: 64 },
                    ].map((v, i) => (
                      <div
                        key={i}
                        style={{
                          width: v.w,
                          height: v.h,
                          borderRadius: 6,
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(16,185,129,0.16)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                        }}
                      >
                        ▶
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mockup iPhone */}
            <div
              style={{
                position: "absolute",
                right: 8,
                bottom: 12,
                width: 124,
                background: "linear-gradient(180deg, #171311 0%, #110e0c 100%)",
                borderRadius: 26,
                border: "1px solid rgba(16,185,129,0.28)",
                padding: "10px 4px",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.05), 0 0 16px rgba(16,185,129,0.2), 0 20px 40px rgba(15,23,42,0.14)",
                zIndex: 2,
              }}
            >
              {/* Notch */}
              <div
                style={{
                  width: 46,
                  height: 7,
                  background: "rgba(0,0,0,0.35)",
                  borderRadius: 10,
                  margin: "0 auto 8px",
                }}
              />
              {/* Ecran */}
              <div
                style={{
                  background: "linear-gradient(180deg, #171311 0%, #110e0c 100%)",
                  borderRadius: 18,
                  height: 200,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 9,
                    background: accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 15,
                    fontWeight: 900,
                    color: "#fff",
                    boxShadow: `0 4px 12px ${accent}44`,
                  }}
                >
                  M
                </div>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#fff" }}>Motionr</div>
                <div
                  style={{
                    fontSize: 7,
                    color: "rgba(255,255,255,0.3)",
                    textAlign: "center",
                    padding: "0 12px",
                  }}
                >
                  Version mobile bientôt disponible
                </div>
              </div>
              {/* Home indicator */}
              <div
                style={{
                  width: 36,
                  height: 3,
                  background: "rgba(255,255,255,0.18)",
                  borderRadius: 10,
                  margin: "8px auto 0",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          background: "#ffffff",
          borderTop: "1px solid #f0f0f0",
          padding: "48px 60px 40px",
        }}
      >
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 36,
              gap: 40,
            }}
          >
            <div style={{ maxWidth: 280 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 7,
                    background: accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 900,
                    color: "#fff",
                    boxShadow: `0 2px 8px ${accent}44`,
                  }}
                >
                  M
                </div>
                <span style={{ fontSize: 15, fontWeight: 800, color: "#0a0a0a", letterSpacing: "-0.04em" }}>
                  Motionr
                </span>
              </div>
              <p style={{ ...cardBodyStyle, fontSize: 13, lineHeight: 1.65 }}>
                L&apos;IA qui transforme tes mots en vidéos motion design professionnelles.
              </p>
            </div>

            <div style={{ display: "flex", gap: 64 }}>
              <div>
                <div style={{ ...featureTagStyle, marginBottom: 14 }}>Produit</div>
                {[
                  { label: "Fonctionnalités", href: "#features" },
                  { label: "Tarifs", href: "#pricing" },
                  { label: "FAQ", href: "#faq" },
                  { label: "Dashboard", href: "/dashboard" },
                ].map((l) => (
                  <div key={l.label} style={{ marginBottom: 10 }}>
                    <a href={l.href} className="footer-link">
                      {l.label}
                    </a>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ ...featureTagStyle, marginBottom: 14 }}>Légal</div>
                {[
                  { label: "Confidentialité", href: "/privacy" },
                  { label: "CGU", href: "/terms" },
                  { label: "Mentions légales", href: "/mentions" },
                ].map((l) => (
                  <div key={l.label} style={{ marginBottom: 10 }}>
                    <Link href={l.href} className="footer-link">
                      {l.label}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid #f0f0f0",
              paddingTop: 22,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <div style={{ ...mutedMetaStyle }}>© 2024 Motionr. Tous droits réservés.</div>
            <div style={{ display: "flex", gap: 20 }}>
              {["Instagram", "Twitter / X", "LinkedIn"].map((s) => (
                <a key={s} href="#" className="footer-link" style={{ fontSize: 12 }}>
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
