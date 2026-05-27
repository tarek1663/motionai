export default function SuccessPage() {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 44px)",
        background: "#0a0a0a",
        fontFamily: "inherit",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
      }}
    >
      <div
        style={{
          background: "#161616",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20,
          padding: "36px 32px",
          maxWidth: 520,
          textAlign: "center",
        }}
      >
      <div style={{ fontSize: 64 }}>🎉</div>
      <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.04em" }}>
        Paiement réussi !
      </h1>
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, maxWidth: 400, margin: "12px auto 24px" }}>
        Ton abonnement est actif. Tu peux maintenant générer des vidéos sans limite.
      </p>
      <a
        href="/dashboard"
        style={{
          display: "inline-block",
          padding: "14px 32px",
          background: "#10B981",
          color: "#fff",
          borderRadius: 10,
          fontSize: 15,
          fontWeight: 700,
          textDecoration: "none",
        }}
      >
        Aller au dashboard →
      </a>
      </div>
    </div>
  );
}
