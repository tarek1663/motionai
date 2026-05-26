"use client";

import { type CSSProperties, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { BackgroundComponents } from "@/components/ui/background-components";

const accent = "#10B981";
const accentLight = "#ffffff";

export default function LandingPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [showProductMenu, setShowProductMenu] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
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

  const steps = [
    { num: "01", title: "Décris ton message" },
    { num: "02", title: "L'IA crée ta vidéo" },
    { num: "03", title: "Télécharge et partage" },
  ];

  const testimonials = [
    {
      name: "Marie L.",
      role: "Content Creator",
      text: "J'ai divisé mon temps de création par 10. Les vidéos sont bluffantes de qualité.",
      avatar: "ML",
    },
    {
      name: "Thomas B.",
      role: "Marketing Manager",
      text: "On produit 3x plus de contenu vidéo sans augmenter notre budget. Indispensable.",
      avatar: "TB",
    },
    {
      name: "Sophie M.",
      role: "Entrepreneur",
      text: "Le meilleur outil que j'ai utilisé cette année. Simple, rapide, professionnel.",
      avatar: "SM",
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
      price: { monthly: 23, yearly: 13 },
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
      price: { monthly: 45, yearly: 35 },
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
        .plan-card { transition: all 0.2s; }
        .plan-card:hover { transform: translateY(-3px); }
        .faq-item { border-bottom: 1px solid #f0f0f0; }
      `}</style>

      <header
        style={{
          position: "fixed",
          top: 0,
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
            paddingTop: 108,
            paddingBottom: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
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
                margin: "0 auto 8px",
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
                  marginTop: 18,
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
                  marginTop: 18,
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
            </div>
          </div>
        </div>
      </section>

      <div
        style={{
          background: "#0a0a0a",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "24px 0",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 120,
            background: "linear-gradient(90deg, #0a0a0a, transparent)",
            zIndex: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 120,
            background: "linear-gradient(270deg, #0a0a0a, transparent)",
            zIndex: 2,
          }}
        />

        <div
          style={{
            textAlign: "center",
            fontSize: 11,
            fontWeight: 500,
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          Parfait pour tous vos réseaux
        </div>

        <style>{`
          @keyframes social-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .social-scroll-track {
            display: flex;
            animation: social-scroll 20s linear infinite;
            width: max-content;
          }
          .social-scroll-track:hover {
            animation-play-state: paused;
          }
        `}</style>

        <div style={{ overflow: "hidden" }}>
          <div className="social-scroll-track">
            {[
              { name: "Instagram", icon: "📸" },
              { name: "TikTok", icon: "🎵" },
              { name: "YouTube", icon: "▶️" },
              { name: "LinkedIn", icon: "💼" },
              { name: "Twitter / X", icon: "𝕏" },
              { name: "Facebook", icon: "👥" },
              { name: "Pinterest", icon: "📌" },
              { name: "Snapchat", icon: "👻" },
              { name: "Reels", icon: "🎬" },
              { name: "Shorts", icon: "⚡" },
              { name: "Instagram", icon: "📸" },
              { name: "TikTok", icon: "🎵" },
              { name: "YouTube", icon: "▶️" },
              { name: "LinkedIn", icon: "💼" },
              { name: "Twitter / X", icon: "𝕏" },
              { name: "Facebook", icon: "👥" },
              { name: "Pinterest", icon: "📌" },
              { name: "Snapchat", icon: "👻" },
              { name: "Reels", icon: "🎬" },
              { name: "Shorts", icon: "⚡" },
            ].map((item, i) => (
              <div
                key={`${item.name}-${i}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 28px",
                  borderRight: "1px solid rgba(255,255,255,0.06)",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.35)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

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
              border: "1.5px dashed #d9d9d9",
              background: "#fafafa",
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
                maxWidth: 640,
                margin: "0 auto 14px",
              }}
            >
              La création vidéo, enfin accessible à tous.
            </h2>
            <p
              style={{
                ...sectionBodyStyle,
                maxWidth: 640,
                margin: "0 auto",
                color: "#6F6862",
              }}
            >
              Compare le flux classique, lent et coûteux, avec une production pensée pour
              aller de l&apos;idée à la vidéo publiable en quelques minutes.
            </p>
          </div>

          <div
            style={{
              position: "relative",
              borderRadius: 28,
              overflow: "hidden",
              border: "1px solid rgba(23,19,17,0.08)",
              background: "#ffffff",
              boxShadow: "0 24px 64px rgba(24,19,15,0.06)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                alignItems: "stretch",
              }}
            >
              <div
                style={{
                  padding: "40px 36px 36px",
                  background: "#ffffff",
                  borderRight: "1px solid rgba(23,19,17,0.06)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    color: "#171311",
                    fontSize: 16,
                    fontWeight: 700,
                    marginBottom: 28,
                    letterSpacing: "-0.02em",
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

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    "Faire appel à une agence vidéo coûteuse",
                    "Attendre des jours avant d'avoir un résultat",
                    "Multiplier les allers-retours avec un prestataire",
                    "Avoir besoin de compétences techniques",
                    "Produire un seul format à la fois",
                    "Réserver la vidéo aux plus gros budgets",
                  ].map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 14,
                        padding: "14px 0",
                        borderBottom:
                          i === 5 ? "none" : "1px solid rgba(23,19,17,0.06)",
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
                          color: "#8A837C",
                          lineHeight: 1.55,
                        }}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  padding: "40px 36px 36px",
                  background: "#ffffff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    color: "#171311",
                    fontSize: 16,
                    fontWeight: 700,
                    marginBottom: 28,
                    letterSpacing: "-0.02em",
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

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    {
                      title: "Vidéo pro générée en quelques minutes",
                      desc: "De l'idée à la vidéo publiable sans intermédiaire.",
                    },
                    {
                      title: "Script, animations et voix automatiques",
                      desc: "L'IA gère tout de A à Z pour toi.",
                    },
                    {
                      title: "Résultat 1080p dès la première génération",
                      desc: "Moins d'ajustements, plus de vitesse.",
                    },
                    {
                      title: "Zéro compétence technique requise",
                      desc: "Si tu peux écrire, tu peux créer.",
                    },
                    {
                      title: "9:16, 16:9 et 1:1 en un clic",
                      desc: "Tous les formats pour tous les réseaux.",
                    },
                    {
                      title: "Accessible dès 0€",
                      desc: "Commence gratuitement, sans carte bancaire.",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 14,
                        padding: "14px 16px",
                        borderRadius: 18,
                        background: "#ffffff",
                        border: "1px solid rgba(23,19,17,0.06)",
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
                            fontSize: 15,
                            fontWeight: 600,
                            color: "#171311",
                            lineHeight: 1.45,
                            marginBottom: 3,
                          }}
                        >
                          {item.title}
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            color: "#8A837C",
                            lineHeight: 1.55,
                          }}
                        >
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <section style={{ padding: "84px 40px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={sectionEyebrowStyle}>Témoignages</div>
          <h2 style={sectionTitleStyle}>Ils créent avec Motionr.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              style={{
                ...surfaceCardStyle,
                borderRadius: 22,
                padding: "26px",
              }}
            >
              <div style={{ fontSize: 16, marginBottom: 16, letterSpacing: "0.08em", color: accent }}>
                ★★★★★
              </div>
              <p
                style={{
                  ...sectionBodyStyle,
                  fontSize: 15,
                  color: "#666",
                  marginBottom: 20,
                  fontStyle: "italic",
                }}
              >
                &quot;{testimonial.text}&quot;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: `${accent}22`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    color: accent,
                  }}
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1f2937" }}>
                    {testimonial.name}
                  </div>
                  <div style={mutedMetaStyle}>{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" style={{ padding: "84px 40px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={sectionEyebrowStyle}>Tarifs</div>
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
                  background: plan.popular ? accent : "#fff",
                  border: plan.popular ? "none" : "1.5px solid #e8e8e8",
                  color: plan.popular ? "#fff" : "#0a0a0a",
                  boxShadow: plan.popular
                    ? `0 20px 60px ${accent}33`
                    : "0 14px 40px rgba(15,23,42,0.03)",
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
                    fontSize: 42,
                    fontWeight: 700,
                    letterSpacing: "-0.045em",
                    marginBottom: 4,
                  }}
                >
                  {plan.price[billing] === 0 ? "0€" : `${plan.price[billing]}€`}
                  <span style={{ fontSize: 14, fontWeight: 400, opacity: 0.6 }}>/mois</span>
                </div>
                <div style={{ ...mutedMetaStyle, opacity: 0.8, marginBottom: 24 }}>{plan.videos}</div>
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
                    padding: "12px",
                    borderRadius: 10,
                    background: plan.popular ? "#fff" : accent,
                    color: plan.popular ? accent : "#fff",
                    fontWeight: 700,
                    fontSize: 14,
                    textDecoration: "none",
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

      <section style={{ padding: "76px 40px", textAlign: "center" }}>
        <div
          style={{
            ...surfaceCardStyle,
            maxWidth: 700,
            margin: "0 auto",
            borderRadius: 24,
            padding: "64px 40px",
          }}
        >
          <h2
            style={{
              ...sectionTitleStyle,
              marginBottom: 16,
            }}
          >
            Prêt à créer ta première vidéo ?
          </h2>
          <p style={{ ...sectionBodyStyle, marginBottom: 32 }}>
            Rejoins des milliers de créateurs qui utilisent Motionr pour produire du contenu
            vidéo professionnel en quelques minutes.
          </p>
          <Link href="/signup" className="btn-primary" style={{ fontSize: 16, padding: "16px 40px" }}>
            Commencer gratuitement →
          </Link>
          <div style={{ ...mutedMetaStyle, marginTop: 16 }}>
            Aucune carte bancaire requise · 3 vidéos gratuites
          </div>
        </div>
      </section>

      <footer style={{ padding: "42px 40px", borderTop: "1px solid #f0f0f0", background: "#fff" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                background: accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 900,
                color: "#fff",
              }}
            >
              M
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#1f2937", letterSpacing: "-0.02em" }}>
              Motionr
            </span>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            <Link href="/privacy" style={{ fontSize: 13, color: "#888", textDecoration: "none", fontWeight: 500 }}>
              Confidentialité
            </Link>
            <Link href="/terms" style={{ fontSize: 13, color: "#888", textDecoration: "none", fontWeight: 500 }}>
              CGU
            </Link>
            <Link href="/pricing" style={{ fontSize: 13, color: "#888", textDecoration: "none", fontWeight: 500 }}>
              Tarifs
            </Link>
          </div>
          <div style={{ fontSize: 13, color: "#aaa", fontWeight: 500 }}>
            © 2024 Motionr. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
