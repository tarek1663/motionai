export default function TermsPage() {
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
          Conditions générales d&apos;utilisation
        </h1>
        {[
          { title: "Acceptation", content: "En utilisant MotionAI, vous acceptez ces conditions. Si vous n'acceptez pas, n'utilisez pas le service." },
          { title: "Service", content: "MotionAI est un outil de génération de vidéos par IA. Nous nous réservons le droit de modifier ou interrompre le service à tout moment." },
          { title: "Contenu", content: "Vous êtes responsable des prompts que vous soumettez. Il est interdit de générer du contenu illégal, offensant ou violant des droits tiers." },
          { title: "Propriété", content: "Les vidéos générées vous appartiennent. MotionAI conserve une licence non-exclusive pour améliorer le service." },
          { title: "Abonnements", content: "Les abonnements sont mensuels et se renouvellent automatiquement. Annulation possible à tout moment depuis votre compte." },
          { title: "Limitation", content: "MotionAI n'est pas responsable des dommages indirects liés à l'utilisation du service." },
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
