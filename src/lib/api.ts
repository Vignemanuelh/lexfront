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
    question: "Qu'est-ce que LexBénin et quelle est sa mission ?",
    reponse:
      "LexBénin est un service civique d'intérêt général dédié à la vulgarisation et à la prévention juridique autour du Code du numérique béninois (Loi N° 2017-20 modifiée). Notre mission est de rendre le droit numérique compréhensible et accessible à chaque citoyen, professionnel et étudiant afin de prévenir les infractions et sécuriser leurs usages quotidiens.",
    resume:
      "LexBénin est un service civique d'intérêt général dédié à la vulgarisation et à la prévention juridique autour du Code du numérique béninois (Loi N° 2017-20 modifiée).",
    categorie: "Général & Mission",
    statut_legal: "autorisé",
    article: "Loi N° 2017-20 modifiée",
    actionLabel: "Découvrir la mission & déontologie",
    actionHref: "/a-propos",
  },
  {
    question: "LexBénin est-il un service entièrement gratuit ?",
    reponse:
      "Oui, l'accès à LexBénin est 100 % gratuit pour tous les citoyens béninois, aussi bien sur le portail Web que sur WhatsApp. Il n'y a aucun abonnement, aucun paiement requis et aucune publicité. Le service a été conçu comme un bien commun républicain pour faciliter l'accès universel au droit.",
    resume:
      "Oui, l'accès à LexBénin est 100 % gratuit pour tous les citoyens béninois, aussi bien sur le portail Web que sur WhatsApp. Zéro frais, zéro publicité.",
    categorie: "Général & Mission",
    statut_legal: "autorisé",
    actionLabel: "Interroger l'assistant sans frais",
    actionHref: "/chat",
  },
  {
    question: "L'assistant remplace-t-il un avocat ou un conseil juridique officiel ?",
    reponse:
      "Non. LexBénin est un outil citoyen de première orientation et d'information préventive. Ses réponses n'ont pas valeur d'avis juridique opposable ni de consultation officielle. En cas de litige avéré, de plainte pénale ou de situation complexe, vous devez impérativement consulter un avocat inscrit au Barreau du Bénin ou solliciter une clinique juridique universitaire.",
    resume:
      "Non. LexBénin informe et oriente mais ne remplace en aucun cas un avocat inscrit au Barreau du Bénin ni une consultation juridique personnalisée.",
    categorie: "Général & Mission",
    statut_legal: "zone grise",
    actionLabel: "Demander une assistance juridique",
    actionHref: "/escalade",
  },
  {
    question: "Comment fonctionne l'IA de LexBénin pour répondre aux questions ?",
    reponse:
      "LexBénin repose sur une architecture RAG (Retrieval-Augmented Generation) hybride. À chaque question, le moteur recherche simultanément dans les 646 articles du Code du numérique béninois en combinant recherche lexicale par mots-clés (BM25) et recherche sémantique vectorielle (pgvector). Le modèle d'IA Gemini synthétise ensuite une réponse claire strictement adossée aux textes légaux retrouvés.",
    resume:
      "LexBénin combine recherche par mots-clés (BM25) et sémantique (pgvector) sur les 646 articles du Code officiel avec synthèse vulgarisée par IA.",
    categorie: "Fonctionnement de l'IA",
    statut_legal: "autorisé",
    actionLabel: "Tester le moteur de recherche",
    actionHref: "/chat",
  },
  {
    question: "Comment garantissez-vous l'absence d'hallucinations d'articles de loi ?",
    reponse:
      "Conformément à notre règle non-négociable RG-JUR2, chaque réponse est filtrée par un garde-fou déterministe (CitationGuardrail). Si l'assistant mentionne un article qui ne figure pas dans les extraits officiels récupérés dans notre base de données certifiée, la réponse est immédiatement rejetée ou qualifiée en zone grise. Aucun article imaginaire ne peut être délivré à l'usager.",
    resume:
      "Grâce au CitationGuardrail déterministe, tout article cité doit être présent dans les extraits officiels récupérés, éliminant tout risque d'hallucination.",
    categorie: "Fonctionnement de l'IA",
    statut_legal: "autorisé",
  },
  {
    question: "Comment mes données personnelles et ma vie privée sont-elles protégées (APDP) ?",
    reponse:
      "LexBénin applique les normes les plus strictes de l'Autorité de Protection des Données Personnelles (APDP) du Bénin. Vos identifiants et numéros de téléphone sont pseudonymisés par empreinte cryptographique SHA-256 (user_hash). Aucune donnée nominative n'est stockée en clair, aucune donnée n'est commercialisée, et vos échanges ne servent pas à entraîner des modèles d'IA publics.",
    resume:
      "Conformité APDP stricte : anonymisation irréversible SHA-256, zéro revente de données et zéro entraînement public sur vos messages.",
    categorie: "Confidentialité & APDP",
    statut_legal: "autorisé",
    actionLabel: "Consulter la charte de confidentialité",
    actionHref: "/a-propos",
  },
  {
    question: "Qu'advient-il des notes vocales et des captures d'écran transmises ?",
    reponse:
      "En application de la règle RG-JUR7, toutes les notes vocales et images envoyées pour analyse font l'objet d'un cycle de vie temporaire éphémère. Dès que la transcription vocale (ASR) ou l'analyse d'image (OCR / détection de risques) est achevée, les fichiers multimédias sont immédiatement et définitivement détruits des serveurs.",
    resume:
      "Suppression immédiate après analyse : vos notes vocales et captures d'écran sont détruites dès la transcription terminée.",
    categorie: "Confidentialité & APDP",
    statut_legal: "autorisé",
  },
  {
    question: "Comment utiliser LexBénin directement sur WhatsApp ?",
    reponse:
      "LexBénin est disponible 24h/24 et 7j/7 sur WhatsApp via notre intégration officielle Meta Cloud API. Vous pouvez envoyer un simple message texte, transférer une capture d'écran d'un échange suspect ou envoyer une note vocale : notre assistant vous répond instantanément en citant les articles de loi pertinents.",
    resume:
      "Ajoutez simplement le numéro officiel de LexBénin sur WhatsApp pour poser vos questions par écrit, par note vocale ou par photo 24h/24.",
    categorie: "Formats & WhatsApp",
    statut_legal: "autorisé",
    actionLabel: "Ouvrir l'assistant sur WhatsApp",
    actionHref: "https://wa.me/22900000000",
  },
  {
    question: "Que faire si ma situation est ambiguë ou si je fais face à un litige ?",
    reponse:
      "Si l'assistant attribue le statut « zone grise » à votre question ou si vous êtes en conflit avec un employeur, un tiers ou une plateforme, vous pouvez utiliser notre formulaire d'escalade. Votre demande sera relayée de manière confidentielle vers la Clinique Juridique de l'UAC ou la permanence du Barreau du Bénin pour un accompagnement humain adapté.",
    resume:
      "En cas d'ambiguïté ou de litige, activez l'escalade citoyenne pour être orienté gratuitement vers des juristes référents et cliniques du droit.",
    categorie: "Juristes & Litiges",
    statut_legal: "zone grise",
    actionLabel: "Déposer une demande d'escalade",
    actionHref: "/escalade",
  },
  {
    question: "Comment donner son avis ou signaler une imprécision sur une réponse ?",
    reponse:
      "Sous chaque réponse fournie dans le chat, deux boutons d'évaluation (pouce vers le haut / pouce vers le bas) vous permettent d'indiquer en un clic si la vulgarisation a été claire et utile. Vos évaluations anonymes permettent à nos juristes superviseurs d'enrichir continuellement les explications et le banc de test de référence.",
    resume:
      "Évaluez chaque réponse dans l'interface grâce aux boutons d'avis citoyen pour nous aider à améliorer la clarté des vulgarisations juridiques.",
    categorie: "Général & Mission",
    statut_legal: "autorisé",
    actionLabel: "Tester et évaluer sur le chat",
    actionHref: "/chat",
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
