"use client";

import { type CSSProperties, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
    {
      num: "01",
      title: "Décris ton message",
      desc: "Tape ton prompt ou écris ton script librement. L'IA comprend tout.",
    },
    {
      num: "02",
      title: "L'IA crée ta vidéo",
      desc: "Script, animations, voix, musique — tout est généré automatiquement.",
    },
    {
      num: "03",
      title: "Télécharge et partage",
      desc: "Ta vidéo 1080p est prête en quelques minutes. Prêt à publier.",
    },
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
                      href: "#features",
                    },
                    {
                      icon: "📱",
                      title: "Multi-format",
                      desc: "9:16 · 16:9 · 1:1",
                      href: "#features",
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
                      href: "#features",
                    },
                    {
                      icon: "⚡",
                      title: "Rendu rapide",
                      desc: "Vidéo 1080p en 2-5 minutes",
                      href: "#features",
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
                color: "#6F6862",
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
                  background: "#ffffff",
                  borderRadius: 18,
                  border: "1px solid rgba(23,19,17,0.06)",
                  boxShadow: "0 14px 34px rgba(24,19,15,0.08)",
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

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  marginTop: 18,
                  flexWrap: "wrap",
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
                    background: "#ffffff",
                    color: "#0a0a0a",
                    border: "none",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "inherit",
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
                    background: "rgba(23,19,17,0.04)",
                    color: "#171311",
                    textDecoration: "none",
                    fontSize: 14,
                    fontWeight: 600,
                    border: "1px solid rgba(23,19,17,0.08)",
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

      <section id="features" style={{ padding: "120px 60px", background: "#0f0f0f" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: 80 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#10B981",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Fonctionnalités
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
              }}
            >
              <h2
                style={{
                  fontSize: 52,
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.05,
                  color: "#ffffff",
                  maxWidth: 500,
                }}
              >
                Tout ce dont tu as besoin pour créer.
              </h2>
              <p
                style={{
                  fontSize: 15,
                  color: "rgba(255,255,255,0.4)",
                  lineHeight: 1.7,
                  maxWidth: 320,
                  marginBottom: 4,
                }}
              >
                De l&apos;idée à la vidéo publiable, Motionr gère tout automatiquement.
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
            <div
              style={{
                gridColumn: "span 2",
                background: "#161616",
                borderRadius: 20,
                padding: "40px",
                border: "1px solid rgba(255,255,255,0.06)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -60,
                  right: -60,
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(16,185,129,0.08), transparent)",
                }}
              />
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 11,
                  background: "rgba(16,185,129,0.12)",
                  border: "1px solid rgba(16,185,129,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  marginBottom: 20,
                }}
              >
                ✨
              </div>
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: "-0.03em",
                  marginBottom: 10,
                }}
              >
                Génération par IA
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.4)",
                  lineHeight: 1.7,
                  maxWidth: 400,
                }}
              >
                Claude analyse ton message et génère automatiquement un script
                professionnel, choisit les meilleures animations et synchronise
                parfaitement la voix. Zéro compétence requise.
              </p>
              <div
                style={{
                  marginTop: 28,
                  padding: "14px 16px",
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.06)",
                  fontSize: 13,
                  color: "rgba(255,255,255,0.3)",
                  fontStyle: "italic",
                }}
              >
                &quot;Présente mon application de fitness...&quot;
                <span
                  style={{
                    color: "#10B981",
                    marginLeft: 8,
                    fontStyle: "normal",
                  }}
                >
                  → Vidéo générée ✓
                </span>
              </div>
            </div>

            <div
              style={{
                background: "#161616",
                borderRadius: 20,
                padding: "40px",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 11,
                  background: "rgba(16,185,129,0.12)",
                  border: "1px solid rgba(16,185,129,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  marginBottom: 20,
                }}
              >
                ✍️
              </div>
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: "-0.03em",
                  marginBottom: 10,
                }}
              >
                Mode Script
              </h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
                Écris librement ton texte. L&apos;IA le découpe et crée une vidéo motion
                design avec ton contenu exact.
              </p>
            </div>

            <div
              style={{
                background: "#161616",
                borderRadius: 20,
                padding: "40px",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 11,
                  background: "rgba(16,185,129,0.12)",
                  border: "1px solid rgba(16,185,129,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  marginBottom: 20,
                }}
              >
                🎬
              </div>
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: "-0.03em",
                  marginBottom: 10,
                }}
              >
                72+ animations
              </h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
                Texte cinétique, graphiques de données, effets cinéma, social media,
                choisies automatiquement selon ton contenu.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 20 }}>
                {["Kinetic", "Hologram", "Counter", "Matrix", "Aurora"].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: "3px 10px",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 100,
                      fontSize: 11,
                      color: "rgba(255,255,255,0.4)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div
              style={{
                gridColumn: "span 2",
                background: "#161616",
                borderRadius: 20,
                padding: "40px",
                border: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                gap: 40,
                alignItems: "center",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 11,
                    background: "rgba(16,185,129,0.12)",
                    border: "1px solid rgba(16,185,129,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    marginBottom: 20,
                  }}
                >
                  🎙️
                </div>
                <h3
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#fff",
                    letterSpacing: "-0.03em",
                    marginBottom: 10,
                  }}
                >
                  Voix naturelle
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: "rgba(255,255,255,0.4)",
                    lineHeight: 1.7,
                  }}
                >
                  ElevenLabs génère une voix off ultra-réaliste parfaitement
                  synchronisée frame par frame avec les animations.
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 3, height: 60 }}>
                {Array.from({ length: 24 }, (_, i) => (
                  <div
                    key={i}
                    style={{
                      width: 3,
                      borderRadius: 3,
                      height: `${20 + Math.abs(Math.sin(i * 0.8)) * 40}px`,
                      background:
                        i % 3 === 0 ? "#10B981" : "rgba(255,255,255,0.1)",
                    }}
                  />
                ))}
              </div>
            </div>

            <div
              style={{
                background: "#161616",
                borderRadius: 20,
                padding: "40px",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 11,
                  background: "rgba(16,185,129,0.12)",
                  border: "1px solid rgba(16,185,129,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  marginBottom: 20,
                }}
              >
                📱
              </div>
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: "-0.03em",
                  marginBottom: 10,
                }}
              >
                Multi-format
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.4)",
                  lineHeight: 1.7,
                  marginBottom: 20,
                }}
              >
                Génère en 9:16 pour les Reels, 16:9 pour YouTube ou 1:1 pour LinkedIn.
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                {[
                  { label: "9:16", w: 28, h: 50 },
                  { label: "1:1", w: 40, h: 40 },
                  { label: "16:9", w: 56, h: 32 },
                ].map((fmt) => (
                  <div
                    key={fmt.label}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <div
                      style={{
                        width: fmt.w,
                        height: fmt.h,
                        border: "1.5px solid rgba(16,185,129,0.4)",
                        borderRadius: 5,
                        background: "rgba(16,185,129,0.06)",
                      }}
                    />
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>
                      {fmt.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                background: "#161616",
                borderRadius: 20,
                padding: "40px",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 11,
                  background: "rgba(16,185,129,0.12)",
                  border: "1px solid rgba(16,185,129,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  marginBottom: 20,
                }}
              >
                ⚡
              </div>
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: "-0.03em",
                  marginBottom: 10,
                }}
              >
                Rendu rapide
              </h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
                Ta vidéo 1080p est prête en 2 à 5 minutes. Télécharge et publie
                instantanément.
              </p>
              <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
                {[
                  { v: "2-5", u: "minutes" },
                  { v: "1080p", u: "qualité" },
                ].map((s) => (
                  <div key={s.v}>
                    <div
                      style={{
                        fontSize: 24,
                        fontWeight: 900,
                        color: "#10B981",
                        letterSpacing: "-0.04em",
                      }}
                    >
                      {s.v}
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
                      {s.u}
                    </div>
                  </div>
                ))}
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
              border: "1.5px dashed #d9d9d9",
              background: "#fafafa",
            }}
          />
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
