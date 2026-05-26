"use client";

import { type CSSProperties, useEffect, useState } from "react";
import Link from "next/link";

const accent = "#7C3AED";
const accentLight = "#F5F3FF";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [wordIndex, setWordIndex] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);
  const rotatingWords = ["prompts", "scripts", "idées", "mots"];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordVisible(false);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % rotatingWords.length);
        setWordVisible(true);
      }, 300);
    }, 2000);

    return () => clearInterval(interval);
  }, [rotatingWords.length]);

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
    fontSize: 48,
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
        background: "#FAFAF8",
        color: "#0a0a0a",
        overflowX: "hidden",
      }}
    >
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        .nav-link { text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.15s; }
        .btn-primary { background: ${accent}; color: #fff; border: none; border-radius: 12px; padding: 12px 24px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.15s; text-decoration: none; display: inline-block; }
        .btn-primary:hover { background: #6D28D9; transform: translateY(-1px); box-shadow: 0 8px 24px ${accent}44; }
        .btn-secondary { background: #fff; color: #0a0a0a; border: 1.5px solid #e8e8e8; border-radius: 12px; padding: 12px 24px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.15s; text-decoration: none; display: inline-block; }
        .btn-secondary:hover { border-color: #ccc; transform: translateY(-1px); }
        .plan-card { transition: all 0.2s; }
        .plan-card:hover { transform: translateY(-3px); }
        .faq-item { border-bottom: 1px solid #f0f0f0; }
      `}</style>

      <header
        style={{
          position: "fixed",
          top: 14,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 100,
          width: "min(1120px, calc(100% - 32px))",
          padding: "0 18px",
          height: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.94)",
          backdropFilter: "blur(14px)",
          border: "1px solid #e8e8e8",
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
          transition: "all 0.3s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "#0a0a0a",
            }}
          >
            Motionr
          </span>
        </div>

        <nav style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <a href="#features" className="nav-link" style={{ color: "#555" }}>
            Solutions
          </a>
          <a href="#pricing" className="nav-link" style={{ color: "#555" }}>
            Pricing
          </a>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link
            href="/login"
            style={{
              padding: "8px 12px",
              color: "#0a0a0a",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Connexion
          </Link>
          <Link
            href="/signup"
            style={{
              padding: "10px 16px",
              background: accent,
              color: "#ffffff",
              textDecoration: "none",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              boxShadow: "0 8px 24px rgba(124,58,237,0.16)",
            }}
          >
            Commencer
          </Link>
        </div>
      </header>

      <section
        aria-label="Hero"
        style={{
          minHeight: "52vh",
          background: "#ffffff",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <div
          style={{
            maxWidth: 980,
            margin: "0 auto",
            minHeight: "52vh",
            padding: "120px 40px 80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 900 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: accentLight,
                border: `1px solid ${accent}22`,
                borderRadius: 100,
                padding: "6px 16px",
                marginBottom: 32,
                fontSize: 13,
                fontWeight: 600,
                color: accent,
              }}
            >
              <span>✨</span> Vidéos motion design générées par IA
            </div>

            <h1
              style={{
                fontSize: 80,
                fontWeight: 900,
                letterSpacing: "-0.05em",
                lineHeight: 1.05,
                marginBottom: 20,
                color: "#0a0a0a",
                maxWidth: 800,
              }}
            >
              L&apos;IA qui transforme
              <br />
              tes{" "}
              <span
                style={{
                  display: "inline-block",
                  background: accent,
                  color: "#fff",
                  borderRadius: 12,
                  padding: "0 16px",
                  opacity: wordVisible ? 1 : 0,
                  transform: wordVisible ? "translateY(0)" : "translateY(8px)",
                  transition: "all 0.3s ease",
                }}
              >
                {rotatingWords[wordIndex]}
              </span>{" "}
              en{" "}
              <span
                style={{
                  background: `linear-gradient(135deg, ${accent}, #a855f7)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                vidéos.
              </span>
            </h1>

            <p
              style={{
                fontSize: 18,
                color: "#888",
                lineHeight: 1.7,
                marginBottom: 48,
                maxWidth: 520,
              }}
            >
              Décris ton idée en quelques mots. Motionr génère automatiquement
              le script, les animations et la voix.{" "}
              <span style={{ color: "#555", fontWeight: 500 }}>
                Ta vidéo 1080p est prête en minutes.
              </span>
            </p>
          </div>
        </div>
      </section>

      <section
        id="features"
        style={{
          padding: "70px 40px 70px",
          maxWidth: 980,
          margin: "0 auto",
          position: "relative",
          zIndex: 5,
        }}
      >
        <div
          style={{
            ...surfaceCardStyle,
            borderRadius: 28,
            padding: "40px 40px 44px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: accentLight,
              color: accent,
              border: `1px solid ${accent}18`,
              borderRadius: 999,
              padding: "8px 14px",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.04em",
              marginBottom: 18,
            }}
          >
            Nouveau projet
          </div>

          <h2 style={{ ...sectionTitleStyle, marginBottom: 14 }}>
            Prêt à générer ta première vidéo ?
          </h2>

          <p style={{ ...sectionBodyStyle, maxWidth: 560, margin: "0 auto 28px" }}>
            Connecte-toi, ouvre ton dashboard et lance ton premier rendu en quelques clics.
          </p>

          <Link
            href="/sign-in"
            className="btn-primary"
            style={{
              padding: "14px 28px",
              fontSize: 15,
              background: accent,
              boxShadow: "0 10px 28px rgba(124,58,237,0.16)",
            }}
          >
            Connexion puis dashboard
          </Link>
        </div>
      </section>

      <section id="how" style={{ padding: "94px 40px 88px", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={sectionEyebrowStyle}>Comment ça marche</div>
          <h2 style={{ ...sectionTitleStyle, marginBottom: 64 }}>
            3 étapes. C&apos;est tout.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 34 }}>
            {steps.map((step) => (
              <div key={step.num}>
                <div
                  style={{
                    fontSize: 52,
                    fontWeight: 700,
                    color: "transparent",
                    WebkitTextStroke: `1.5px ${accent}`,
                    marginBottom: 14,
                    letterSpacing: "-0.04em",
                  }}
                >
                  {step.num}
                </div>
                <h3
                  style={{
                    ...cardTitleStyle,
                    marginBottom: 8,
                  }}
                >
                  {step.title}
                </h3>
                <p style={cardBodyStyle}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "94px 40px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
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

      <section id="pricing" style={{ padding: "94px 40px", background: "#fff" }}>
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
                      background: "#F5F3FF",
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

      <section id="faq" style={{ padding: "100px 40px", maxWidth: 700, margin: "0 auto" }}>
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
