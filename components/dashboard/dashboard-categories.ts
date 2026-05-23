import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Building2,
  Film,
  GraduationCap,
  Image as ImageIcon,
  Newspaper,
  Pencil,
  Rocket,
  Smartphone,
  Zap,
} from "lucide-react";
import { copy } from "@/lib/dashboard/copy";
import type { InputTab } from "@/lib/dashboard/types";

export const INPUT_TABS: {
  id: InputTab;
  Icon: LucideIcon;
  label: string;
  hint: string;
}[] = [
  { id: "prompt", Icon: Pencil, label: copy.tabPrompt, hint: copy.tabPromptHint },
  { id: "screenshot", Icon: ImageIcon, label: copy.tabImage, hint: copy.tabImageHint },
];

export const PROMPT_SUGGESTIONS: { Icon: LucideIcon; label: string }[] = [
  { Icon: Rocket, label: "Produit & Démo" },
  { Icon: Building2, label: "Brand & Marque" },
  { Icon: GraduationCap, label: "Éducatif" },
  { Icon: BarChart3, label: "Data & Stats" },
  { Icon: Smartphone, label: "Réseaux sociaux" },
  { Icon: Film, label: "Storytelling" },
  { Icon: Newspaper, label: "News" },
  { Icon: Zap, label: "Motivation" },
];
