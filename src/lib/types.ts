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
