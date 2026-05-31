"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Download, FileText, type LucideIcon } from "lucide-react";
import { colors } from "@/lib/colors";

export type AccountInvoice = {
  id: string;
  date: number;
  amount: number;
  currency?: string;
  status?: string;
  pdf?: string | null;
  number?: string | null;
};

function AccountSectionTitle({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <h2 className="account-section-title">
      <Icon className="account-section-icon" size={14} strokeWidth={1.75} aria-hidden />
      {children}
    </h2>
  );
}

type Props = {
  plan?: string | null;
};

export function AccountInvoices({ plan }: Props) {
  const [invoices, setInvoices] = useState<AccountInvoice[]>([]);
  const [loading, setLoading] = useState(Boolean(plan && plan !== "free"));

  useEffect(() => {
    if (!plan || plan === "free") {
      setInvoices([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch("/api/stripe/invoices")
      .then((r) => r.json())
      .then((d) => setInvoices(d.invoices || []))
      .catch(() => setInvoices([]))
      .finally(() => setLoading(false));
  }, [plan]);

  if (!plan || plan === "free") return null;

  if (loading) {
    return (
      <section className="account-card">
        <AccountSectionTitle icon={FileText}>Factures</AccountSectionTitle>
        <div className="account-invoices-list">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="account-invoice-row account-invoice-row--loading">
              <div className="account-skeleton account-skeleton--invoice" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (invoices.length === 0) return null;

  return (
    <section className="account-card">
      <AccountSectionTitle icon={FileText}>Factures</AccountSectionTitle>
      <div className="account-invoices-list">
        {invoices.map((inv) => (
          <div key={inv.id} className="account-invoice-row">
            <div>
              <div className="account-invoice-number">{inv.number || inv.id}</div>
              <div className="account-invoice-date">
                {new Date(inv.date * 1000).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>
            <div className="account-invoice-meta">
              <div className="account-invoice-amount" style={{ color: colors.accent }}>
                {inv.amount}€
              </div>
              {inv.pdf && (
                <a
                  href={inv.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="account-invoice-pdf"
                >
                  <Download size={12} strokeWidth={1.75} />
                  PDF
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
