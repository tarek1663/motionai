export default function SuccessPage() {
  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a",
      fontFamily: "system-ui", color: "#ffffff",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: 24, textAlign: "center", padding: 40,
    }}>
      <div style={{ fontSize: 64 }}>🎉</div>
      <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.04em" }}>
        Paiement réussi !
      </h1>
      <p style={{ color: "#555", fontSize: 16, maxWidth: 400 }}>
        Ton abonnement est actif. Tu peux maintenant générer des vidéos sans limite.
      </p>
      <a href="/dashboard" style={{
        padding: "14px 32px", background: "#ffffff", color: "#000",
        borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: "none",
      }}>
        Aller au dashboard →
      </a>
    </div>
  );
}
