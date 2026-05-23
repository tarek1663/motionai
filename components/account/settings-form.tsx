"use client";

import { useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { Check, LogOut, Sparkles, Trash2 } from "lucide-react";
import { colors } from "@/lib/colors";
import { VOICES, DURATIONS, FORMAT_OPTIONS } from "@/lib/dashboard/constants";
import { useOnboardingPrefs } from "@/hooks/use-onboarding-prefs";
import {
  PLAN_LIMITS,
  VISUAL_STYLES,
  type VisualStyle,
} from "@/lib/account/types";

const FREE_PLAN = "gratuit" as const;
const CREDITS_REMAINING = 3;
const CREDITS_TOTAL = PLAN_LIMITS[FREE_PLAN].credits;

export function SettingsForm() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { prefs, loading, saved, save } = useOnboardingPrefs();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [accentDraft, setAccentDraft] = useState<string | null>(null);

  const planInfo = PLAN_LIMITS[FREE_PLAN];
  const accentValue = accentDraft ?? prefs?.accent_color ?? colors.accent;

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await user?.delete();
      await signOut({ redirectUrl: "/login" });
    } catch {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading || !prefs) {
    return (
      <div className="account-loading">
        <div className="account-skeleton account-skeleton--title" />
        <div className="account-skeleton account-skeleton--card" />
        <div className="account-skeleton account-skeleton--card" />
        <div className="account-skeleton account-skeleton--card" />
      </div>
    );
  }

  const displayName =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "Utilisateur";
  const email = user?.primaryEmailAddress?.emailAddress || "";

  const commitAccent = (hex: string) => {
    const normalized = hex.startsWith("#") ? hex : `#${hex}`;
    if (/^#[0-9A-Fa-f]{6}$/.test(normalized)) {
      setAccentDraft(null);
      save({ accent_color: normalized });
    }
  };

  return (
    <div className="account-settings">
      <header className="account-header">
        <div>
          <h1 className="account-title">Paramètres</h1>
          <p className="account-subtitle">
            Gère ton compte et tes préférences de génération
          </p>
        </div>
        {saved && (
          <span className="account-saved-badge" role="status">
            <Check size={14} strokeWidth={2.5} />
            Sauvegardé ✓
          </span>
        )}
      </header>

      <section className="account-card">
        <h2 className="account-section-title">Profil</h2>
        <div className="account-profile-row">
          {user?.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.imageUrl} alt="" className="account-avatar" />
          ) : (
            <div
              className="account-avatar account-avatar--placeholder"
              style={{ background: colors.accentSubtle, color: colors.accent }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="account-profile-name">{displayName}</div>
            <div className="account-profile-email">{email}</div>
          </div>
        </div>
      </section>

      <section className="account-card">
        <h2 className="account-section-title">Mon plan</h2>
        <div className="account-plan-row">
          <div>
            <div
              className="account-plan-badge"
              style={{ background: colors.accentSubtle, color: colors.accent }}
            >
              {planInfo.label}
            </div>
            <p className="account-plan-credits">
              {CREDITS_REMAINING}/{CREDITS_TOTAL} crédits restants ce mois
            </p>
          </div>
          <button
            type="button"
            className="account-btn-accent"
            disabled
            title="Bientôt disponible"
          >
            <Sparkles size={16} strokeWidth={1.75} />
            Upgrader
          </button>
        </div>
        <div className="account-credits-bar">
          <div
            className="account-credits-fill"
            style={{
              width: `${(CREDITS_REMAINING / CREDITS_TOTAL) * 100}%`,
              background: colors.accent,
            }}
          />
        </div>
      </section>

      <section className="account-card">
        <h2 className="account-section-title">Préférences vidéo</h2>
        <div className="account-fields">
          <label className="account-field">
            <span className="account-label">Voix par défaut</span>
            <select
              className="account-select"
              value={prefs.default_voice_id}
              onChange={(e) => save({ default_voice_id: e.target.value })}
            >
              {VOICES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} — {v.style}
                </option>
              ))}
            </select>
          </label>

          <div className="account-field">
            <span className="account-label">Format par défaut</span>
            <div className="account-pill-group">
              {FORMAT_OPTIONS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`account-pill${prefs.default_format === f.id ? " active" : ""}`}
                  onClick={() => save({ default_format: f.id })}
                >
                  <span className="account-pill-label">{f.label}</span>
                  <span className="account-pill-desc">{f.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="account-field">
            <span className="account-label">Durée par défaut</span>
            <div className="account-pill-group">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  className={`account-pill account-pill--compact${prefs.default_duration === d ? " active" : ""}`}
                  onClick={() => save({ default_duration: d })}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="account-card">
        <h2 className="account-section-title">Marque</h2>
        <div className="account-fields">
          <label className="account-field">
            <span className="account-label">Couleur d&apos;accent par défaut</span>
            <div className="account-color-row">
              <input
                type="color"
                className="account-color-input"
                value={accentValue}
                onChange={(e) => {
                  setAccentDraft(e.target.value);
                  save({ accent_color: e.target.value });
                }}
              />
              <input
                type="text"
                className="account-input account-input--mono"
                value={accentValue}
                onChange={(e) => setAccentDraft(e.target.value)}
                onBlur={(e) => commitAccent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitAccent(accentValue);
                }}
                maxLength={7}
                spellCheck={false}
              />
              <div
                className="account-color-preview"
                style={{ background: accentValue }}
              />
            </div>
          </label>

          <div className="account-field">
            <span className="account-label">Style visuel préféré</span>
            <div className="account-style-grid">
              {VISUAL_STYLES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`account-style-card${prefs.visual_style === s.id ? " active" : ""}`}
                  onClick={() => save({ visual_style: s.id as VisualStyle })}
                >
                  <span className="account-style-label">{s.label}</span>
                  <span className="account-style-desc">{s.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="account-card account-card--danger">
        <h2 className="account-section-title">Compte</h2>
        <p className="account-danger-hint">
          La suppression est définitive — toutes tes vidéos et préférences seront
          effacées.
        </p>
        <div className="account-actions-row">
          <button
            type="button"
            className="account-btn-secondary"
            onClick={() => signOut({ redirectUrl: "/login" })}
          >
            <LogOut size={16} strokeWidth={1.75} />
            Déconnexion
          </button>
          <button
            type="button"
            className="account-btn-danger"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 size={16} strokeWidth={1.75} />
            Supprimer le compte
          </button>
        </div>
      </section>

      {showDeleteConfirm && (
        <div
          className="account-modal-overlay"
          role="presentation"
          onClick={() => !deleting && setShowDeleteConfirm(false)}
        >
          <div
            className="account-modal"
            role="dialog"
            aria-labelledby="delete-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="delete-title" className="account-modal-title">
              Supprimer ton compte ?
            </h3>
            <p className="account-modal-text">
              Cette action est irréversible. Toutes tes données seront
              supprimées.
            </p>
            <div className="account-modal-actions">
              <button
                type="button"
                className="account-btn-secondary"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
              >
                Annuler
              </button>
              <button
                type="button"
                className="account-btn-danger"
                onClick={handleDeleteAccount}
                disabled={deleting}
              >
                {deleting ? "Suppression…" : "Confirmer la suppression"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
