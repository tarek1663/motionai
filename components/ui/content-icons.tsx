import type { LucideIcon } from "lucide-react";
import {
  Rocket,
  Building2,
  GraduationCap,
  BarChart3,
  Smartphone,
  Clapperboard,
  Newspaper,
  Flame,
  PenLine,
  Film,
  Settings,
} from "lucide-react";

export const PROMPT_CATEGORIES: { Icon: LucideIcon; label: string; prompt: string }[] = [
  {
    Icon: Rocket,
    label: "Produit & Démo",
    prompt:
      "Présente Spotify, la révolution musicale en streaming — comment l'app a changé notre façon d'écouter la musique.",
  },
  {
    Icon: Building2,
    label: "Brand & Marque",
    prompt:
      "Raconte l'histoire de Nike : de Oregon à la marque sportive la plus iconique au monde, avec son slogan Just Do It.",
  },
  {
    Icon: GraduationCap,
    label: "Éducatif",
    prompt:
      "Explique comment fonctionne l'intelligence artificielle en 60 secondes, du simple au complexe, avec des exemples concrets.",
  },
  {
    Icon: BarChart3,
    label: "Data & Stats",
    prompt:
      "Les chiffres clés de la transition énergétique en 2024 : parts renouvelables, croissance solaire, objectifs climat.",
  },
  {
    Icon: Smartphone,
    label: "Réseaux sociaux",
    prompt:
      "Crée une pub punchy pour une app fitness : accroche TikTok, bénéfices en 3 points, call-to-action télécharger.",
  },
  {
    Icon: Clapperboard,
    label: "Storytelling",
    prompt:
      "Raconte l'histoire de Tesla en motion design : de startup risquée à leader mondial de l'électrique.",
  },
  {
    Icon: Newspaper,
    label: "News",
    prompt:
      "Format journal TV : les 3 actus tech de la semaine — IA, semi-conducteurs, et régulation européenne.",
  },
  {
    Icon: Flame,
    label: "Motivation",
    prompt:
      "Top 5 astuces productivité pour créateurs de contenu : focus, batching, outils, routine matinale, repos.",
  },
];

export const SAMPLE_PLACEHOLDERS = PROMPT_CATEGORIES.map((c) => c.prompt);

export const chipIconProps = {
  size: 18,
  strokeWidth: 1.5,
  className: "text-[#86868b] shrink-0",
} as const;

export const navIconProps = {
  size: 28,
  strokeWidth: 1.75,
} as const;

export { PenLine, Film, Settings, Clapperboard };

export { PartyPopper } from "lucide-react";
