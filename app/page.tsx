"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const accent = "#7C3AED";
const accentLight = "#F5F3FF";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const features = [
    {
      icon: "✨",
      title: "IA générative",
      desc: "Claude analyse ton message et génère un script professionnel optimisé pour le motion design.",
    },
    {
      icon: "🎬",
      title: "72+ animations",
      desc: "Choix automatique parmi plus de 72 types de scènes — texte, data, cinéma, social media.",
    },
    {
      icon: "🎙️",
      title: "Voix naturelle",
      desc: "ElevenLabs génère une voix off ultra-réaliste parfaitement synchronisée avec les animations.",
    },
    {
      icon: "⚡",
      title: "Rendu rapide",
      desc: "Ta vidéo est prête en 2 à 5 minutes. Télécharge en 1080p et partage instantanément.",
    },
    {
      icon: "✍️",
      title: "Ton propre script",
      desc: "Écris librement ton texte et l'IA le transforme en vidéo motion design professionnelle.",
    },
    {
      icon: "📱",
      title: "Multi-format",
      desc: "Génère en 9:16 pour les Reels, 16:9 pour YouTube ou 1:1 pour LinkedIn en un clic.",
    },
  ];

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

  return (
    <div
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
        background: "#FAFAF8",
        color: "#0a0a0a",
        overflowX: "hidden",
      }}
    >
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        .nav-link { color: #555; text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.15s; }
        .nav-link:hover { color: #0a0a0a; }
        .btn-primary { background: ${accent}; color: #fff; border: none; border-radius: 10px; padding: 12px 24px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.15s; text-decoration: none; display: inline-block; }
        .btn-primary:hover { background: #6D28D9; transform: translateY(-1px); box-shadow: 0 8px 24px ${accent}44; }
        .btn-secondary { background: #fff; color: #0a0a0a; border: 1.5px solid #e8e8e8; border-radius: 10px; padding: 12px 24px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.15s; text-decoration: none; display: inline-block; }
        .btn-secondary:hover { border-color: #ccc; transform: translateY(-1px); }
        .feature-card:hover { transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,0.08); }
        .plan-card:hover { transform: translateY(-4px); }
        .faq-item { border-bottom: 1px solid #f0f0f0; }
      `}</style>

      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 40px",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled ? "rgba(250,250,248,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(0,0,0,0.06)" : "none",
          transition: "all 0.3s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 900,
              color: "#fff",
              boxShadow: `0 2px 8px ${accent}44`,
            }}
          >
            M
          </div>
          <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.04em" }}>
            Motionr
          </span>
        </div>

        <nav style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <a href="#features" className="nav-link">
            Fonctionnalités
          </a>
          <a href="#how" className="nav-link">
            Comment ça marche
          </a>
          <a href="#pricing" className="nav-link">
            Tarifs
          </a>
          <a href="#faq" className="nav-link">
            FAQ
          </a>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link href="/login" className="btn-secondary" style={{ padding: "8px 18px" }}>
            Connexion
          </Link>
          <Link href="/signup" className="btn-primary" style={{ padding: "8px 18px" }}>
            Commencer gratuitement
          </Link>
        </div>
      </header>

      <section
        style={{
          paddingTop: 140,
          paddingBottom: 100,
          textAlign: "center",
          padding: "140px 40px 100px",
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
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
          <span>✨</span> 72+ animations motion design disponibles
        </div>

        <h1
          style={{
            fontSize: 72,
            fontWeight: 900,
            letterSpacing: "-0.05em",
            lineHeight: 1.05,
            marginBottom: 24,
            color: "#0a0a0a",
          }}
        >
          Transforme tes idées
          <br />
          en vidéos <span style={{ color: accent }}>motion design</span>
          <br />
          en quelques minutes.
        </h1>

        <p
          style={{
            fontSize: 20,
            color: "#666",
            lineHeight: 1.6,
            marginBottom: 40,
            maxWidth: 600,
            margin: "0 auto 40px",
          }}
        >
          Tape ton message. L&apos;IA génère le script, les animations, la voix et la
          musique. Ta vidéo 1080p est prête.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 48 }}>
          <Link href="/signup" className="btn-primary" style={{ fontSize: 16, padding: "14px 32px" }}>
            Commencer gratuitement →
          </Link>
          <Link href="/dashboard" className="btn-secondary" style={{ fontSize: 16, padding: "14px 32px" }}>
            Voir une démo
          </Link>
        </div>

        <div
          style={{
            fontSize: 13,
            color: "#aaa",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <span>⭐⭐⭐⭐⭐</span>
          <span>+1 000 créateurs font confiance à Motionr</span>
          <span>·</span>
          <span>Aucune carte requise</span>
        </div>
      </section>

      <section style={{ padding: "0 40px 100px", display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: "100%",
            maxWidth: 960,
            borderRadius: 24,
            background: "#fff",
            border: "1.5px solid #e8e8e8",
            boxShadow: "0 40px 120px rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              background: "#f5f5f5",
              borderBottom: "1px solid #e8e8e8",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f56" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#27c93f" }} />
            <div
              style={{
                flex: 1,
                background: "#ebebeb",
                borderRadius: 6,
                padding: "4px 12px",
                fontSize: 11,
                color: "#888",
                textAlign: "center",
              }}
            >
              app.motionr.app/dashboard
            </div>
          </div>
          <div
            style={{
              padding: 32,
              background: "#fafaf8",
              minHeight: 400,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ textAlign: "center", color: "#aaa" }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🎬</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#555" }}>
                Interface Motionr
              </div>
              <div style={{ fontSize: 13, marginTop: 4 }}>
                Générateur de vidéos motion design par IA
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" style={{ padding: "80px 40px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: accent,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Fonctionnalités
          </div>
          <h2
            style={{
              fontSize: 48,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
            }}
          >
            Tout ce dont tu as besoin
            <br />
            pour créer des vidéos pro.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {features.map((feature) => (
            <div
              key={feature.title}
              className="feature-card"
              style={{
                background: "#fff",
                borderRadius: 20,
                padding: "28px",
                border: "1.5px solid #e8e8e8",
                transition: "all 0.2s",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: accentLight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  marginBottom: 16,
                }}
              >
                {feature.icon}
              </div>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  marginBottom: 8,
                  letterSpacing: "-0.02em",
                }}
              >
                {feature.title}
              </h3>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how" style={{ padding: "80px 40px", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: accent,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Comment ça marche
          </div>
          <h2
            style={{
              fontSize: 48,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              marginBottom: 64,
            }}
          >
            3 étapes. C&apos;est tout.
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40 }}>
            {steps.map((step) => (
              <div key={step.num} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 48,
                    fontWeight: 900,
                    color: accentLight,
                    WebkitTextStroke: `2px ${accent}`,
                    marginBottom: 16,
                    letterSpacing: "-0.04em",
                  }}
                >
                  {step.num}
                </div>
                <h3
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    marginBottom: 8,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 40px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: accent,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Témoignages
          </div>
          <h2
            style={{
              fontSize: 48,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
            }}
          >
            Ils créent avec Motionr.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              style={{
                background: "#fff",
                borderRadius: 20,
                padding: "28px",
                border: "1.5px solid #e8e8e8",
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 16 }}>⭐⭐⭐⭐⭐</div>
              <p
                style={{
                  fontSize: 15,
                  color: "#333",
                  lineHeight: 1.7,
                  marginBottom: 20,
                  fontStyle: "italic",
                }}
              >
                "{testimonial.text}"
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
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{testimonial.name}</div>
                  <div style={{ fontSize: 12, color: "#aaa" }}>{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" style={{ padding: "80px 40px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: accent,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Tarifs
            </div>
            <h2
              style={{
                fontSize: 48,
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
                marginBottom: 24,
              }}
            >
              Simple et transparent.
            </h2>

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
                    boxShadow:
                      billing === option ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                  }}
                >
                  {option === "monthly" ? "Mensuel" : "Annuel"}
                  {option === "yearly" ? " -40%" : ""}
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
                  transition: "all 0.2s",
                  boxShadow: plan.popular ? `0 20px 60px ${accent}44` : "none",
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
                      background: "#ffd60a",
                      color: "#0a0a0a",
                      borderRadius: 100,
                      padding: "4px 14px",
                      fontSize: 11,
                      fontWeight: 800,
                    }}
                  >
                    ⭐ POPULAIRE
                  </div>
                )}
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{plan.name}</div>
                <div
                  style={{
                    fontSize: 42,
                    fontWeight: 900,
                    letterSpacing: "-0.04em",
                    marginBottom: 4,
                  }}
                >
                  {plan.price[billing] === 0 ? "0€" : `${plan.price[billing]}€`}
                  <span style={{ fontSize: 14, fontWeight: 400, opacity: 0.6 }}>/mois</span>
                </div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 24 }}>{plan.videos}</div>

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
                      style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}
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
                    transition: "all 0.15s",
                  }}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" style={{ padding: "80px 40px", maxWidth: 700, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: accent,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            FAQ
          </div>
          <h2
            style={{
              fontSize: 48,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
            }}
          >
            Questions fréquentes.
          </h2>
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
              <span style={{ fontSize: 16, fontWeight: 600, color: "#0a0a0a" }}>{faq.q}</span>
              <span
                style={{
                  fontSize: 20,
                  color: "#aaa",
                  transform: openFaq === index ? "rotate(45deg)" : "none",
                  transition: "transform 0.2s",
                }}
              >
                +
              </span>
            </button>
            {openFaq === index && (
              <p
                style={{
                  fontSize: 14,
                  color: "#666",
                  lineHeight: 1.7,
                  marginTop: 12,
                  paddingRight: 32,
                }}
              >
                {faq.a}
              </p>
            )}
          </div>
        ))}
      </section>

      <section style={{ padding: "80px 40px", textAlign: "center" }}>
        <div
          style={{
            maxWidth: 700,
            margin: "0 auto",
            background: "#fff",
            borderRadius: 24,
            padding: "64px 40px",
            border: "1.5px solid #e8e8e8",
            boxShadow: "0 20px 60px rgba(0,0,0,0.06)",
          }}
        >
          <h2
            style={{
              fontSize: 52,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            Prêt à créer ta première vidéo ?
          </h2>
          <p style={{ fontSize: 16, color: "#666", marginBottom: 32, lineHeight: 1.6 }}>
            Rejoins des milliers de créateurs qui utilisent Motionr pour produire du contenu
            vidéo professionnel en quelques minutes.
          </p>
          <Link href="/signup" className="btn-primary" style={{ fontSize: 16, padding: "16px 40px" }}>
            Commencer gratuitement →
          </Link>
          <div style={{ fontSize: 12, color: "#aaa", marginTop: 16 }}>
            Aucune carte bancaire requise · 3 vidéos gratuites
          </div>
        </div>
      </section>

      <footer
        style={{
          padding: "40px",
          borderTop: "1px solid #f0f0f0",
          background: "#fff",
        }}
      >
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
            <span style={{ fontSize: 14, fontWeight: 700 }}>Motionr</span>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            <Link href="/privacy" style={{ fontSize: 13, color: "#aaa", textDecoration: "none" }}>
              Confidentialité
            </Link>
            <Link href="/terms" style={{ fontSize: 13, color: "#aaa", textDecoration: "none" }}>
              CGU
            </Link>
            <Link href="/pricing" style={{ fontSize: 13, color: "#aaa", textDecoration: "none" }}>
              Tarifs
            </Link>
          </div>
          <div style={{ fontSize: 13, color: "#aaa" }}>© 2024 Motionr. Tous droits réservés.</div>
        </div>
      </footer>
    </div>
  );
}
