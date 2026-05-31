export default function CancelPage() {
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
          maxWidth: 560,
          textAlign: "center",
        }}
      >
      <div style={{ fontSize: 64 }}>↩️</div>
      <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.04em" }}>
        Paiement annulé
      </h1>
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, maxWidth: 400, margin: "12px auto 24px" }}>
        Ton abonnement n&apos;a pas été modifié. Tu peux réessayer quand tu veux.
      </p>
      <div style={{ display: "flex", gap: 12 }}>
        <a
          href="/pricing"
          style={{
            padding: "14px 32px",
            background: "#ef4444",
            color: "#fff",
            borderRadius: 10,
            fontSize: 15,
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Voir les tarifs
        </a>
        <a
          href="/dashboard"
          style={{
            padding: "14px 32px",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.7)",
            borderRadius: 10,
            fontSize: 15,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Dashboard
        </a>
      </div>
      </div>
    </div>
  );
}
