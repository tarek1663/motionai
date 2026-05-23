export default function CancelPage() {
  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a",
      fontFamily: "system-ui", color: "#ffffff",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: 24, textAlign: "center", padding: 40,
    }}>
      <div style={{ fontSize: 64 }}>↩️</div>
      <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.04em" }}>
        Paiement annulé
      </h1>
      <p style={{ color: "#555", fontSize: 16, maxWidth: 400 }}>
        Ton abonnement n&apos;a pas été modifié. Tu peux réessayer quand tu veux.
      </p>
      <div style={{ display: "flex", gap: 12 }}>
        <a href="/pricing" style={{
          padding: "14px 32px", background: "#ffffff", color: "#000",
          borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: "none",
        }}>
          Voir les tarifs
        </a>
        <a href="/dashboard" style={{
          padding: "14px 32px",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#ffffff", borderRadius: 12, fontSize: 15,
          fontWeight: 600, textDecoration: "none",
        }}>
          Dashboard
        </a>
      </div>
    </div>
  );
}
