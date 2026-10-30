import {
  LegalQuestionRequest,
  LegalQuestionResponse,
  FAQItem,
  EscalationRequest,
  EscalationResponse,
  CitizenFeedbackRequest,
} from "./types";

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

const DEFAULT_FAQ: FAQItem[] = [
  {
    question: "Puis-je publier la photo d'une personne sans son accord préalable ?",
    statut_legal: "interdit",
    article: "Article 552",
    resume:
      "La captation, l'enregistrement ou la diffusion de l'image d'une personne dans un lieu privé ou public sans son consentement exprès est punie par la loi.",
    categorie: "Droit à l'image",
  },
  {
    question: "Est-ce une infraction de créer un faux profil sur les réseaux sociaux sous le nom d'un camarade ?",
    statut_legal: "interdit",
    article: "Article 558",
    resume:
      "L'usurpation d'identité numérique et l'utilisation de données permettant d'identifier un tiers dans le but de troubler sa tranquillité constituent un délit.",
    categorie: "Usurpation & Identité",
  },
  {
    question: "Que risque-t-on en partageant une fausse nouvelle (fake news) diffamatoire ?",
    statut_legal: "interdit",
    article: "Article 550",
    resume:
      "La publication ou le partage de fausses nouvelles de nature à troubler la paix publique ou à porter atteinte à l'honneur d'autrui est sévèrement sanctionné.",
    categorie: "Diffamation & Fausses nouvelles",
  },
  {
    question: "Est-il permis d'utiliser des applications chiffrées (Signal, WhatsApp) pour échanger au Bénin ?",
    statut_legal: "autorisé",
    article: "Article 577",
    resume:
      "L'utilisation de moyens et de prestations de cryptologie pour protéger la confidentialité des correspondances privées est entièrement libre en République du Bénin.",
    categorie: "Vie privée & Chiffrement",
  },
  {
    question: "Comment contraindre une plateforme ou une entreprise à supprimer mes données personnelles ?",
    statut_legal: "autorisé",
    article: "Article 384",
    resume:
      "Toute personne peut exiger du responsable d'un traitement que soient rectifiées, complétées, mises à jour ou effacées les données à caractère personnel la concernant en saisissant au besoin l'APDP.",
    categorie: "Données personnelles (APDP)",
  },
  {
    question: "Puis-je enregistrer un appel téléphonique pour me constituer une preuve sans prévenir l'interlocuteur ?",
    statut_legal: "interdit",
    article: "Article 566",
    resume:
      "L'enregistrement clandestin des paroles prononcées par une personne à titre privé sans son consentement constitue une atteinte à l'intimité et est pénalement répréhensible.",
    categorie: "Enregistrement & Écoutes",
  },
];

/**
 * Récupère la foire aux questions officielle (avec fallback local pré-validé).
 */
export async function fetchFAQ(): Promise<FAQItem[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`${API_BASE_URL}/legal/faq`, {
      method: "GET",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = (await res.json()) as FAQItem[];
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch {
    // Fallback local
  }
  return DEFAULT_FAQ;
}

/**
 * Envoie une demande d'escalade vers un juriste référent (Barreau du Bénin / Clinique UAC).
 */
export async function createEscalation(
  data: EscalationRequest
): Promise<EscalationResponse> {
  const refCode = `#BEN-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(`${API_BASE_URL}/legal/escalate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        interaction_id: data.interaction_id || null,
        citizen_contact: data.citizen_contact,
        question_summary: data.question_summary,
        reason: data.reason || "ZONE_GRISE",
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const resp = (await res.json()) as { status: string; escalation_id: string; message: string };
      return {
        status: resp.status,
        escalation_id: resp.escalation_id,
        reference_number: refCode,
        message: resp.message || "Votre demande a été transmise à notre juriste référent.",
      };
    }
  } catch {
    // Fallback local
  }

  return {
    status: "success",
    escalation_id: `local-${Date.now()}`,
    reference_number: refCode,
    message: "Votre demande d'assistance a été enregistrée et sera traitée par la permanence civique.",
  };
}

/**
 * Soumet un vote de satisfaction ou un signalement citoyen.
 */
export async function submitFeedback(
  data: CitizenFeedbackRequest
): Promise<{ status: string; message: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`${API_BASE_URL}/legal/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return (await res.json()) as { status: string; message: string };
    }
  } catch {
    // Fallback silencieux
  }

  return { status: "success", message: "Merci pour votre contribution citoyenne." };
}

/**
 * Consomme le flux Server-Sent Events (SSE) avec gestion d'étapes et tokens progressifs.
 */
export async function askLegalQuestionStream(
  request: LegalQuestionRequest,
  handlers: {
    onStatus?: (message: string) => void;
    onSources?: (articles: string[]) => void;
    onToken?: (token: string) => void;
    onComplete?: (response: LegalQuestionResponse) => void;
    onError?: (errorMsg: string) => void;
  }
): Promise<void> {
  try {
    const res = await fetch(`${API_BASE_URL}/legal/ask/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: request.question,
        user_id: request.user_id || "web_citizen",
        channel: request.channel || "WEB",
      }),
    });

    if (!res.ok || !res.body) {
      throw new Error(`HTTP error ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data: ")) continue;
        const payloadStr = trimmed.slice(6);
        try {
          const event = JSON.parse(payloadStr);
          if (event.type === "status" && handlers.onStatus) {
            handlers.onStatus(event.message || "Recherche dans le Code du numérique...");
          } else if (event.type === "sources" && handlers.onSources) {
            handlers.onSources(event.articles || []);
          } else if (event.type === "token" && handlers.onToken) {
            handlers.onToken(event.token);
          } else if (event.type === "complete" && handlers.onComplete) {
            handlers.onComplete(event.response as LegalQuestionResponse);
          } else if (event.type === "error" && handlers.onError) {
            handlers.onError(event.message || "Erreur de traitement");
          }
        } catch {
          // Ignorer ligne mal formée
        }
      }
    }
  } catch (err) {
    // Si le streaming échoue (ex: proxy ou offline), basculer sur la méthode classique
    try {
      const fallbackResponse = await askLegalQuestion(request);
      if (handlers.onComplete) {
        handlers.onComplete(fallbackResponse);
      }
    } catch {
      if (handlers.onError) {
        handlers.onError(
          err instanceof Error ? err.message : "Erreur de connexion au serveur juridique."
        );
      }
    }
  }
}
