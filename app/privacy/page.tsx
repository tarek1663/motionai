export default function PrivacyPage() {
  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a",
      fontFamily: "system-ui", color: "#ffffff",
      padding: "80px 40px",
    }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <a href="/" style={{
          color: "#555", textDecoration: "none", fontSize: 14,
          display: "block", marginBottom: 40,
        }}>← Accueil</a>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 40, letterSpacing: "-0.04em" }}>
          Politique de confidentialité
        </h1>
        {[
          { title: "Données collectées", content: "Nous collectons votre adresse email, les prompts que vous soumettez, et les vidéos générées pour vous fournir le service." },
          { title: "Utilisation des données", content: "Vos données sont utilisées uniquement pour générer vos vidéos et améliorer le service. Elles ne sont jamais vendues à des tiers." },
          { title: "Stockage", content: "Les vidéos sont stockées de façon sécurisée et supprimées sur demande. Vous pouvez supprimer votre compte à tout moment." },
          { title: "Cookies", content: "Nous utilisons des cookies essentiels pour l'authentification. Pas de cookies publicitaires." },
          { title: "Contact", content: "Pour toute question : contact@motionai.app" },
        ].map(section => (
          <div key={section.title} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{section.title}</h2>
            <p style={{ color: "#555", lineHeight: 1.7, fontSize: 15 }}>{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
