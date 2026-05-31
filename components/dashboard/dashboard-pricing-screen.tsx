"use client";

import { PricingPlansContent } from "@/components/pricing/pricing-plans-content";
import type { CreditsInfo } from "@/lib/dashboard/credits";

type Props = {
  credits: CreditsInfo | null;
};

export function DashboardPricingScreen({ credits }: Props) {
  return (
    <div className="dash-pricing-screen">
      <PricingPlansContent variant="embedded" credits={credits} />
    </div>
  );
}
