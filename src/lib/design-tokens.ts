/**
 * LexBénin Design Tokens
 * Spécification programmable et centralisée du Design System (America.gov + République du Bénin).
 * Consulter DESIGN.md pour la documentation complète.
 */

export const DESIGN_TOKENS = {
  colors: {
    canvas: {
      light: "#F7F7F5",
      dark: "#0B0D12",
      className: "bg-[#F7F7F5] dark:bg-[#0B0D12]",
    },
    card: {
      light: "#FFFFFF",
      dark: "#0F1217",
      className: "bg-white dark:bg-[#0F1217]",
    },
    cardElevated: {
      light: "#F7F7F5",
      dark: "#14171D",
      className: "bg-[#F7F7F5] dark:bg-[#14171D]",
    },
    surfaceSubtle: {
      light: "#EFECE6",
      dark: "#1A202C",
      className: "bg-[#EFECE6] dark:bg-[#1A202C]",
    },
    text: {
      primary: {
        light: "#0A0D14",
        dark: "#FFFFFF",
        className: "text-[#0A0D14] dark:text-white",
      },
      muted: {
        light: "#525866",
        dark: "rgba(255, 255, 255, 0.70)",
        className: "text-[#525866] dark:text-white/70",
      },
      subtle: {
        light: "#88909E",
        dark: "rgba(255, 255, 255, 0.40)",
        className: "text-[#88909E] dark:text-white/40",
      },
    },
    border: {
      subtle: "border-[#E5E7EB] dark:border-white/10",
      medium: "border-black/15 dark:border-white/20",
    },
    accent: {
      navy: "#0F2942",
      blue: {
        light: "#0F2942",
        dark: "#0066C5",
        darkHover: "#1A75D0",
      },
      selection: {
        light: "#0F2942",
        dark: "#1B51FF",
      },
    },
    beninFlag: {
      green: "#008751",
      gold: "#FCD116",
      red: "#E8112D",
    },
    verdict: {
      autorisé: {
        bg: "bg-emerald-50 dark:bg-emerald-950/40",
        border: "border-emerald-300 dark:border-emerald-700/50",
        text: "text-emerald-800 dark:text-emerald-300",
        dot: "#10B981",
        label: "Autorisé",
      },
      "à risque": {
        bg: "bg-amber-50 dark:bg-amber-950/40",
        border: "border-amber-300 dark:border-amber-700/50",
        text: "text-amber-800 dark:text-amber-300",
        dot: "#F59E0B",
        label: "À risque",
      },
      "zone grise": {
        bg: "bg-amber-50 dark:bg-amber-950/40",
        border: "border-amber-300 dark:border-amber-700/50",
        text: "text-amber-800 dark:text-amber-300",
        dot: "#F59E0B",
        label: "Zone grise",
      },
      interdit: {
        bg: "bg-red-50 dark:bg-red-950/40",
        border: "border-red-300 dark:border-red-700/50",
        text: "text-red-800 dark:text-red-300",
        dot: "#EF4444",
        label: "Interdit",
      },
    },
  },
  typography: {
    editorial: "font-editorial tracking-[-0.025em]",
    sans: "font-sans",
    mono: "font-mono",
  },
  spacing: {
    containerMaxWidth: "max-w-4xl",
    containerPadding: "px-4 sm:px-6",
    dockSafeBottomPadding: "pb-24 sm:pb-28",
  },
} as const;

export type LegalStatusType = "autorisé" | "interdit" | "à risque" | "zone grise";

/**
 * Retourne la configuration de styles pour un statut juridique donné.
 */
export function getVerdictConfig(status: LegalStatusType | string) {
  const normalized = (status || "").toLowerCase().trim();
  if (normalized.includes("autoris")) {
    return DESIGN_TOKENS.colors.verdict["autorisé"];
  }
  if (normalized.includes("interdit") || normalized.includes("infraction")) {
    return DESIGN_TOKENS.colors.verdict["interdit"];
  }
  if (normalized.includes("zone grise")) {
    return DESIGN_TOKENS.colors.verdict["zone grise"];
  }
  return DESIGN_TOKENS.colors.verdict["à risque"];
}
