/**
 * Types TypeScript du domaine juridique LexBénin, alignés sur les schémas Pydantic du backend lexback.
 */

export type LegalStatus = "autorisé" | "interdit" | "à risque" | "zone grise";

export interface LegalQuestionRequest {
  question: string;
  user_id?: string;
  channel?: "WEB" | "WHATSAPP";
}

export interface LegalQuestionResponse {
  interaction_id: string;
  statut_legal: LegalStatus;
  articles_cites: string[];
  explication_vulgarisee: string;
  conseil_pratique: string;
  avertissement_legal: string;
  necessite_escalade: boolean;
}

export interface SearchSuggestion {
  id: string;
  title: string;
  question: string;
  badge: string;
}

export interface FeaturePillar {
  id: string;
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
}

export interface FAQItem {
  question: string;
  reponse: string;
  categorie: string;
  statut_legal?: LegalStatus;
  article?: string;
  resume?: string;
  actionLabel?: string;
  actionHref?: string;
}

export interface EscalationRequest {
  interaction_id?: string;
  citizen_contact: string;
  question_summary: string;
  reason?: string;
}

export interface EscalationResponse {
  status: string;
  escalation_id: string;
  reference_number?: string;
  message: string;
}

export interface CitizenFeedbackRequest {
  interaction_id: string;
  rating: number; // 1 pour utile, -1 pour insatisfaisant
  comment?: string;
}

export type SSEStreamEvent =
  | { type: "status"; stage: string; message: string }
  | { type: "sources"; articles: string[]; sources: unknown[] }
  | { type: "token"; token: string }
  | { type: "complete"; response: LegalQuestionResponse }
  | { type: "error"; message: string };
