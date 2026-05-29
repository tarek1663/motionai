import Anthropic from "@anthropic-ai/sdk";
import type { PhraseTimestamp } from "@/lib/elevenlabs";
import { buildPremiumSceneSystemPrompt, MOTION_GOLDEN_RULES } from "@/lib/prompts/motion-scenes-system";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

type VoiceTextJson = { color?: string; voice?: string };

export type MotionScene = Record<string, unknown> & {
  type?: string;
  text?: string;
  text2?: string;
  photoQuery?: string;
  photoUrl?: string;
  _duration?: number;
};

// Claude détecte lui-même la couleur — on garde juste les fonds
type BrandColors = {
  accent: string;
  bgLight: string;
};

const DEFAULT_COLORS: BrandColors = {
  accent: "#ffffff",
  bgLight: "#ffffff",
};

const DEFAULT_BG_ACCENT = "#050a18";

export type VideoFormat = {
  id: string;
  name: string;
  toneInstructions: string;
  structureInstructions: string;
  sceneTypes: string;
  voiceStyle: string;
};

function detectVideoFormat(prompt: string): VideoFormat {
  const p = prompt.toLowerCase();

  // ── ÉDUCATIF ──────────────────────────────────────────────
  if (p.match(/explique|comment|pourquoi|qu'est.ce|fonctionn|comprendre|apprendre|savoir|définition|principe/))
    return {
      id: "educatif",
      name: "Éducatif",
      toneInstructions: "Ton pédagogique et clair. Progression logique du simple au complexe. Vulgarisation sans être condescendant.",
      structureInstructions: "Structure: 1) Accroche question 2) Définition simple 3) Explication étape par étape 4) Exemple concret 5) Résumé mémorable",
      sceneTypes: "sentence (questions), word (concepts clés), counter (chiffres), split (définition + exemple), chart (progression), card (résumé)",
      voiceStyle: "Ton enseignant passionné. Phrases claires. Questions rhétoriques. Analogies simples.",
    };

  // ── STORYTELLING ──────────────────────────────────────────
  if (p.match(/histoire|story|raconte|parcours|journey|origine|naissance|créat|fondation|début|naquit/))
    return {
      id: "storytelling",
      name: "Storytelling",
      toneInstructions: "Ton narratif et émotionnel. Tension dramatique. Moments humains. Progression chronologique.",
      structureInstructions: "Structure: 1) Situation initiale 2) Déclencheur 3) Obstacles/défis 4) Tournant décisif 5) Résolution/impact",
      sceneTypes: "sentence (narration), reveal (moments clés), counter (dates/chiffres), split (avant/après), zoompunch (révélations)",
      voiceStyle: "Voix narratrice posée. Phrases courtes pour les moments forts. Rythme qui monte en tension.",
    };

  // ── NEWS / ACTUALITÉ ──────────────────────────────────────
  if (p.match(/news|actualité|résultat|bilan|rapport|annonce|vient de|aujourd'hui|cette semaine|2024|2025|2026/))
    return {
      id: "news",
      name: "News",
      toneInstructions: "Ton factuel et neutre. Journalistique. Chiffres précis. Pas d'opinion. Informer avant tout.",
      structureInstructions: "Structure: 1) Titre accrocheur 2) Le fait principal 3) Chiffres clés 4) Contexte/comparaison 5) Implications",
      sceneTypes: "sentence (titres), counter (chiffres précis), floatstats (3 stats), chart (évolution), split (comparaison), card (contexte)",
      voiceStyle: "Voix neutre et précise. Chiffres factuels. Pas de superlatifs. Style Breaking News.",
    };

  // ── MOTIVATION ───────────────────────────────────────────
  if (p.match(/motivat|inspir|réussir|success|entrepreneur|objectif|but|rêve|dream|challenge|défi|mindset|mental/))
    return {
      id: "motivation",
      name: "Motivation",
      toneInstructions: "Ton énergique et inspirant. Phrases courtes et percutantes. Appel à l'action direct. Émotion forte.",
      structureInstructions: "Structure: 1) Accroche choc 2) Le problème commun 3) La vérité qui change tout 4) Les preuves 5) L'appel à l'action",
      sceneTypes: "glitch (accroche choc), word (mots d'impact), kinetic (série de mots forts), counter (preuves), zoompunch (révélation), cta (action)",
      voiceStyle: "Voix directe et urgente. Phrases de 3-5 mots. Impératifs. Répétitions intentionnelles. Rythme rapide.",
    };

  // ── TOP LISTE ────────────────────────────────────────────
  if (p.match(/top|liste|rang|classement|meilleur|raison|conseil|astuce|secret|étape|fait|choses/))
    return {
      id: "topliste",
      name: "Top Liste",
      toneInstructions: "Ton direct et structuré. Chaque item est une révélation. Suspense entre les items. Dernier item le plus fort.",
      structureInstructions: "Structure: 1) Accroche du sujet 2) Item N à 1 (du moins au plus impactant) 3) Récap mémorable",
      sceneTypes: "sentence (intro), reveal (chaque item), counter (chiffres associés), split (item + explication), zoompunch (item final)",
      voiceStyle: "Phrases numérotées. Suspense avant chaque révélation. Crescendo vers le dernier item.",
    };

  // ── PITCH INVESTISSEUR ────────────────────────────────────
  if (p.match(/invest|startup|pitch|lever|funding|valuation|marché|opportunité|scalable|revenue|mrr|arr/))
    return {
      id: "pitch",
      name: "Pitch Investisseur",
      toneInstructions: "Ton professionnel et confiant. Données précises. Vision ambitieuse mais réaliste. Opportunité claire.",
      structureInstructions: "Structure: 1) Le problème (marché) 2) La solution 3) Traction/preuves 4) Chiffres clés 5) La vision 6) L'appel",
      sceneTypes: "sentence (problème), floatstats (3 métriques clés), counter (traction), chart (croissance), card (vision), cta (appel)",
      voiceStyle: "Voix assurée. Chiffres précis avec contexte. Vocabulaire business. Pas de superlatifs vides.",
    };

  // ── COMPARATIF ────────────────────────────────────────────
  if (p.match(/vs|versus|compar|différence|mieux|meilleur entre|ou bien|plutôt|contre/))
    return {
      id: "comparatif",
      name: "Comparatif",
      toneInstructions: "Ton analytique et équilibré. Critères objectifs. Verdict clair à la fin. Pas de parti pris apparent.",
      structureInstructions: "Structure: 1) Les deux sujets présentés 2) Critère 1 comparé 3) Critère 2 comparé 4) Critère 3 comparé 5) Verdict final",
      sceneTypes: "sentence (intro), split (critère A vs B), floatstats (scores), chart (comparaison), zoompunch (verdict), cta (conclusion)",
      voiceStyle: "Voix neutre. Structure symétrique. Verdict tranché mais justifié.",
    };

  // ── BIOGRAPHIE ────────────────────────────────────────────
  if (p.match(/biograph|vie de|portrait|qui est|fondateur|ceo|pdg|président|personnage|icon/))
    return {
      id: "biographie",
      name: "Biographie",
      toneInstructions: "Ton admiratif mais factuel. Dates et faits précis. Moments humains. Héritage et impact.",
      structureInstructions: "Structure: 1) Qui est-il/elle 2) Origines 3) Tournant décisif 4) Accomplissements majeurs 5) Héritage/impact",
      sceneTypes: "sentence (intro), reveal (dates/moments), counter (chiffres vie), split (avant/après tournant), card (accomplissements), cta (héritage)",
      voiceStyle: "Narration respectueuse. Dates précises. Anecdotes révélatrices. Rythme posé.",
    };

  // ── FUTUR / VISION ────────────────────────────────────────
  if (p.match(/futur|avenir|2030|2050|tendance|prédiction|demain|révolution|changement|disruption|vision/))
    return {
      id: "futur",
      name: "Futur / Vision",
      toneInstructions: "Ton visionnaire et intrigant. Questions ouvertes. Chiffres projetés. Sentiment d'urgence et d'opportunité.",
      structureInstructions: "Structure: 1) Le monde aujourd'hui 2) Le signal faible 3) La projection 4) L'impact massif 5) Ce que ça change pour nous",
      sceneTypes: "sentence (état actuel), counter (projection chiffrée), kinetic (mots du futur), chart (courbe exponentielle), zoompunch (impact), cta (vision)",
      voiceStyle: "Voix qui questionne. Hypothèses audacieuses. Chiffres 2030/2050. Sentiment de découverte.",
    };

  // ── TECH REVIEW ───────────────────────────────────────────
  if (p.match(/review|test|avis|specs|caractéristiques|performance|benchmark|version|modèle|pro|ultra/))
    return {
      id: "techreview",
      name: "Tech Review",
      toneInstructions: "Ton expert et précis. Caractéristiques techniques valorisées. Comparaison avec la concurrence. Verdict clair.",
      structureInstructions: "Structure: 1) Présentation produit 2) Design/look 3) Performance clé 4) Features différenciants 5) Verdict",
      sceneTypes: "glitch (reveal produit), floatstats (specs clés), counter (benchmark), split (feature + détail), card (verdict), cta",
      voiceStyle: "Vocabulaire technique maîtrisé. Superlatifs justifiés. Comparaisons précises.",
    };

  // ── DOCUMENTAIRE ─────────────────────────────────────────
  if (p.match(/documentaire|doc|reportage|enquête|investigation|immersif|profond|analyse approfondie/))
    return {
      id: "documentaire",
      name: "Documentaire",
      toneInstructions: "Ton immersif et posé. Voix off cinématographique. Faits documentés. Atmosphère contemplative.",
      structureInstructions: "Structure: 1) Mise en contexte immersive 2) Le sujet en profondeur 3) Témoignages/preuves 4) Enjeux cachés 5) Conclusion ouverte",
      sceneTypes: "sentence (narration lente), reveal (faits importants), counter (données), split (contexte + fait), card (témoignage), zoompunch (révélation)",
      voiceStyle: "Voix posée et grave. Phrases longues et descriptives. Atmosphère. Style Morgan Freeman.",
    };

  // ── SPORT / PERFORMANCE ───────────────────────────────────
  if (p.match(/sport|football|basket|tennis|athlète|champion|victoire|record|équipe|stade|match|olympique/))
    return {
      id: "sport",
      name: "Sport",
      toneInstructions: "Ton énergique et épique. Dépassement de soi. Chiffres records. Émotion du sport.",
      structureInstructions: "Structure: 1) Le contexte du défi 2) L'athlète/l'équipe 3) Les chiffres records 4) Le moment décisif 5) La victoire/l'impact",
      sceneTypes: "kinetic (énergie), glitch (moment choc), counter (records), floatstats (stats), zoompunch (victoire), cta (inspiration)",
      voiceStyle: "Voix de commentateur passionné. Mots d'action. Crescendo émotionnel. Phrases courtes en rafale.",
    };

  // ── FOOD / CUISINE ────────────────────────────────────────
  if (p.match(/recette|cuisine|food|plat|restaurant|chef|gastronomie|saveur|goût|manger|cuisson|ingrédient/))
    return {
      id: "food",
      name: "Food",
      toneInstructions: "Ton sensoriel et appétissant. Descriptions visuelles et gustatives. Simplicité valorisée.",
      structureInstructions: "Structure: 1) L'envie (le plat final) 2) Les ingrédients clés 3) La technique secrète 4) Le résultat 5) L'invitation à essayer",
      sceneTypes: "sentence (description sensorielle), word (ingrédient vedette), split (technique + résultat), counter (temps/quantité), card (recette), cta",
      voiceStyle: "Voix chaleureuse et gourmande. Adjectifs sensoriels. Rythme doux. Style chef passionné.",
    };

  // ── VOYAGE ────────────────────────────────────────────────
  if (p.match(/voyage|travel|destination|pays|ville|découverte|aventure|explore|tourisme|road.?trip|vacances/))
    return {
      id: "voyage",
      name: "Voyage",
      toneInstructions: "Ton poétique et immersif. Descriptions visuelles fortes. Sentiment d'évasion et de liberté.",
      structureInstructions: "Structure: 1) L'appel du départ 2) La destination en images 3) Les incontournables 4) L'expérience humaine 5) Le retour transformé",
      sceneTypes: "sentence (descriptions poétiques), word (lieux emblématiques), split (paysage + sensation), counter (km/heures), card (incontournable), cta",
      voiceStyle: "Voix poétique et rêveuse. Métaphores. Sensations. Style Lonely Planet oral.",
    };

  // ── LUXE / MODE ───────────────────────────────────────────
  if (p.match(/luxe|luxury|mode|fashion|haute couture|maroquinerie|parfum|joaillerie|prestige|élégance|raffinement/))
    return {
      id: "luxe",
      name: "Luxe / Mode",
      toneInstructions: "Ton élégant et lent. Chaque mot est choisi. Rareté valorisée. Silence entre les phrases.",
      structureInstructions: "Structure: 1) L'héritage 2) Le savoir-faire 3) Le détail qui fait tout 4) La rareté/exclusivité 5) L'invitation",
      sceneTypes: "reveal (révélation lente), word (mots précieux), split (héritage + modernité), counter (années/pièces), card (savoir-faire), cta (exclusif)",
      voiceStyle: "Voix murmurée et posée. Phrases très courtes. Mots précieux. Long silence entre phrases.",
    };

  // ── SCIENCE ───────────────────────────────────────────────
  if (p.match(/science|physique|chimie|biologie|recherche|découverte|étude|laboratoire|théorie|expérience|cosmos/))
    return {
      id: "science",
      name: "Science",
      toneInstructions: "Ton fasciné et rigoureux. Chiffres précis. Analogies pour vulgariser. Émerveillement scientifique.",
      structureInstructions: "Structure: 1) Le fait étonnant 2) L'explication simple 3) Les chiffres qui impressionnent 4) L'analogie révélatrice 5) L'implication pour nous",
      sceneTypes: "sentence (fait étonnant), counter (chiffres astronomiques), split (phénomène + explication), chart (données), card (implication), zoompunch (révélation)",
      voiceStyle: "Voix curieuse et précise. Chiffres contextualisés. Questions rhétoriques. Style Kurzgesagt.",
    };

  // ── CRYPTO / WEB3 ─────────────────────────────────────────
  if (p.match(/crypto|bitcoin|ethereum|blockchain|web3|nft|defi|token|wallet|bull|bear|halving/))
    return {
      id: "crypto",
      name: "Crypto / Web3",
      toneInstructions: "Ton analytique et direct. Volatilité assumée. Données on-chain. Pas de conseil financier.",
      structureInstructions: "Structure: 1) Le contexte marché 2) Les chiffres clés 3) Le catalyseur 4) Les risques 5) La perspective long terme",
      sceneTypes: "glitch (volatilité), counter (prix/market cap), floatstats (3 métriques), chart (courbe prix), split (bull vs bear), cta",
      voiceStyle: "Voix analytique et sobre. Chiffres précis. Termes techniques assumés. Pas d'euphorie.",
    };

  // ── DÉVELOPPEMENT PERSONNEL ───────────────────────────────
  if (p.match(/développement personnel|habitude|productivité|bien.?être|bonheur|méditation|routine|discipline|focus|cerveau/))
    return {
      id: "devperso",
      name: "Développement Personnel",
      toneInstructions: "Ton bienveillant et pratique. Conseils actionnables. Science derrière les habitudes. Transformation progressive.",
      structureInstructions: "Structure: 1) Le problème commun 2) La science derrière 3) La méthode simple 4) Les résultats attendus 5) Le premier pas",
      sceneTypes: "sentence (problème), word (concept clé), split (avant + après), counter (jours/%), chart (progression), card (méthode), cta (premier pas)",
      voiceStyle: "Voix calme et encourageante. Deuxième personne (tu). Exemples concrets. Style James Clear.",
    };

  // ── ENVIRONNEMENT / ÉCOLOGIE ──────────────────────────────
  if (p.match(/environnement|écologie|climat|planète|CO2|réchauffement|durable|vert|green|biodiversité|énergie renouvelable/))
    return {
      id: "ecologie",
      name: "Écologie",
      toneInstructions: "Ton engagé mais factuel. Urgence sans catastrophisme. Solutions concrètes. Espoir possible.",
      structureInstructions: "Structure: 1) Le constat chiffré 2) Les causes 3) L'impact réel 4) Les solutions qui marchent 5) Ce que tu peux faire",
      sceneTypes: "counter (chiffres alarmants), sentence (contexte), floatstats (3 faits), split (problème + solution), chart (évolution), cta (action)",
      voiceStyle: "Voix engagée et factuelle. Chiffres précis. Urgence mesurée. Solutions concrètes.",
    };

  // ── SANTÉ / MÉDECINE ──────────────────────────────────────
  if (p.match(/santé|médecine|maladie|traitement|symptôme|prévention|nutrition|exercice|sommeil|stress|mental/))
    return {
      id: "sante",
      name: "Santé",
      toneInstructions: "Ton rassurant et informatif. Données médicales vulgarisées. Conseils pratiques. Pas de diagnostic.",
      structureInstructions: "Structure: 1) Le fait santé surprenant 2) Ce que dit la science 3) Les chiffres 4) La prévention/solution 5) L'action simple",
      sceneTypes: "sentence (fait santé), counter (statistiques), split (problème + solution), chart (données), card (conseil), cta (action)",
      voiceStyle: "Voix médicale accessible. Termes expliqués. Rassurant sans minimiser. Style Dr vulgarisateur.",
    };

  // ── MUSIQUE / ARTISTE ─────────────────────────────────────
  if (p.match(/musique|chanson|album|artiste|concert|rap|rock|pop|jazz|streaming|playlist|beats|bpm/))
    return {
      id: "musique",
      name: "Musique",
      toneInstructions: "Ton rythmé et émotionnel. Calé sur le beat imaginaire. Chiffres streaming. Émotion artistique.",
      structureInstructions: "Structure: 1) L'artiste/le son 2) L'histoire derrière 3) Les chiffres (streams) 4) L'impact culturel 5) Le message",
      sceneTypes: "kinetic (rythme), glitch (impact), counter (streams/ventes), floatstats (stats), split (artiste + message), zoompunch (impact), cta",
      voiceStyle: "Voix rythmée avec flow. Phrases qui claquent. Rythme calé sur une pulsation imaginaire.",
    };

  // ── IMMOBILIER ────────────────────────────────────────────
  if (p.match(/immobilier|maison|appartement|investissement locatif|loyer|prix m2|marché immobilier|achat|vente|bien/))
    return {
      id: "immobilier",
      name: "Immobilier",
      toneInstructions: "Ton expert et rassurant. Chiffres du marché. Conseils d'expert. Opportunités identifiées.",
      structureInstructions: "Structure: 1) État du marché 2) Les chiffres clés 3) Les opportunités 4) Les pièges à éviter 5) La stratégie gagnante",
      sceneTypes: "sentence (contexte marché), counter (prix/rendement), floatstats (3 métriques), chart (évolution prix), split (opportunité + risque), cta",
      voiceStyle: "Voix d'agent expert. Chiffres précis. Conseils actionnables. Pas de spéculation.",
    };

  // ── GAMING ────────────────────────────────────────────────
  if (p.match(/gaming|jeu vidéo|game|playstation|xbox|nintendo|esport|streamer|twitch|fps|rpg|mmorpg/))
    return {
      id: "gaming",
      name: "Gaming",
      toneInstructions: "Ton dynamique et passionné. Références gaming. Chiffres industrie. Énergie de la compétition.",
      structureInstructions: "Structure: 1) Le jeu/l'univers 2) Ce qui le rend unique 3) Les chiffres (joueurs/ventes) 4) La communauté 5) Le verdict",
      sceneTypes: "glitch (intro impact), word (titre jeu), kinetic (features), counter (joueurs/ventes), floatstats (stats), zoompunch (verdict), cta",
      voiceStyle: "Voix gamer enthousiaste. Termes gaming assumés. Énergie haute. Phrases qui claquent.",
    };

  // ── POLITIQUE / SOCIÉTÉ ───────────────────────────────────
  if (p.match(/politique|élection|gouvernement|société|social|inégalité|démocratie|loi|réforme|parti|vote/))
    return {
      id: "politique",
      name: "Politique / Société",
      toneInstructions: "Ton neutre et factuel. Présentation équilibrée. Chiffres officiels. Pas de parti pris.",
      structureInstructions: "Structure: 1) Le contexte 2) Les faits vérifiés 3) Les chiffres officiels 4) Les différentes positions 5) Les enjeux",
      sceneTypes: "sentence (contexte), counter (chiffres officiels), floatstats (données), split (position A + B), chart (évolution), card (enjeu), cta",
      voiceStyle: "Voix neutre et posée. Chiffres sourcés. Présentation équilibrée. Style journalisme d'investigation.",
    };

  // ── PSYCHOLOGIE ───────────────────────────────────────────
  if (p.match(/psychologie|comportement|biais|cognitif|émotion|inconscient|thérapie|trauma|narcissisme|manipulation/))
    return {
      id: "psychologie",
      name: "Psychologie",
      toneInstructions: "Ton fascinant et révélateur. Biais cognitifs expliqués. Exemples du quotidien. Prise de conscience.",
      structureInstructions: "Structure: 1) Le phénomène surprenant 2) L'explication scientifique 3) Exemples concrets 4) Comment s'en protéger 5) La clé de compréhension",
      sceneTypes: "sentence (phénomène), word (concept clé), split (illusion + réalité), counter (études/%), card (explication), zoompunch (révélation), cta",
      voiceStyle: "Voix intriguante et pédagogique. Questions qui dérangent. Révélations progressives. Style pop psychology.",
    };

  // ── HISTOIRE ──────────────────────────────────────────────
  if (p.match(/histoire|historique|siècle|empire|guerre|révolution|civilisation|antiquité|moyen.?âge|époque/))
    return {
      id: "histoire",
      name: "Histoire",
      toneInstructions: "Ton narratif et épique. Faits historiques précis. Anecdotes révélatrices. Connexion avec le présent.",
      structureInstructions: "Structure: 1) Le contexte de l'époque 2) L'événement déclencheur 3) Les acteurs clés 4) Les conséquences 5) L'héritage aujourd'hui",
      sceneTypes: "sentence (narration), reveal (date clé), counter (années/chiffres), split (contexte + fait), card (acteur), zoompunch (tournant), cta",
      voiceStyle: "Voix de conteur épique. Présent de narration. Détails vivants. Style Ken Burns documentaire.",
    };

  // ── ENTREPRISE / CORPORATE ────────────────────────────────
  if (p.match(/entreprise|corporate|b2b|équipe|management|leadership|culture|rh|recrutement|onboarding|process/))
    return {
      id: "corporate",
      name: "Corporate",
      toneInstructions: "Ton professionnel et inspirant. Valeurs d'entreprise. Résultats concrets. Culture positive.",
      structureInstructions: "Structure: 1) La mission 2) Les valeurs 3) Les résultats 4) L'équipe/culture 5) L'appel à rejoindre",
      sceneTypes: "sentence (mission), word (valeurs), floatstats (résultats), split (valeur + impact), card (culture), cta (rejoindre)",
      voiceStyle: "Voix engagée et professionnelle. Valeurs concrètes. Résultats mesurables. Style employer branding.",
    };

  // ── TUTORIEL / HOW-TO ─────────────────────────────────────
  if (p.match(/tutoriel|tuto|guide|step by step|pas à pas|comment faire|apprendre à|débutant|initiation|formation/))
    return {
      id: "tutoriel",
      name: "Tutoriel",
      toneInstructions: "Ton pédagogique et bienveillant. Étapes numérotées. Erreurs communes évitées. Résultat garanti.",
      structureInstructions: "Structure: 1) Le résultat final promis 2) Ce qu'il faut (prérequis) 3) Étape 1 4) Étape 2 5) Étape 3 6) Résultat + conseil bonus",
      sceneTypes: "sentence (promesse), split (étape + explication), counter (numéro étape), word (action clé), card (récap étapes), cta (résultat)",
      voiceStyle: "Voix enseignante et précise. Impératifs bienveillants. Encouragements. Style tutoriel YouTube.",
    };

  // ── ÉVÉNEMENT / LIVE ──────────────────────────────────────
  if (p.match(/événement|event|conférence|festival|concert|lancement|keynote|salon|expo|webinar|live/))
    return {
      id: "evenement",
      name: "Événement",
      toneInstructions: "Ton excitant et urgent. Dates précises. FOMO intégré. Exclusivité valorisée.",
      structureInstructions: "Structure: 1) L'annonce choc 2) Ce qui se passera 3) Les intervenants/stars 4) Les chiffres (participants/éditions) 5) Comment participer",
      sceneTypes: "glitch (annonce), word (date/lieu), kinetic (programme), counter (participants), floatstats (éditions passées), cta (inscription urgente)",
      voiceStyle: "Voix excitée et urgente. Dates précises. FOMO assumé. Style annonce Apple Keynote.",
    };

  // ── CINÉMA / SÉRIE ────────────────────────────────────────
  if (p.match(/film|cinéma|série|netflix original|réalisateur|acteur|oscar|box.?office|streaming|bande annonce/))
    return {
      id: "cinema",
      name: "Cinéma / Série",
      toneInstructions: "Ton cinématographique et mystérieux. Teasing. Révélations progressives. Émotions fortes.",
      structureInstructions: "Structure: 1) L'atmosphère (genre/univers) 2) L'histoire en 3 phrases 3) Les chiffres (box office/vues) 4) Ce qui le rend unique 5) Voir maintenant",
      sceneTypes: "reveal (teaser), sentence (synopsis), counter (box office), floatstats (récompenses), split (genre + atmosphère), zoompunch (critique), cta",
      voiceStyle: "Voix de bande annonce. Phrases mystérieuses. Ellipses dramatiques. Style trailer Hollywood.",
    };

  // ── JURIDIQUE / LÉGAL ─────────────────────────────────────
  if (p.match(/droit|loi|juridique|contrat|rgpd|gdpr|compliance|réglementation|tribunal|procès|légal/))
    return {
      id: "juridique",
      name: "Juridique",
      toneInstructions: "Ton clair et accessible. Termes juridiques vulgarisés. Implications pratiques. Pas de conseil juridique.",
      structureInstructions: "Structure: 1) Le contexte légal 2) Ce que dit la loi simplement 3) Les obligations concrètes 4) Les risques si non-respect 5) Comment se conformer",
      sceneTypes: "sentence (contexte), word (terme clé expliqué), counter (amendes/délais), split (obligation + conséquence), card (checklist), cta",
      voiceStyle: "Voix professionnelle et claire. Termes expliqués. Exemples concrets. Style vulgarisation juridique.",
    };

  // ── GROWTH HACKING ────────────────────────────────────────
  if (p.match(/growth.?hack|croissance rapide|acquisition|funnel|conversion|viral|traction|scale|aarrr/))
    return {
      id: "growthhacking",
      name: "Growth Hacking",
      toneInstructions: "Ton data-driven et pratique. Métriques concrètes. Stratégies actionnables. Résultats rapides.",
      structureInstructions: "Structure: 1) Le problème de croissance 2) La métrique clé 3) La stratégie growth 4) Les résultats obtenus 5) Comment répliquer",
      sceneTypes: "glitch (accroche), counter (métriques), chart (courbe croissance), floatstats (KPIs), split (avant/après), cta",
      voiceStyle: "Voix directe et chiffrée. Verbes d'action. ROI concret. Style startup founder.",
    };

  // ── PERSONAL BRANDING ─────────────────────────────────────
  if (p.match(/personal.?brand|image personnelle|réputation|influence|marque personnelle|se démarquer|positionnement/))
    return {
      id: "personalbranding",
      name: "Personal Branding",
      toneInstructions: "Ton inspirant et personnel. Histoire authentique. Valeurs différenciantes. Appel à l'authenticité.",
      structureInstructions: "Structure: 1) Qui tu es vraiment 2) Ce qui te différencie 3) Ton message unique 4) Tes preuves 5) Comment te suivre",
      sceneTypes: "sentence (accroche personnelle), word (valeur clé), split (avant identité + après), card (positionnement), floatstats, cta",
      voiceStyle: "Voix personnelle et authentique. Première personne. Vulnérabilité assumée. Style LinkedIn thought leader.",
    };

  // ── FREELANCE ─────────────────────────────────────────────
  if (p.match(/freelance|indépendant|auto.?entrepreneur|mission|client|tjm|portage salarial|télétravail/))
    return {
      id: "freelance",
      name: "Freelance",
      toneInstructions: "Ton libérateur et pragmatique. Liberté valorisée. Défis honnêtement présentés. Conseils concrets.",
      structureInstructions: "Structure: 1) L'appel de la liberté 2) Les chiffres du marché 3) Comment démarrer 4) Les pièges à éviter 5) La vie côté freelance",
      sceneTypes: "sentence (liberté), counter (revenus/clients), split (salarié vs freelance), floatstats, card (conseils), cta",
      voiceStyle: "Voix libre et directe. Expérience vécue. Chiffres réels. Style entrepreneur indépendant.",
    };

  // ── E-COMMERCE ────────────────────────────────────────────
  if (p.match(/e.?commerce|boutique en ligne|vente en ligne|shopify|woocommerce|marketplace|amazon fba|etsy/))
    return {
      id: "ecommerce",
      name: "E-commerce",
      toneInstructions: "Ton commercial et optimiste. Chiffres de vente. Stratégies de conversion. Succès mesurables.",
      structureInstructions: "Structure: 1) L'opportunité marché 2) Les chiffres du secteur 3) La stratégie gagnante 4) Les outils clés 5) Lancer maintenant",
      sceneTypes: "counter (CA/commandes), chart (croissance), floatstats (métriques), split (stratégie + résultat), card (outil), cta",
      voiceStyle: "Voix commerçante et enthousiaste. Chiffres de vente. Conversion et rentabilité.",
    };

  // ── DROPSHIPPING ──────────────────────────────────────────
  if (p.match(/dropshipping|drop.?shipping|aliexpress|fournisseur|marge|catalogue produit|sans stock/))
    return {
      id: "dropshipping",
      name: "Dropshipping",
      toneInstructions: "Ton pragmatique et réaliste. Modèle expliqué clairement. Opportunités et limites honnêtes.",
      structureInstructions: "Structure: 1) Comment ça marche 2) Les chiffres réels 3) Les niches rentables 4) Les erreurs communes 5) Comment réussir",
      sceneTypes: "sentence (modèle), counter (marges/revenus), split (mythe + réalité), floatstats, chart (potentiel), cta",
      voiceStyle: "Voix réaliste et directe. Chiffres vérifiables. Ni trop optimiste ni trop pessimiste.",
    };

  // ── MARKETING DIGITAL ─────────────────────────────────────
  if (p.match(/marketing digital|seo|google ads|facebook ads|content marketing|inbound|email marketing|automation/))
    return {
      id: "marketingdigital",
      name: "Marketing Digital",
      toneInstructions: "Ton expert et actionnable. Stratégies précises. ROI démontré. Erreurs communes évitées.",
      structureInstructions: "Structure: 1) Le canal clé 2) Les chiffres de performance 3) La stratégie optimale 4) Les outils 5) Comment lancer",
      sceneTypes: "counter (ROI/impressions), chart (performance), floatstats (métriques), split (stratégie + résultat), card (outil), cta",
      voiceStyle: "Voix experte et directe. Métriques précises. Acronymes assumés. Style growth marketer.",
    };

  // ── PODCAST ───────────────────────────────────────────────
  if (p.match(/podcast|audio|épisode|micro|enregistrement|audience|abonné|spotify podcast|apple podcast/))
    return {
      id: "podcast",
      name: "Podcast",
      toneInstructions: "Ton conversationnel et intime. Comme une conversation entre amis. Authenticité maximale.",
      structureInstructions: "Structure: 1) Le thème de l'épisode 2) L'invité/le sujet 3) La révélation principale 4) Les takeaways 5) S'abonner",
      sceneTypes: "sentence (teaser), word (thème), split (question + réponse), counter (écoutes), card (takeaway), cta (abonnement)",
      voiceStyle: "Voix conversationnelle et chaleureuse. Comme parler à un ami. Naturel et authentique.",
    };

  // ── NEWSLETTER ────────────────────────────────────────────
  if (p.match(/newsletter|email list|abonnés|substack|beehiiv|taux ouverture|monétiser audience|creator economy/))
    return {
      id: "newsletter",
      name: "Newsletter",
      toneInstructions: "Ton personnel et exclusif. Sentiment de communauté. Valeur exclusive. Relation directe.",
      structureInstructions: "Structure: 1) La promesse de valeur 2) Ce que les abonnés reçoivent 3) Les chiffres (abonnés/taux) 4) Témoignage abonné 5) S'abonner",
      sceneTypes: "sentence (promesse), counter (abonnés/taux), split (contenu + valeur), floatstats, card (témoignage), cta",
      voiceStyle: "Voix intime et exclusive. Tu parles à chaque abonné individuellement. Sentiment VIP.",
    };

  // ── NÉGOCIATION ───────────────────────────────────────────
  if (p.match(/négociation|négocier|convaincre|persuasion|deal|accord|salaire|prix|argumentation/))
    return {
      id: "negociation",
      name: "Négociation",
      toneInstructions: "Ton stratégique et révélateur. Techniques concrètes. Psychologie appliquée. Résultats tangibles.",
      structureInstructions: "Structure: 1) L'enjeu de la négociation 2) La psychologie derrière 3) Les 3 techniques clés 4) Les erreurs fatales 5) Pratiquer maintenant",
      sceneTypes: "sentence (enjeu), word (technique), split (erreur + solution), counter (% de succès), card (technique), zoompunch (révélation), cta",
      voiceStyle: "Voix stratégique et révélatrice. Techniques nommées. Exemples concrets. Style coach en négociation.",
    };

  // ── MANAGEMENT ────────────────────────────────────────────
  if (p.match(/management|manager|diriger|leadership|équipe|déléguer|feedback|performance|1on1|okr/))
    return {
      id: "management",
      name: "Management",
      toneInstructions: "Ton professionnel et humain. Leadership authentique. Erreurs communes. Impact sur les équipes.",
      structureInstructions: "Structure: 1) Le défi du manager 2) Ce que dit la science 3) Les pratiques gagnantes 4) Les erreurs à éviter 5) Devenir meilleur manager",
      sceneTypes: "sentence (défi), counter (% employés engagés), split (mauvais + bon management), floatstats, card (pratique), cta",
      voiceStyle: "Voix expérimentée et bienveillante. Exemples d'équipes. Impact humain mesuré.",
    };

  // ── BUDGET ────────────────────────────────────────────────
  if (p.match(/budget|dépenses|finances personnelles|épargner|économiser|argent|revenus|charges|50.?30.?20/))
    return {
      id: "budget",
      name: "Budget",
      toneInstructions: "Ton bienveillant et pratique. Sans jugement. Méthodes simples. Transformation progressive.",
      structureInstructions: "Structure: 1) Le problème commun 2) Pourquoi ça coince 3) La méthode simple 4) Les chiffres cibles 5) Premier pas aujourd'hui",
      sceneTypes: "sentence (problème), counter (économies possibles), split (dépense + optimisation), chart (progression), card (méthode), cta",
      voiceStyle: "Voix sans jugement et encourageante. Chiffres accessibles. Style coach financier bienveillant.",
    };

  // ── ÉPARGNE ───────────────────────────────────────────────
  if (p.match(/épargne|livret|placement|taux d'intérêt|capitalisation|intérêts composés|patrimoine|capital/))
    return {
      id: "epargne",
      name: "Épargne",
      toneInstructions: "Ton rassurant et motivant. Intérêts composés expliqués. Temps comme allié. Vision long terme.",
      structureInstructions: "Structure: 1) Le pouvoir du temps 2) Les intérêts composés 3) Combien épargner 4) Où placer 5) Commencer maintenant",
      sceneTypes: "counter (capital final), chart (croissance composée), split (dépenser vs épargner), floatstats, card (règle clé), cta",
      voiceStyle: "Voix patient et optimiste. Chiffres sur 10-20-30 ans. Style planificateur financier.",
    };

  // ── BOURSE ────────────────────────────────────────────────
  if (p.match(/bourse|action|cac40|sp500|dividende|portefeuille|broker|trader|analyse technique|fondamentale/))
    return {
      id: "bourse",
      name: "Bourse",
      toneInstructions: "Ton analytique et prudent. Risques présentés honnêtement. Stratégies long terme favorisées.",
      structureInstructions: "Structure: 1) La bourse en chiffres 2) Les principes de base 3) Les stratégies 4) Les risques 5) Comment commencer",
      sceneTypes: "counter (rendements historiques), chart (courbe marché), floatstats (indices), split (risque + opportunité), card (stratégie), cta",
      voiceStyle: "Voix analytique et prudente. Données historiques. Ni peur ni euphorie. Style investisseur value.",
    };

  // ── ETF ───────────────────────────────────────────────────
  if (p.match(/etf|index.?fund|tracker|vanguard|sp.?500|world|msci|gestion passive|frais réduits/))
    return {
      id: "etf",
      name: "ETF / Index Funds",
      toneInstructions: "Ton pédagogique et convaincant. Simplicité valorisée. Données historiques. Frais comme ennemi.",
      structureInstructions: "Structure: 1) Qu'est-ce qu'un ETF 2) Pourquoi ils battent les gérants 3) Les chiffres historiques 4) Comment choisir 5) Investir maintenant",
      sceneTypes: "sentence (définition), counter (rendement historique), chart (performance), split (ETF vs fonds actif), floatstats, cta",
      voiceStyle: "Voix convaincue et factuelle. Données historiques. Style Jack Bogle vulgarisé.",
    };

  // ── RETRAITE ──────────────────────────────────────────────
  if (p.match(/retraite|pension|per|assurance.?vie|préparer sa retraite|âge de départ|cotisation/))
    return {
      id: "retraite",
      name: "Retraite",
      toneInstructions: "Ton sérieux mais accessible. Urgence d'agir tôt. Chiffres sur l'avenir. Solutions concrètes.",
      structureInstructions: "Structure: 1) Le choc des chiffres 2) Le système actuel 3) Ce qu'il manquera 4) Les solutions complémentaires 5) Agir maintenant",
      sceneTypes: "counter (déficit projeté), chart (évolution pension), split (système actuel + solution), floatstats, card (stratégie), cta",
      voiceStyle: "Voix sérieuse mais accessible. Chiffres projetés. Urgence mesurée. Style conseiller patrimonial.",
    };

  // ── DETTE ─────────────────────────────────────────────────
  if (p.match(/dette|crédit|remboursement|désendettement|taux d'intérêt consommation|rachat de crédit|faillite/))
    return {
      id: "dette",
      name: "Dette",
      toneInstructions: "Ton sans jugement et libérateur. Solutions concrètes. Méthodes éprouvées. Espoir possible.",
      structureInstructions: "Structure: 1) Le poids de la dette 2) Comprendre les taux 3) La méthode avalanche vs boule de neige 4) Étapes concrètes 5) La liberté financière",
      sceneTypes: "counter (montant/taux), split (dette + solution), chart (remboursement), floatstats, card (méthode), cta",
      voiceStyle: "Voix bienveillante et solution-oriented. Sans honte. Méthodes nommées. Style coach financier.",
    };

  // ── SIDE HUSTLE ───────────────────────────────────────────
  if (p.match(/side.?hustle|revenus complémentaires|revenus passifs|deuxième source|diversifier revenus/))
    return {
      id: "sidehustle",
      name: "Side Hustle",
      toneInstructions: "Ton motivant et réaliste. Idées concrètes. Temps nécessaire honnête. Premiers euros rapides.",
      structureInstructions: "Structure: 1) Pourquoi un side hustle 2) Les meilleures idées 3) Temps vs revenus 4) Comment démarrer 5) Scaler ensuite",
      sceneTypes: "sentence (liberté), counter (revenus possibles), kinetic (idées), floatstats (exemples), split (temps + revenu), cta",
      voiceStyle: "Voix enthousiaste et réaliste. Exemples concrets. Montants réels. Style entrepreneur en parallèle.",
    };

  // ── NO-CODE ───────────────────────────────────────────────
  if (p.match(/no.?code|low.?code|bubble|webflow|airtable|zapier|make|automatisation sans code|sans développeur/))
    return {
      id: "nocode",
      name: "No-Code",
      toneInstructions: "Ton démocratisant et enthousiasmant. Accessibilité valorisée. Exemples de créations. Révolution en cours.",
      structureInstructions: "Structure: 1) La révolution no-code 2) Ce qu'on peut créer 3) Les outils clés 4) Des exemples réels 5) Commencer aujourd'hui",
      sceneTypes: "sentence (révolution), word (outil), counter (apps créées), floatstats (marché), split (idée + création), card (outil), cta",
      voiceStyle: "Voix démocratisante et pratique. Exemples concrets. Accessibilité sans barrière.",
    };

  // ── CYBERSÉCURITÉ ─────────────────────────────────────────
  if (p.match(/cybersécurité|hacker|phishing|ransomware|mdp|mot de passe|vpn|données personnelles|rgpd|piratage/))
    return {
      id: "cybersecurite",
      name: "Cybersécurité",
      toneInstructions: "Ton alarmant mais constructif. Menaces réelles documentées. Solutions pratiques immédiatement applicables.",
      structureInstructions: "Structure: 1) La menace réelle 2) Comment ça marche 3) Les chiffres des attaques 4) Se protéger concrètement 5) Les outils indispensables",
      sceneTypes: "glitch (attaque), counter (victimes/coûts), floatstats (menaces), split (vulnérabilité + protection), card (outil), cta",
      voiceStyle: "Voix alarmante mais solution-oriented. Chiffres d'attaques réelles. Conseils applicables.",
    };

  // ── CLOUD ─────────────────────────────────────────────────
  if (p.match(/cloud|aws|azure|google cloud|infrastructure|saas|paas|iaas|serverless|microservices/))
    return {
      id: "cloud",
      name: "Cloud Computing",
      toneInstructions: "Ton technique mais accessible. Analogies simples. Chiffres de marché. Impact business concret.",
      structureInstructions: "Structure: 1) Le cloud expliqué simplement 2) Les acteurs clés 3) Les chiffres du marché 4) Les cas d'usage 5) L'avenir",
      sceneTypes: "sentence (analogie), counter (marché/croissance), floatstats (acteurs), chart (adoption), split (avant/après cloud), cta",
      voiceStyle: "Voix tech accessible. Analogies du quotidien. Chiffres de marché. Style CTO vulgarisateur.",
    };

  // ── METAVERSE ─────────────────────────────────────────────
  if (p.match(/metaverse|réalité virtuelle|vr|ar|réalité augmentée|avatar|monde virtuel|immersif/))
    return {
      id: "metaverse",
      name: "Metaverse",
      toneInstructions: "Ton visionnaire et questionnant. Promesses et réalités confrontées. Opportunités et risques équilibrés.",
      structureInstructions: "Structure: 1) La vision initiale 2) L'état actuel 3) Les chiffres 4) Les cas d'usage réels 5) Ce qui va changer",
      sceneTypes: "sentence (vision), glitch (disruption), counter (investissements), floatstats (adoption), split (promesse + réalité), zoompunch (futur), cta",
      voiceStyle: "Voix fascinée et critique. Questions ouvertes. Ni hype ni scepticisme total.",
    };

  // ── ROBOTIQUE ─────────────────────────────────────────────
  if (p.match(/robot|robotique|automatisation|industrie 4\.0|cobots|boston dynamics|humanoid|usine/))
    return {
      id: "robotique",
      name: "Robotique",
      toneInstructions: "Ton fasciné et analytique. Avancées récentes. Impact emploi traité honnêtement. Futur proche.",
      structureInstructions: "Structure: 1) L'avancée spectaculaire 2) Ce que les robots font déjà 3) Les chiffres de l'industrie 4) Impact emploi 5) L'humain + robot",
      sceneTypes: "glitch (révélation), counter (robots déployés), chart (croissance), floatstats (secteurs), split (humain + machine), zoompunch (futur), cta",
      voiceStyle: "Voix fascinée et nuancée. Avancées concrètes. Impact emploi sans catastrophisme.",
    };

  // ── IMPRESSION 3D ─────────────────────────────────────────
  if (p.match(/impression 3d|3d print|filament|résine|fabrication additive|prototypage|maker/))
    return {
      id: "impression3d",
      name: "Impression 3D",
      toneInstructions: "Ton enthousiaste et démocratisant. Applications concrètes. Du maker au professionnel. Révolution silencieuse.",
      structureInstructions: "Structure: 1) La révolution silencieuse 2) Ce qu'on peut créer 3) Les chiffres du marché 4) Les secteurs transformés 5) Commencer",
      sceneTypes: "sentence (révolution), counter (marché), floatstats (secteurs), split (ancien procédé + 3D), card (application), cta",
      voiceStyle: "Voix enthousiasmante. Applications concrètes. Du quotidien au médical. Style maker passionné.",
    };

  // ── DRONE ─────────────────────────────────────────────────
  if (p.match(/drone|uav|dji|fpv|livraison par drone|photographie aérienne|surveillance|inspection/))
    return {
      id: "drone",
      name: "Drone",
      toneInstructions: "Ton dynamique et visuel. Applications spectaculaires. Réglementation évoquée. Marché en explosion.",
      structureInstructions: "Structure: 1) La révolution aérienne 2) Les usages actuels 3) Les chiffres du marché 4) La réglementation 5) L'avenir de la livraison",
      sceneTypes: "kinetic (usages), counter (marché), floatstats (secteurs), chart (croissance), split (usage + règle), cta",
      voiceStyle: "Voix dynamique et visuelle. Applications concrètes. Futur proche réaliste.",
    };

  // ── GÉNÉRATION Z ──────────────────────────────────────────
  if (p.match(/génération z|gen z|zoomers|digital native|tiktok generation|centennial/))
    return {
      id: "genz",
      name: "Génération Z",
      toneInstructions: "Ton analytique et respectueux. Codes compris. Données comportementales. Différences vraiment comprises.",
      structureInstructions: "Structure: 1) Qui sont-ils vraiment 2) Ce qui les différencie 3) Leurs valeurs mesurées 4) Comment les atteindre 5) L'avenir qu'ils construisent",
      sceneTypes: "sentence (portrait), counter (taille génération), floatstats (comportements), split (gen z + autres), chart (tendances), cta",
      voiceStyle: "Voix analytique sans condescendance. Données comportementales réelles. Respect des codes.",
    };

  // ── RÉSEAUX SOCIAUX ───────────────────────────────────────
  if (p.match(/réseaux sociaux|social media|instagram|tiktok|linkedin|twitter|algorithme|reach|engagement|viral/))
    return {
      id: "socialmedia",
      name: "Réseaux Sociaux",
      toneInstructions: "Ton expert et stratégique. Algorithmes décryptés. Chiffres d'engagement. Stratégie de contenu.",
      structureInstructions: "Structure: 1) L'état des plateformes 2) Les chiffres clés 3) Ce que veut l'algorithme 4) La stratégie gagnante 5) Créer maintenant",
      sceneTypes: "counter (utilisateurs), floatstats (engagement par plateforme), chart (croissance), split (mauvaise + bonne pratique), card (stratégie), cta",
      voiceStyle: "Voix experte et stratégique. Métriques concrètes. Algorithmes expliqués. Style social media manager.",
    };

  // ── FAKE NEWS ─────────────────────────────────────────────
  if (p.match(/fake.?news|désinformation|fact.?check|vérifier|rumeur|complot|infox|propagande/))
    return {
      id: "fakenews",
      name: "Fake News",
      toneInstructions: "Ton critique et éducatif. Méthodes de vérification. Exemples réels. Pensée critique valorisée.",
      structureInstructions: "Structure: 1) L'ampleur du problème 2) Comment les repérer 3) Les biais cognitifs exploités 4) Les outils de fact-check 5) Devenir résistant",
      sceneTypes: "glitch (fake), counter (propagation), split (fake + vrai), floatstats (impact), card (méthode vérification), cta",
      voiceStyle: "Voix critique et pédagogique. Exemples concrets. Outils pratiques. Style journaliste fact-checker.",
    };

  // ── SLOW LIFE ─────────────────────────────────────────────
  if (p.match(/slow life|slow living|décélération|ralentir|simplicité volontaire|hygge|ikigai|slow fashion/))
    return {
      id: "slowlife",
      name: "Slow Life",
      toneInstructions: "Ton doux et contemplatif. Rythme lent assumé. Valeurs profondes. Contrepied à l'urgence.",
      structureInstructions: "Structure: 1) L'épuisement du toujours plus 2) Ce que le slow change 3) Les pratiques concrètes 4) Ce qu'on y gagne 5) Commencer petit",
      sceneTypes: "sentence (contraste), word (valeur), split (fast + slow), counter (bénéfices mesurés), card (pratique), cta",
      voiceStyle: "Voix posée et contemplative. Phrases lentes. Métaphores naturelles. Style essayiste bienveillant.",
    };

  // ── MINIMALISME ───────────────────────────────────────────
  if (p.match(/minimalisme|minimaliste|désencombrer|marie.?kondo|essentiel|moins c'est plus|capsule wardrobe/))
    return {
      id: "minimalisme",
      name: "Minimalisme",
      toneInstructions: "Ton épuré et libérateur. Chaque objet questionné. Liberté par le moins. Transformation visible.",
      structureInstructions: "Structure: 1) Le trop-plein moderne 2) Ce que le minimalisme apporte 3) Par où commencer 4) Les bénéfices mesurés 5) La méthode",
      sceneTypes: "sentence (encombrement), word (liberté), split (avant + après), counter (objets/économies), card (méthode), cta",
      voiceStyle: "Voix épurée. Phrases courtes. Espaces entre les mots. Style minimaliste dans la forme même.",
    };

  // ── NOMADISME DIGITAL ─────────────────────────────────────
  if (p.match(/nomade digital|digital nomad|remote work|travailler depuis|destination remote|co.?working|bali|chiang mai/))
    return {
      id: "nomadismedigital",
      name: "Nomadisme Digital",
      toneInstructions: "Ton aventureux et réaliste. Liberté géographique valorisée. Défis honnêtement présentés. Vie concrète.",
      structureInstructions: "Structure: 1) La liberté géographique 2) Ce que c'est vraiment 3) Les chiffres du mouvement 4) Les défis réels 5) Comment y arriver",
      sceneTypes: "sentence (liberté), counter (nomades mondiaux), floatstats (destinations/coûts), split (rêve + réalité), card (conseil), cta",
      voiceStyle: "Voix aventureuse et honnête. Expérience vécue. Défis sans romantisation excessive.",
    };

  // ── URBANISME ─────────────────────────────────────────────
  if (p.match(/urbanisme|ville|smart city|métropole|logement|transport|mobilité urbaine|quartier|densité/))
    return {
      id: "urbanisme",
      name: "Urbanisme",
      toneInstructions: "Ton analytique et visionnaire. Défis urbains chiffrés. Solutions innovantes. Ville humaine valorisée.",
      structureInstructions: "Structure: 1) Le défi urbain 2) Les chiffres de l'urbanisation 3) Les innovations 4) La ville idéale 5) Les projets en cours",
      sceneTypes: "counter (population urbaine), chart (urbanisation), floatstats (villes), split (problème + solution), card (innovation), zoompunch (vision), cta",
      voiceStyle: "Voix analytique et humaniste. Chiffres d'urbanisation. Solutions concrètes. Style urbaniste passionné.",
    };

  // ── SOMMEIL ───────────────────────────────────────────────
  if (p.match(/sommeil|dormir|insomnie|mélatonine|cycles|rem|nuit|repos|fatigue|récupération/))
    return {
      id: "sommeil",
      name: "Sommeil",
      toneInstructions: "Ton scientifique et révélateur. Science du sommeil vulgarisée. Impact mesuré. Solutions pratiques.",
      structureInstructions: "Structure: 1) Le choc : on dort mal 2) Ce que le sommeil fait vraiment 3) Les erreurs communes 4) Les protocoles gagnants 5) Ce soir",
      sceneTypes: "counter (heures perdues/% population), floatstats (impacts), split (erreur + solution), chart (cycles), card (protocole), cta",
      voiceStyle: "Voix scientifique et pratique. Études citées simplement. Impact corps et cerveau. Style Matthew Walker vulgarisé.",
    };

  // ── JEÛNE INTERMITTENT ────────────────────────────────────
  if (p.match(/jeûne|intermittent|fasting|16.?8|5.?2|autophagie|calorie|métabolisme|poids/))
    return {
      id: "jeune",
      name: "Jeûne Intermittent",
      toneInstructions: "Ton scientifique et rassurant. Mécanismes expliqués. Protocoles clairs. Bénéfices mesurés.",
      structureInstructions: "Structure: 1) Ce que c'est vraiment 2) La science derrière 3) Les bénéfices prouvés 4) Le protocole simple 5) Comment commencer",
      sceneTypes: "sentence (définition), counter (% de perte), split (mythe + science), floatstats (bénéfices), card (protocole), cta",
      voiceStyle: "Voix scientifique et rassurante. Mécanismes biologiques vulgarisés. Style nutritionniste expert.",
    };

  // ── DOUCHE FROIDE ─────────────────────────────────────────
  if (p.match(/douche froide|cold shower|wim hof|exposition au froid|glace|cryothérapie|immersion froide/))
    return {
      id: "douchefroide",
      name: "Douche Froide",
      toneInstructions: "Ton défiant et scientifique. Bénéfices prouvés. Défi progressif. Transformation mesurable.",
      structureInstructions: "Structure: 1) Le défi 2) La science derrière 3) Les bénéfices prouvés 4) Le protocole progressif 5) Commencer demain",
      sceneTypes: "glitch (choc), counter (% d'amélioration), floatstats (bénéfices), split (avant + après), card (protocole), cta",
      voiceStyle: "Voix défiant et scientifique. Bénéfices chiffrés. Progressif et accessible. Style biohacker motivant.",
    };

  // ── NOOTROPIQUES ──────────────────────────────────────────
  if (p.match(/nootropique|smart drug|cognition|mémoire|focus|concentration|supplément|cerveau|performance cognitive/))
    return {
      id: "nootropiques",
      name: "Nootropiques",
      toneInstructions: "Ton scientifique et prudent. Preuves requises. Bénéfices réels vs marketing. Sécurité valorisée.",
      structureInstructions: "Structure: 1) L'optimisation cognitive 2) Ce qui est prouvé 3) Les plus efficaces 4) Les risques 5) Stack optimal",
      sceneTypes: "sentence (potentiel), counter (études), floatstats (effets), split (marketing + science), card (supplément), cta",
      voiceStyle: "Voix scientifique et prudente. Distinguer ce qui est prouvé du marketing. Style biohacker rigoureux.",
    };

  // ── LONGÉVITÉ ─────────────────────────────────────────────
  if (p.match(/longévité|vivre longtemps|centenaire|anti.?aging|zones bleues|vieillissement|espérance de vie/))
    return {
      id: "longevite",
      name: "Longévité",
      toneInstructions: "Ton fasciné et scientifique. Zones bleues explorées. Habitudes des centenaires. Science du vieillissement.",
      structureInstructions: "Structure: 1) Le secret des centenaires 2) La science du vieillissement 3) Les zones bleues 4) Les habitudes prouvées 5) Commencer maintenant",
      sceneTypes: "counter (années de vie gagnées), floatstats (zones bleues), split (habitude + impact), chart (espérance de vie), card (secret), cta",
      voiceStyle: "Voix fascinée et scientifique. Centenaires comme exemples. Style Peter Attia vulgarisé.",
    };

  // ── BURN-OUT ──────────────────────────────────────────────
  if (p.match(/burn.?out|épuisement professionnel|surmenage|stress chronique|fatigue extrême|arrêt maladie/))
    return {
      id: "burnout",
      name: "Burn-Out",
      toneInstructions: "Ton empathique et éclairant. Sans jugement. Signaux d'alarme identifiés. Chemin de guérison.",
      structureInstructions: "Structure: 1) Ce que c'est vraiment 2) Les signaux d'alarme 3) Les chiffres alarmants 4) Comment s'en sortir 5) Prévenir",
      sceneTypes: "sentence (réalité), counter (% touchés), floatstats (signes), split (signal + action), card (étape guérison), cta",
      voiceStyle: "Voix empathique et bienveillante. Sans minimiser ni dramatiser. Style psychologue du travail.",
    };

  // ── SPORT À DOMICILE ──────────────────────────────────────
  if (p.match(/sport à domicile|entraînement maison|home.?workout|sans salle|body.?weight|hiit|musculation maison/))
    return {
      id: "sportdomicile",
      name: "Sport à Domicile",
      toneInstructions: "Ton motivant et pratique. Pas d'excuses. Résultats prouvés. Programme accessible.",
      structureInstructions: "Structure: 1) Plus d'excuses 2) Ce qu'on peut faire chez soi 3) La science derrière 4) Le programme clé 5) Commencer aujourd'hui",
      sceneTypes: "kinetic (énergie), counter (calories/semaines), split (excuse + solution), floatstats (résultats), card (programme), cta",
      voiceStyle: "Voix motivante et sans excuse. Programmes concrets. Résultats chiffrés. Style coach fitness.",
    };

  // ── DESIGN GRAPHIQUE ──────────────────────────────────────
  if (p.match(/design graphique|designer|identité visuelle|logo|typographie|couleurs|composition|canva|adobe/))
    return {
      id: "designgraphique",
      name: "Design Graphique",
      toneInstructions: "Ton esthétique et pédagogique. Principes expliqués visuellement. Exemples concrets. Sens du détail.",
      structureInstructions: "Structure: 1) Pourquoi le design compte 2) Les principes fondamentaux 3) Les erreurs communes 4) Les outils 5) S'améliorer",
      sceneTypes: "sentence (impact design), word (principe), split (mauvais + bon design), floatstats (impact business), card (règle), cta",
      voiceStyle: "Voix esthète et précise. Vocabulaire design assumé. Exemples visuels décrits. Style designer senior.",
    };

  // ── PHOTOGRAPHIE ──────────────────────────────────────────
  if (p.match(/photographie|photographe|photo|appareil|objectif|composition|lumière|reflex|mirrorless|iphone photo/))
    return {
      id: "photographie",
      name: "Photographie",
      toneInstructions: "Ton passionné et technique. Lumière comme obsession. Techniques accessibles. Œil qui s'éduque.",
      structureInstructions: "Structure: 1) La magie d'une photo 2) Ce que l'œil voit 3) Les règles de composition 4) La lumière 5) Progresser",
      sceneTypes: "sentence (magie), word (règle), split (photo banale + photo réussie), counter (règle des tiers), card (technique), cta",
      voiceStyle: "Voix contemplative et technique. Lumière décrite avec passion. Règles expliquées simplement.",
    };

  // ── STREET ART ────────────────────────────────────────────
  if (p.match(/street art|graffiti|banksy|murales|art urbain|spray|tag|fresque|artiste de rue/))
    return {
      id: "streetart",
      name: "Street Art",
      toneInstructions: "Ton culturel et rebelle. Histoire du mouvement. Artistes iconiques. Message politique/social.",
      structureInstructions: "Structure: 1) L'art qui prend la rue 2) Les pionniers 3) Les œuvres iconiques 4) Le message derrière 5) L'impact culturel",
      sceneTypes: "sentence (manifeste), word (artiste), reveal (œuvre), counter (valeur marchande), split (rue + galerie), zoompunch (message), cta",
      voiceStyle: "Voix rebelle et cultivée. Histoire du mouvement. Messages politiques respectés.",
    };

  // ── ARCHITECTURE ──────────────────────────────────────────
  if (p.match(/architecture|bâtiment|immeuble|architect|style|gothique|modernisme|zaha hadid|renzo piano|structure/))
    return {
      id: "architecture",
      name: "Architecture",
      toneInstructions: "Ton esthétique et culturel. Histoire des styles. Fonctionnel et beau. Détails révélateurs.",
      structureInstructions: "Structure: 1) Le bâtiment/style 2) L'histoire derrière 3) Les caractéristiques 4) L'impact culturel 5) L'héritage",
      sceneTypes: "sentence (description), reveal (style), counter (dates/dimensions), split (technique + esthétique), card (caractéristique), zoompunch (héritage), cta",
      voiceStyle: "Voix esthète et historique. Détails architecturaux vivants. Style critique d'architecture.",
    };

  // ── ÉCRITURE CRÉATIVE ─────────────────────────────────────
  if (p.match(/écriture|roman|nouvell|scénario|storytelling|auteur|plume|narration|personnage|intrigue/))
    return {
      id: "ecriture",
      name: "Écriture Créative",
      toneInstructions: "Ton littéraire et inspirant. Techniques des grands auteurs. Conseils pratiques. Amour des mots.",
      structureInstructions: "Structure: 1) Le pouvoir des mots 2) Les techniques des pros 3) Les erreurs des débutants 4) Les exercices efficaces 5) Écrire maintenant",
      sceneTypes: "sentence (belle phrase), word (technique), split (mauvaise + bonne écriture), card (conseil auteur), counter (mots/jour), cta",
      voiceStyle: "Voix littéraire et inspirante. Citations d'auteurs. Amour viscéral des mots. Style atelier d'écriture.",
    };

  // ── NFT ART ───────────────────────────────────────────────
  if (p.match(/nft|token non fongible|crypto art|opensea|bored ape|digital art|web3 art|créateur numérique/))
    return {
      id: "nftart",
      name: "NFT Art",
      toneInstructions: "Ton analytique et nuancé. Boom et crash honnêtement présentés. Avenir de l'art numérique.",
      structureInstructions: "Structure: 1) Le phénomène 2) Ce que c'est vraiment 3) Les chiffres (boom/crash) 4) Ce qui reste 5) L'avenir",
      sceneTypes: "glitch (volatilité), counter (ventes record), chart (évolution marché), split (hype + réalité), card (avenir), cta",
      voiceStyle: "Voix analytique et nuancée. Ni hype ni déni. Chiffres du marché réels.",
    };

  // ── ANIMATION ─────────────────────────────────────────────
  if (p.match(/animation|dessin animé|pixar|studio ghibli|anime|manga|2d|3d|motion design|animator/))
    return {
      id: "animation",
      name: "Animation",
      toneInstructions: "Ton passionné et technique. Magie dévoilée. Histoire des studios. Artisanat valorisé.",
      structureInstructions: "Structure: 1) La magie de l'animation 2) Les principes fondamentaux 3) Les studios iconiques 4) Les chiffres 5) L'art derrière",
      sceneTypes: "sentence (magie), word (principe animation), reveal (studio), counter (images par seconde), split (technique + résultat), card (studio), cta",
      voiceStyle: "Voix passionnée et technique. Magie et artisanat. Style making-of Pixar.",
    };

  // ── SCULPTURE ─────────────────────────────────────────────
  if (p.match(/sculpture|sculpteur|marbre|bronze|rodin|michelange|statue|installation|art 3d|matière/))
    return {
      id: "sculpture",
      name: "Sculpture",
      toneInstructions: "Ton contemplatif et sensoriel. Matière décrite avec passion. Histoire et technique. Art qui dure.",
      structureInstructions: "Structure: 1) La matière vivante 2) Le sculpteur/l'œuvre 3) La technique 4) Le message 5) L'émotion durable",
      sceneTypes: "sentence (matière), reveal (œuvre), word (technique), counter (années/dimensions), split (technique + sens), card (sculpteur), cta",
      voiceStyle: "Voix contemplative et sensorielle. Matière décrite physiquement. Art qui traverse le temps.",
    };

  // ── PUB PRODUIT (défaut) ──────────────────────────────────
  return {
    id: "pub",
    name: "Pub Produit",
    toneInstructions: "Ton promotionnel et impactant. Bénéfices clairs. Chiffres forts. Appel à l'action direct.",
    structureInstructions: "Structure: 1) Accroche impact 2) Présentation marque/produit 3) Chiffre clé 4) Preuves/stats 5) Vision 6) CTA",
    sceneTypes: "sentence (accroche), glitch (titre marque), counter (chiffre fort), floatstats (3 stats), chart (croissance), zoompunch (impact), cta",
    voiceStyle: "Phrases courtes et percutantes. Mots d'action. Rythme dynamique. Style Apple/Nike.",
  };
}

// ÉTAPE 1 — Couleur (Claude) + script voix
export async function generateVoiceText(params: {
  prompt: string;
  duration: string;
}): Promise<{
  voiceoverText: string;
  accentColor: string;
  bgAccent: string;
  bgLight: string;
  formatId: string;
  formatName: string;
}> {
  const { prompt, duration } = params;
  const durationSec = parseInt(String(duration), 10) || 30;
  const wordsCount = Math.round(durationSec * 2.5);
  const format = detectVideoFormat(prompt);

  const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1200,
    system: `Tu es un directeur artistique expert.
Tu analyses un sujet et génères deux choses:
1. La couleur hexadécimale la plus représentative du sujet
2. Le script voix off

RETOURNE UNIQUEMENT CE FORMAT JSON:
{
  "color": "#hexcode",
  "voice": "le script voix ici"
}

RÈGLES COULEUR — pense visuellement:
- Marque connue → sa couleur officielle exacte (Google=#4285f4, Spotify=#1db954, Netflix=#e50914, Apple=#1d1d1f, Nike=#000000, etc.)
- Sujet nature/écologie → vert (#22c55e ou similaire)
- Sujet espace/cosmos/nuit → violet/indigo (#8b5cf6 ou similaire)
- Sujet soleil/été/chaleur → jaune/orange (#f59e0b ou similaire)
- Sujet ocean/eau/ciel → bleu clair (#38bdf8 ou similaire)
- Sujet feu/passion/énergie → rouge (#ef4444 ou similaire)
- Sujet luxe/or/premium → doré (#d97706 ou similaire)
- Sujet tech/IA/futur → violet (#7c3aed ou similaire)
- Sujet finance/crypto → vert (#10b981 ou similaire)
- Sujet sport/fitness → orange vif (#f97316 ou similaire)
- Sujet food/cuisine → orange chaud (#ea580c ou similaire)
- Sujet musique → rose/rouge (#ec4899 ou similaire)
- Sujet histoire/culture → ambre (#b45309 ou similaire)
- Sujet science → cyan (#06b6d4 ou similaire)
- Sujet politique/société → bleu (#3b82f6 ou similaire)
- Sujet santé/médecine → vert menthe (#059669 ou similaire)
- Sujet voyage → bleu turquoise (#0891b2 ou similaire)
- Sujet motivation → orange énergique (#f97316 ou similaire)
- Par défaut → blanc (#ffffff)

RÈGLES VOIX:
Format: ${format.name}
Style: ${format.voiceStyle}
- Génère un script voix de exactement ${durationSec} secondes — soit environ ${wordsCount} mots. PAS PLUS COURT.
- EXACTEMENT ${wordsCount} mots (minimum)
- Chaque phrase sur une NOUVELLE LIGNE
- Phrases très courtes (4-8 mots max)
- En français`,
    messages: [{
      role: "user",
      content: `Sujet: "${prompt}" — Génère un script voix de exactement ${durationSec} secondes — soit environ ${wordsCount} mots. PAS PLUS COURT.`,
    }],
  });

  const raw = response.content[0].type === "text" ? response.content[0].text.trim() : "{}";
  let clean = raw.replace(/^```json\n?/m, "").replace(/\n?```$/m, "").trim();
  const s = clean.indexOf("{"), e = clean.lastIndexOf("}");
  if (s !== -1 && e !== -1) clean = clean.slice(s, e + 1);

  let result: VoiceTextJson = {};
  try {
    result = JSON.parse(clean) as VoiceTextJson;
  } catch {
    result = { color: "#ffffff", voice: prompt };
  }

  const accentColor = result.color || "#ffffff";
  const voiceoverText = result.voice || prompt;

  return {
    voiceoverText,
    accentColor,
    bgAccent: accentColor,
    bgLight: "#ffffff",
    formatId: format.id,
    formatName: format.name,
  };
}

// ÉTAPE 2 — Générer les scènes à partir de la voix
export async function generateScenesFromVoice(params: {
  prompt: string;
  voiceoverText: string;
  audioDuration: number;
  format: string;
  accentColor?: string;
  bgDark?: string[];
  bgLight?: string;
  bgAccent?: string;
  phraseTimestamps?: PhraseTimestamp[];
  formatId?: string;
}): Promise<{ scenes: MotionScene[]; durationPerScene: number; sceneDurations: number[] }> {
  const { prompt, voiceoverText, audioDuration, phraseTimestamps } = params;

  const detectedFormat = detectVideoFormat(params.prompt);
  const formatId = params.formatId || detectedFormat.id;

  const formatGuidance = `
FORMAT ID: ${formatId}
FORMAT DE LA VIDÉO: ${detectedFormat.name}
STRUCTURE: ${detectedFormat.structureInstructions}
TYPES PRIORITAIRES: ${detectedFormat.sceneTypes}
`;

  const bgAccent = params.bgAccent || DEFAULT_BG_ACCENT;

  const accentColor = params.accentColor || DEFAULT_COLORS.accent;
  const fps = 60;

  const phrases = voiceoverText
    .split("\n")
    .map(p => p.trim())
    .filter(p => p.length > 0);

  const nbScenes = phrases.length;

  if (nbScenes === 0) {
    return { scenes: [], durationPerScene: 120, sceneDurations: [] };
  }

  const FADE_FRAMES = 18;

  // Ajuster les durées pour que la somme - overlaps = totalFrames
  const rawDurations = phraseTimestamps && phraseTimestamps.length === nbScenes
    ? phraseTimestamps.map(pt => Math.max(120, Math.min(300, pt.durationFrames)))
    : (() => {
        const wordCounts = phrases.map(p => p.split(" ").filter(w => w.length > 0).length);
        const totalWords = wordCounts.reduce((a, b) => a + b, 0);
        const totalFrames = Math.round(audioDuration * fps);
        if (totalWords === 0) {
          return phrases.map(() => Math.max(120, Math.round(totalFrames / nbScenes)));
        }
        return wordCounts.map(wc =>
          Math.min(300, Math.max(120, Math.round((wc / totalWords) * totalFrames))),
        );
      })();

  // Recalibrer pour que sum(durations) - (n-1)*FADE_FRAMES = totalFrames
  const targetTotal = Math.round(audioDuration * fps) + (nbScenes - 1) * FADE_FRAMES;
  const currentSum  = rawDurations.reduce((a, b) => a + b, 0);
  const ratio = currentSum > 0 ? targetTotal / currentSum : 1;
  const sceneDurations = rawDurations.map(d => Math.max(120, Math.round(d * ratio)));

  const durationPerScene = Math.round(sceneDurations.reduce((a, b) => a + b, 0) / nbScenes);

  const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 4000,
    system: `${buildPremiumSceneSystemPrompt(accentColor)}${formatGuidance ? `\n\n${formatGuidance}` : ""}

${MOTION_GOLDEN_RULES}

RÈGLES VOIX-OFF:
- Une scène par phrase exactement (${nbScenes} scènes)
- Phrases fournies = texte voix ; "text" = 1 à 3 mots courts, une seule ligne (pas de text2)
- Types autorisés : singleword, maskreveal, slideword, zoomword, fadeupl, blurin, scalein, slideup, cliptop, staggerwords, fadepure, tracking, rotatein, photoreveal, photocollage, counter, progressbar, multistats, accentword, underline, colorshift
- Scènes photo : photoQuery en anglais obligatoire (ex: "team meeting office")
- Alterner bg #ffffff et #000000 ; varier les types — jamais deux identiques consécutifs`,
    messages: [{
      role: "user",
      content: `Sujet: "${prompt}" — Accent: ${accentColor}
Phrases (${nbScenes}):
${phrases.map((p, i) => `${i + 1}. "${p}" [${sceneDurations[i]}f = ${(sceneDurations[i] / fps).toFixed(1)}s]`).join("\n")}

Crée exactement ${nbScenes} scènes.`,
    }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "{}";
  let clean = text.trim()
    .replace(/^```json\n?/m, "").replace(/^```\n?/m, "").replace(/\n?```$/m, "").trim();
  const s = clean.indexOf("{"), e = clean.lastIndexOf("}");
  if (s !== -1 && e !== -1) clean = clean.slice(s, e + 1);
  clean = clean.replace(/,(\s*[}\]])/g, "$1");

  let result: { scenes?: MotionScene[] };
  try {
    result = JSON.parse(clean) as { scenes?: MotionScene[] };
  } catch {
    throw new Error("Scènes invalides — réessaie");
  }

  const scenes = (result.scenes || []).map((scene, i: number) => ({
    ...scene,
    _duration: sceneDurations[i] || durationPerScene,
  }));

  return { scenes, durationPerScene, sceneDurations };
}

// Gardé pour compatibilité
export async function generateVideoScript(params: {
  prompt: string;
  duration: string;
  format: string;
}): Promise<{ voiceoverText: string; scenes: MotionScene[]; accentColor: string; durationPerScene: number }> {
  const { voiceoverText, accentColor, bgLight, bgAccent, formatId } = await generateVoiceText({
    prompt: params.prompt,
    duration: params.duration,
  });

  const fps = 60;
  const totalFrames = parseInt(params.duration) * fps;
  const nbScenes = parseInt(params.duration) === 30 ? 7 : parseInt(params.duration) === 60 ? 10 : 18;
  const durationPerScene = Math.round(totalFrames / nbScenes);

  const { scenes } = await generateScenesFromVoice({
    prompt: params.prompt,
    voiceoverText,
    audioDuration: parseInt(params.duration),
    format: params.format,
    accentColor,
    bgLight,
    bgAccent,
    formatId,
  });

  return { voiceoverText, scenes, accentColor, durationPerScene };
}
