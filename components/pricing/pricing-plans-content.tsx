"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import type { CreditsInfo } from "@/lib/dashboard/credits";
import { posthog } from "@/lib/posthog";
import { cn } from "@/lib/utils";

const accent = "#ef4444";

const PLANS = [
  {
    id: "free",
    name: "Gratuit",
    price: { monthly: 0, yearly: 0 },
    videos: "3 vidéos/mois",
    features: ["3 vidéos par mois", "Qualité 1080p", "72+ animations", "Filigrane Motionr"],
    cta: "Commencer gratuitement",
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
  },
] as const;

const PLAN_ORDER = ["free", "starter", "pro", "business"];

type PricingPlansContentProps = {
  variant?: "standalone" | "embedded";
  credits?: CreditsInfo | null;
};

export function PricingPlansContent({
  variant = "standalone",
  credits,
}: PricingPlansContentProps) {
  const router = useRouter();
  const { user } = useUser();
  const embedded = variant === "embedded";
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");
  const [currentPlan, setCurrentPlan] = useState<string>(credits?.plan || "free");
  const [currentPlanOrder, setCurrentPlanOrder] = useState(0);
  const [loading, setLoading] = useState(false);
  const [wasSubscribed, setWasSubscribed] = useState(false);

  useEffect(() => {
    if (credits?.plan) setCurrentPlan(credits.plan);
  }, [credits?.plan]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/credits")
      .then((r) => r.json())
      .then((d) => {
        setCurrentPlan(d.plan || "free");
        setCurrentPlanOrder(d.planOrder || 0);
        setWasSubscribed(Boolean(d.stripe_customer_id) && (d.plan || "free") === "free");
      });
  }, [user]);

  const handlePlan = async (planId: string) => {
    if (planId === currentPlan) return;
    if (!user) {
      router.push(`/signup?plan=${planId}`);
      return;
    }
    if (planId === "free") return;

    const selectedPlan = PLANS.find((p) => p.id === planId);
    posthog.capture("plan_clicked", {
      plan: planId,
      price: selectedPlan?.price[billing] ?? 0,
    });

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, billing }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn("dash-pricing-plans", embedded && "dash-pricing-plans--embedded")}
    >
      <div className="dash-pricing-plans__header">
        {wasSubscribed && currentPlan === "free" && (
          <div className="dash-pricing-plans__welcome-back">
            <div>
              <div className="dash-pricing-plans__welcome-back-title">
                Content de te revoir !
              </div>
              <div className="dash-pricing-plans__welcome-back-desc">
                Reprends la ou tu t&apos;etais arrete — tes videos precedentes sont toujours
                disponibles.
              </div>
            </div>
            <button
              type="button"
              className="dash-pricing-plans__welcome-back-btn"
              onClick={async () => {
                const res = await fetch("/api/stripe/checkout", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ planId: "pro", billing: "monthly" }),
                });
                const data = await res.json();
                if (data.url) window.location.href = data.url;
              }}
            >
              Reprendre Pro →
            </button>
          </div>
        )}

        <div className="dash-pricing-plans__eyebrow">Tarifs</div>
        <h1 className={cn("dash-pricing-plans__title", embedded && "dash-pricing-plans__title--embedded")}>
          Simple et transparent.
        </h1>

        <div className="dash-pricing-plans__billing-toggle">
          {(["monthly", "yearly"] as const).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBilling(b)}
              className={cn(
                "dash-pricing-plans__billing-btn",
                billing === b && "is-active"
              )}
            >
              {b === "monthly" ? "Mensuel" : "Annuel -40%"}
            </button>
          ))}
        </div>
      </div>

      <div className="dash-pricing-plans__grid">
        {PLANS.map((plan) => {
          const planIdx = PLAN_ORDER.indexOf(plan.id);
          const isCurrent = plan.id === currentPlan;
          const isDowngrade = planIdx < currentPlanOrder;
          const isDisabled = isCurrent || isDowngrade;

          const getButtonLabel = () => {
            if (isCurrent) return "✓ Plan actuel";
            if (isDowngrade) return "Non disponible";
            if (plan.id === "free") return "Commencer gratuitement";
            return plan.cta;
          };

          return (
            <div
              key={plan.id}
              className={cn(
                "dash-pricing-plans__card",
                plan.popular && "is-popular",
                isCurrent && "is-current"
              )}
            >
              {plan.popular && !isCurrent && (
                <div className="dash-pricing-plans__badge">Populaire</div>
              )}
              {isCurrent && <div className="dash-pricing-plans__badge">✓ Plan actuel</div>}

              <div className="dash-pricing-plans__card-name">{plan.name}</div>
              <div className="dash-pricing-plans__card-price">
                {(plan.id === "starter" || plan.id === "pro") && (
                  <span className="dash-pricing-plans__strike-price">
                    {plan.id === "starter"
                      ? `${billing === "monthly" ? 23 : 13}€`
                      : `${billing === "monthly" ? 45 : 35}€`}
                  </span>
                )}
                {plan.price[billing] === 0 ? "0€" : `${plan.price[billing]}€`}
                <span className="dash-pricing-plans__card-price-suffix">/mois</span>
              </div>
              <div className="dash-pricing-plans__card-videos">{plan.videos}</div>

              <div className="dash-pricing-plans__features">
                {plan.features.map((f) => (
                  <div key={f} className="dash-pricing-plans__feature">
                    <span>✓</span>
                    {f}
                  </div>
                ))}
              </div>

              <button
                type="button"
                disabled={isDisabled || loading}
                onClick={() => void handlePlan(plan.id)}
                className={cn(
                  "dash-pricing-plans__cta",
                  isDisabled && "is-disabled",
                  plan.popular && !isDisabled && "is-popular-cta"
                )}
              >
                {getButtonLabel()}
              </button>
            </div>
          );
        })}
      </div>

      <div className="dash-pricing-plans__footer">
        Sans carte bancaire pour le plan gratuit · Annulation en 1 clic · Support email
      </div>
    </div>
  );
}

export default PricingPlansContent;
