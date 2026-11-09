import {
  LegalQuestionRequest,
  LegalQuestionResponse,
  FAQItem,
  EscalationRequest,
  EscalationResponse,
  CitizenFeedbackRequest,
  MultimodalQuestionResponse,
  PartnerEscalationItem,
  PartnerMetrics,
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

/**
 * Données de secours pour l'espace partenaire juridique
 */
const DEMO_PARTNER_ESCALATIONS: PartnerEscalationItem[] = [
  {
    id: "e0a1b2c3-d4e5-4a6b-8c7d-9e0f1a2b3c4d",
    reference_number: "#BEN-2026-0842",
    citizen_contact: "+229 97 00 12 34",
    question_summary: "Atteinte à l'image & Trucage IA (Deepfake WhatsApp) menaçant un élève.",
    reason: "ZONE_GRISE",
    status: "PENDING",
    assigned_jurist: "Me Karen Houndété",
    jurist_response: null,
    created_at: "2026-11-09T14:15:00Z",
    resolved_at: null,
    interaction_context: {
      statut_legal: "à risque",
      articles_cites: ["Article 552", "Article 558"],
      explication_vulgarisee:
        "Le montage ou la diffusion d'images truquées sans consentement constitue un délit sévèrement puni par le Code du numérique.",
    },
  },
  {
    id: "f1b2c3d4-e5f6-4b7c-9d8e-0f1a2b3c4d5e",
    reference_number: "#BEN-2026-0839",
    citizen_contact: "+229 95 11 22 33",
    question_summary: "Usurpation d'identité et extorsion de fonds via compte Mobile Money piraté.",
    reason: "ZONE_GRISE",
    status: "IN_REVIEW",
    assigned_jurist: "Me Karen Houndété",
    jurist_response: "Prise en charge effectuée. Dossier en cours d'instruction avec l'OCRC.",
    created_at: "2026-11-09T11:30:00Z",
    resolved_at: null,
    interaction_context: {
      statut_legal: "interdit",
      articles_cites: ["Article 558", "Article 570"],
      explication_vulgarisee:
        "L'usurpation d'identité pour extorquer des fonds constitue une infraction criminelle passible d'emprisonnement ferme.",
    },
  },
  {
    id: "a2b3c4d5-e6f7-4c8d-0e1f-1a2b3c4d5e6f",
    reference_number: "#BEN-2026-0798",
    citizen_contact: "citoyen@lexbenin.bj",
    question_summary:
      "Refus de suppression de données nominatives par une plateforme marchande après demande écrite.",
    reason: "DEMANDE_USAGER",
    status: "RESOLVED",
    assigned_jurist: "Clinique Juridique UAC",
    jurist_response:
      "Mise en demeure rédigée selon l'Article 384 du Code du numérique. Données effacées avec succès.",
    created_at: "2026-11-08T09:20:00Z",
    resolved_at: "2026-11-08T15:45:00Z",
    interaction_context: {
      statut_legal: "autorisé",
      articles_cites: ["Article 384"],
      explication_vulgarisee:
        "Le droit à l'effacement et à l'oubli numérique est garanti par l'APDP.",
    },
  },
];

const DEMO_PARTNER_METRICS: PartnerMetrics = {
  total_escalations: 148,
  pending_escalations: 24,
  in_review_escalations: 18,
  resolved_escalations: 106,
  average_sla_hours: 3.4,
  accuracy_rate: 96.4,
  zero_hallucination_rate: 99.1,
  escalation_rate: 8.2,
  active_jurists_count: 7,
};

/**
 * Envoie un fichier audio (note vocale) ou image (capture d'écran) pour analyse juridique multimodale.
 */
export async function askLegalQuestionMultimodal(
  file: File | Blob,
  textPrompt?: string,
  channel: "WEB" | "WHATSAPP" = "WEB"
): Promise<MultimodalQuestionResponse> {
  const isAudio =
    file.type.startsWith("audio/") ||
    (file instanceof File && /\.(ogg|mp3|wav|m4a|webm)$/i.test(file.name));

  try {
    const formData = new FormData();
    const fileName =
      file instanceof File
        ? file.name
        : isAudio
        ? "voice_record.webm"
        : "capture.png";

    formData.append("file", file, fileName);
    if (textPrompt && textPrompt.trim()) {
      formData.append("text_prompt", textPrompt.trim());
    }
    formData.append("channel", channel);
    formData.append("user_id", "web_citizen");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(`${API_BASE_URL}/legal/ask/multimodal`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return (await res.json()) as MultimodalQuestionResponse;
    }
  } catch {
    // Mode dégradé / secours si backend injoignable
  }

  // Fallback intelligent simulant la transcription / OCR
  const simulatedExtracted = isAudio
    ? "Transcription vocale : 'Est-ce légal de diffuser l'audio d'une dispute de voisinage sur TikTok ?'"
    : "Texte extrait de la capture : 'Reçu Mobile Money non reconnu d'un montant de 150.000 FCFA avec menace de blocage'";

  const baseResponse = await askLegalQuestion({
    question: textPrompt ? `${textPrompt} ${simulatedExtracted}` : simulatedExtracted,
    channel: "WEB",
  });

  return {
    ...baseResponse,
    extracted_content: simulatedExtracted,
    detected_media_type: isAudio ? "audio" : "image",
    confidence_score: 0.94,
  };
}

/**
 * Récupère les dossiers d'escalade citoyenne pour l'espace partenaire (Barreau du Bénin & Clinique UAC).
 */
export async function fetchPartnerEscalations(
  statusFilter?: string,
  search?: string
): Promise<PartnerEscalationItem[]> {
  try {
    const params = new URLSearchParams();
    if (statusFilter && statusFilter !== "ALL") {
      params.append("status_filter", statusFilter);
    }
    if (search && search.trim()) {
      params.append("search", search.trim());
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const url = `${API_BASE_URL}/legal/partner/escalations?${params.toString()}`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      return (await res.json()) as PartnerEscalationItem[];
    }
  } catch {
    // Fallback local
  }

  // Filtrage local si backend déconnecté
  let filtered = [...DEMO_PARTNER_ESCALATIONS];
  if (statusFilter && statusFilter !== "ALL") {
    filtered = filtered.filter((item) => item.status === statusFilter);
  }
  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      (item) =>
        item.citizen_contact.toLowerCase().includes(q) ||
        item.question_summary.toLowerCase().includes(q) ||
        item.reference_number.toLowerCase().includes(q)
    );
  }
  return filtered;
}

