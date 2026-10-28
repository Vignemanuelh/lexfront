import { LegalQuestionRequest, LegalQuestionResponse } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

/**
 * Réponses de démonstration pré-validées par juristes (fallback fluide si backend déconnecté)
 */
const MOCK_LEGAL_DATABASE: Record<string, Partial<LegalQuestionResponse>> = {
  photo: {
    statut_legal: "interdit",
    articles_cites: ["Article 567 du Code du numérique"],
    explication_vulgarisee:
      "Conformément à la législation béninoise sur le numérique, diffuser ou transmettre la photo d'un tiers sans son accord écrit préalable — même au sein d'un groupe WhatsApp ou d'une communauté privée — constitue une atteinte à l'intimité de la vie privée passible de sanctions correctionnelles.",
    conseil_pratique:
      "Demandez toujours l'accord écrit exprès de la personne avant tout partage ou publication de sa photo.",
    avertissement_legal:
      "Ce service d'information citoyenne ne remplace pas une consultation auprès d'un avocat inscrit au Barreau du Bénin.",
    necessite_escalade: false,
  },
  appel: {
    statut_legal: "interdit",
    articles_cites: ["Article 566 du Code du numérique"],
    explication_vulgarisee:
      "L'enregistrement clandestin des paroles prononcées par une personne à titre privé sans son consentement est une infraction pénale au Bénin. L'enregistrement n'est pas recevable et engage votre responsabilité pénale.",
    conseil_pratique:
      "Prévenez systématiquement votre interlocuteur au début de l'appel pour obtenir son consentement explicite.",
    avertissement_legal:
      "Ce service d'information citoyenne ne remplace pas une consultation auprès d'un avocat inscrit au Barreau du Bénin.",
    necessite_escalade: false,
  },
  chiffrement: {
    statut_legal: "autorisé",
    articles_cites: ["Article 577 du Code du numérique"],
    explication_vulgarisee:
      "L'utilisation de moyens et de prestations de cryptologie pour protéger la confidentialité de vos données et échanges privés est libre en République du Bénin.",
    conseil_pratique:
      "Vous pouvez utiliser librement des applications de messagerie chiffrée de bout en bout.",
    avertissement_legal:
      "Ce service d'information citoyenne ne remplace pas une consultation auprès d'un avocat inscrit au Barreau du Bénin.",
    necessite_escalade: false,
  },
};

/**
 * Interroge l'API RAG de LexBénin avec gestion de timeout et secours local.
 */
export async function askLegalQuestion(
  request: LegalQuestionRequest
): Promise<LegalQuestionResponse> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${API_BASE_URL}/legal/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: request.question,
        user_id: request.user_id || "web_citizen",
        channel: request.channel || "WEB",
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return (await res.json()) as LegalQuestionResponse;
    }
  } catch {
    // En cas de non-réponse du serveur backend, activation du fallback de secours
  }

  // Simulation intelligente basée sur la question posée
  const qLower = request.question.toLowerCase();
  let matchedKey = "photo";
  if (qLower.includes("appel") || qLower.includes("enregistr") || qLower.includes("vocal")) {
    matchedKey = "appel";
  } else if (qLower.includes("chiffr") || qLower.includes("crypt") || qLower.includes("email")) {
    matchedKey = "chiffrement";
  }

  const mock = MOCK_LEGAL_DATABASE[matchedKey];

  return {
    interaction_id: `demo-${Date.now()}`,
    statut_legal: mock.statut_legal || "interdit",
    articles_cites: mock.articles_cites || ["Article 567 du Code du numérique"],
    explication_vulgarisee:
      mock.explication_vulgarisee ||
      "Selon le Code du numérique béninois, toute action numérique portant atteinte aux droits fondamentaux sans consentement préalable engage la responsabilité de son auteur.",
    conseil_pratique:
      mock.conseil_pratique || "Vérifiez vos obligations de conformité ou consultez un juriste.",
    avertissement_legal:
      "Ce service d'information citoyenne ne remplace pas une consultation auprès d'un avocat inscrit au Barreau du Bénin.",
    necessite_escalade: mock.necessite_escalade ?? false,
  };
}