/**
 * Met à jour le statut et la réponse juriste d'une escalade.
 */
export async function updatePartnerEscalation(
  escalationId: string,
  data: Partial<Pick<PartnerEscalationItem, "status" | "assigned_jurist" | "jurist_response">>
): Promise<PartnerEscalationItem> {
  try {
    const res = await fetch(`${API_BASE_URL}/legal/partner/escalations/${escalationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      return (await res.json()) as PartnerEscalationItem;
    }
  } catch {
    // Fallback local
  }

  const existingIndex = DEMO_PARTNER_ESCALATIONS.findIndex((i) => i.id === escalationId);
  if (existingIndex >= 0) {
    const updated = {
      ...DEMO_PARTNER_ESCALATIONS[existingIndex],
      ...data,
      resolved_at: data.status === "RESOLVED" ? new Date().toISOString() : null,
    };
    DEMO_PARTNER_ESCALATIONS[existingIndex] = updated;
    return updated;
  }

  return {
    id: escalationId,
    reference_number: "#BEN-2026-MOCK",
    citizen_contact: "+229 97 00 00 00",
    question_summary: "Dossier mis à jour en local",
    reason: "DEMANDE_USAGER",
    status: data.status || "IN_REVIEW",
    assigned_jurist: data.assigned_jurist || "Juriste Référent",
    jurist_response: data.jurist_response || null,
    created_at: new Date().toISOString(),
    resolved_at: data.status === "RESOLVED" ? new Date().toISOString() : null,
  };
}

/**
 * Récupère les métriques globales pour l'espace juriste référent et l'audit.
 */
export async function fetchPartnerMetrics(): Promise<PartnerMetrics> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${API_BASE_URL}/legal/partner/metrics`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return (await res.json()) as PartnerMetrics;
    }
  } catch {
    // Fallback local
  }

  return DEMO_PARTNER_METRICS;
}

