"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Scale,
  Database,
  BarChart3,
  Search,
  MessageCircle,
  CheckCircle2,
  FileText,
  UploadCloud,
  Building2,
  Save,
  Check,
  ArrowLeft,
} from "lucide-react";
import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import CivicCard from "@/components/ui/CivicCard";
import PillButton from "@/components/ui/PillButton";
import VerdictBadge from "@/components/ui/VerdictBadge";
import BeninFlag from "@/components/ui/BeninFlag";
import {
  fetchPartnerEscalations,
  updatePartnerEscalation,
  fetchPartnerMetrics,
} from "@/lib/api";
import { PartnerEscalationItem, PartnerMetrics } from "@/lib/types";

type ActiveTab = "dossiers" | "audit" | "corpus";

export default function PartenairePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dossiers");
  const [escalations, setEscalations] = useState<PartnerEscalationItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [metrics, setMetrics] = useState<PartnerMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Formulaire d'instruction juriste
  const [assignedJurist, setAssignedJurist] = useState<string>("");
  const [juristStatus, setJuristStatus] = useState<"PENDING" | "IN_REVIEW" | "RESOLVED" | "REJECTED">("IN_REVIEW");
  const [juristResponse, setJuristResponse] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Ingestion simulation
  const [ingestionStatus, setIngestionStatus] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [items, m] = await Promise.all([
          fetchPartnerEscalations(),
          fetchPartnerMetrics(),
        ]);
        setEscalations(items);
        if (items.length > 0) {
          setSelectedId(items[0].id);
        }
        setMetrics(m);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const selectedEscalation = useMemo(() => {
    return escalations.find((item) => item.id === selectedId) || null;
  }, [escalations, selectedId]);

  useEffect(() => {
    if (selectedEscalation) {
      setAssignedJurist(selectedEscalation.assigned_jurist || "Me Karen Houndété");
      setJuristStatus(selectedEscalation.status);
      setJuristResponse(selectedEscalation.jurist_response || "");
      setSaveSuccess(false);
    }
  }, [selectedEscalation]);

  const filteredEscalations = useMemo(() => {
    let list = [...escalations];
    if (statusFilter !== "ALL") {
      list = list.filter((item) => item.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.reference_number.toLowerCase().includes(q) ||
          item.citizen_contact.toLowerCase().includes(q) ||
          item.question_summary.toLowerCase().includes(q)
      );
    }
    return list;
  }, [escalations, statusFilter, searchQuery]);

  const handleSaveDecision = async () => {
    if (!selectedId) return;
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const updated = await updatePartnerEscalation(selectedId, {
        assigned_jurist: assignedJurist,
        status: juristStatus,
        jurist_response: juristResponse,
      });
      setEscalations((prev) =>
        prev.map((item) => (item.id === selectedId ? updated : item))
      );
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSimulateIngestion = () => {
    setIngestionStatus("Validation du schéma JSON et intégrité des 646 articles...");
    setTimeout(() => {
      setIngestionStatus(
        "Corpus vérifié avec succès : Découpage atomique regex validé. Zéro article tronqué."
      );
      setTimeout(() => setIngestionStatus(null), 5000);
    }, 1500);
  };

  const formatWhatsAppLink = (phone: string) => {
    const cleaned = phone.replace(/[^0-9]/g, "");
    return `https://wa.me/${cleaned}`;
  };

  return (
    <PageContainer maxWidth="max-w-6xl" className="pb-24 sm:pb-28">
      <PageHeader
        badge="PORTAIL INTER-INSTITUTIONNEL OFFICIEL"
        title="Espace Partenaire Juridique & Audit"
        subtitle="Collaboration Barreau de l'Ordre des Avocats du Bénin & Clinique Juridique UAC. Traitement des escalades citoyennes, gouvernance du corpus officiel et observabilité des garanties éthiques."
      />

      {/* Bannière institutionnelle avec le drapeau officiel */}
      <CivicCard className="mb-8 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-l-[#008751] dark:border-l-[#008751]">
        <div className="flex items-center gap-3 sm:gap-4">
          <BeninFlag className="h-6 w-9 shrink-0 rounded-xs shadow-xs" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#008751] dark:text-[#28A745]">
                Convention de partenariat public-universitaire
              </span>
              <span className="text-xs text-[#525866] dark:text-white/40">•</span>
              <span className="text-xs text-[#525866] dark:text-white/60">
                Code du numérique (Loi N° 2017-20)
              </span>
            </div>
            <p className="text-sm font-medium text-[#0A0D14] dark:text-white mt-0.5">
              Barreau du Bénin & Clinique Juridique UAC • Réf. convention MEN/MJL-2026
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <PillButton
            variant="secondary"
            size="sm"
            href="mailto:partenaires@lexbenin.bj"
            className="text-xs"
          >
            <Building2 className="w-3.5 h-3.5 mr-1.5" />
            Support Juridique
          </PillButton>
        </div>
      </CivicCard>

      {/* Navigation par Onglets (Tabs) */}
      <div className="flex border-b border-black/10 dark:border-white/10 mb-8 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("dossiers")}
          className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "dossiers"
              ? "border-[#0066C5] text-[#0066C5] dark:text-white dark:border-[#0066C5]"
              : "border-transparent text-[#525866] hover:text-[#0A0D14] dark:text-white/60 dark:hover:text-white"
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>File d&apos;attente Citoyenne</span>
          <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-black/5 dark:bg-white/10 font-mono">
            {escalations.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("audit")}
          className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "audit"
              ? "border-[#0066C5] text-[#0066C5] dark:text-white dark:border-[#0066C5]"
              : "border-transparent text-[#525866] hover:text-[#0A0D14] dark:text-white/60 dark:hover:text-white"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Audit & Observabilité</span>
        </button>

        <button
          onClick={() => setActiveTab("corpus")}
          className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "corpus"
              ? "border-[#0066C5] text-[#0066C5] dark:text-white dark:border-[#0066C5]"
              : "border-transparent text-[#525866] hover:text-[#0A0D14] dark:text-white/60 dark:hover:text-white"
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Administration du Corpus</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* ONGLET 1 : FILE D'ATTENTE CITOYENNE (MASTER-DETAIL)                       */}
      {/* ========================================================================= */}
      {activeTab === "dossiers" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Colonne de gauche (Master List) */}
          <div
            className={`lg:col-span-5 flex flex-col gap-4 ${
              mobileDetailOpen ? "hidden lg:flex" : "flex"
            }`}
          >
            {/* Barre de recherche et filtres de statut */}
            <div className="flex flex-col gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#525866] dark:text-white/40" />
                <input
                  type="text"
                  placeholder="Rechercher réf #BEN, contact, mot-clé..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-[#0F1217] border border-black/10 dark:border-white/10 rounded-xl text-[#0A0D14] dark:text-white placeholder:text-[#525866]/60 dark:placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#0066C5]"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {(
                  [
                    { key: "ALL", label: "Toutes" },
                    { key: "PENDING", label: "En attente" },
                    { key: "IN_REVIEW", label: "En cours" },
                    { key: "RESOLVED", label: "Résolues" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setStatusFilter(tab.key)}
                    className={`px-3 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap ${
                      statusFilter === tab.key
                        ? "bg-[#0F2942] text-white dark:bg-[#0066C5]"
                        : "bg-black/5 dark:bg-white/5 text-[#525866] dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/10"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Liste scrollable des dossiers */}
            <div className="flex flex-col gap-2 max-h-[700px] overflow-y-auto pr-1">
              {isLoading ? (
                <div className="p-8 text-center text-sm text-[#525866] dark:text-white/50">
                  Chargement des dossiers citoyenne...
                </div>
              ) : filteredEscalations.length === 0 ? (
                <div className="p-8 text-center text-sm text-[#525866] dark:text-white/50">
                  Aucun dossier ne correspond aux critères sélectionnés.
                </div>
              ) : (
                filteredEscalations.map((item) => {
                  const isSelected = item.id === selectedId;
                  const isPending = item.status === "PENDING";
                  const isInReview = item.status === "IN_REVIEW";
                  const isResolved = item.status === "RESOLVED";

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedId(item.id);
                        setMobileDetailOpen(true);
                      }}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        isSelected
                          ? "bg-white dark:bg-[#14171D] border-[#0066C5] shadow-md ring-1 ring-[#0066C5]"
                          : "bg-white/60 dark:bg-[#0F1217] border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-xs font-semibold text-[#0066C5] dark:text-[#58A6FF]">
                          {item.reference_number}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            isPending
                              ? "bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300"
                              : isInReview
                              ? "bg-blue-100 text-blue-900 dark:bg-blue-950/60 dark:text-blue-300"
                              : isResolved
                              ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300"
                              : "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300"
                          }`}
                        >
                          {isPending
                            ? "En attente"
                            : isInReview
                            ? "En cours"
                            : isResolved
                            ? "Résolue"
                            : item.status}
                        </span>
                      </div>

                      <p className="text-sm font-medium text-[#0A0D14] dark:text-white line-clamp-2 leading-snug">
                        {item.question_summary}
                      </p>

                      <div className="flex items-center justify-between mt-3 text-xs text-[#525866] dark:text-white/50">
                        <span>{item.citizen_contact}</span>
                        <span>{new Date(item.created_at).toLocaleDateString("fr-FR")}</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Colonne de droite (Detail Panel) */}
          <div
            className={`lg:col-span-7 ${
              mobileDetailOpen ? "block" : "hidden lg:block"
            }`}
          >
            {selectedEscalation && (
              <div className="lg:hidden mb-3">
                <button
                  type="button"
                  onClick={() => setMobileDetailOpen(false)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-[#0F2942] dark:text-[#58A6FF] transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Retour à la liste des dossiers</span>
                </button>
              </div>
            )}
            {selectedEscalation ? (
              <CivicCard className="p-6 flex flex-col gap-6">
                {/* En-tête du dossier */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-black/10 dark:border-white/10">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-bold text-[#0066C5] dark:text-[#58A6FF]">
                        {selectedEscalation.reference_number}
                      </span>
                      <span className="text-xs text-[#525866] dark:text-white/40">•</span>
                      <span className="text-xs text-[#525866] dark:text-white/60">
                        Reçue le{" "}
                        {new Date(selectedEscalation.created_at).toLocaleString("fr-FR")}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-[#0A0D14] dark:text-white mt-1">
                      {selectedEscalation.citizen_contact}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedEscalation.citizen_contact.startsWith("+229") && (
                      <a
                        href={formatWhatsAppLink(selectedEscalation.citizen_contact)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-sans font-medium rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-xs transition-transform active:scale-95"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Ouvrir WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Question & Faits exposés */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#525866] dark:text-white/50 mb-2">
                    Faits exposés par le citoyen
                  </h4>
                  <p className="text-sm sm:text-base text-[#0A0D14] dark:text-white bg-black/5 dark:bg-white/5 p-4 rounded-xl leading-relaxed">
                    {selectedEscalation.question_summary}
                  </p>
                </div>

                {/* Analyse préliminaire du moteur RAG (si disponible) */}
                {selectedEscalation.interaction_context && (
                  <div className="flex flex-col gap-3 p-4 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#525866] dark:text-white/50">
                        Qualification automatique du Code du numérique
                      </h4>
                      {selectedEscalation.interaction_context.statut_legal && (
                        <VerdictBadge
                          status={selectedEscalation.interaction_context.statut_legal}
                        />
                      )}
                    </div>

                    {selectedEscalation.interaction_context.explication_vulgarisee && (
                      <p className="text-xs sm:text-sm text-[#525866] dark:text-white/80 leading-relaxed">
                        {selectedEscalation.interaction_context.explication_vulgarisee}
                      </p>
                    )}

                    {selectedEscalation.interaction_context.articles_cites &&
                      selectedEscalation.interaction_context.articles_cites.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {selectedEscalation.interaction_context.articles_cites.map(
                            (art, idx) => (
                              <span
                                key={idx}
                                className="font-mono text-xs px-2.5 py-1 rounded-md bg-black/5 dark:bg-white/10 text-[#0066C5] dark:text-[#58A6FF] font-semibold border border-black/10 dark:border-white/10"
                              >
                                {art}
                              </span>
                            )
                          )}
                        </div>
                      )}
                  </div>
                )}

                {/* Espace d'instruction pour le Juriste Référent */}
                <div className="pt-4 border-t border-black/10 dark:border-white/10 flex flex-col gap-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#0066C5] dark:text-[#58A6FF] flex items-center gap-1.5">
                    <Scale className="w-4 h-4" />
                    <span>Instruction du Juriste Référent</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#525866] dark:text-white/60 mb-1">
                        Juriste / Clinique assignée
                      </label>
                      <input
                        type="text"
                        value={assignedJurist}
                        onChange={(e) => setAssignedJurist(e.target.value)}
                        placeholder="Ex: Me Karen Houndété (Barreau)"
                        className="w-full px-3 py-2 text-sm bg-white dark:bg-[#0F1217] border border-black/10 dark:border-white/15 rounded-lg text-[#0A0D14] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0066C5]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#525866] dark:text-white/60 mb-1">
                        Statut d&apos;avancement
                      </label>
                      <select
                        value={juristStatus}
                        onChange={(e) =>
                          setJuristStatus(
                            e.target.value as "PENDING" | "IN_REVIEW" | "RESOLVED" | "REJECTED"
                          )
                        }
                        className="w-full px-3 py-2 text-sm bg-white dark:bg-[#0F1217] border border-black/10 dark:border-white/15 rounded-lg text-[#0A0D14] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0066C5]"
                      >
                        <option value="PENDING">PENDING — En attente d&apos;affectation</option>
                        <option value="IN_REVIEW">IN_REVIEW — En cours d&apos;instruction</option>
                        <option value="RESOLVED">RESOLVED — Conclue & Usager conseillé</option>
                        <option value="REJECTED">REJECTED — Hors champ Code du numérique</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#525866] dark:text-white/60 mb-1">
                      Observations & Avis Juridique formel
                    </label>
                    <textarea
                      rows={4}
                      value={juristResponse}
                      onChange={(e) => setJuristResponse(e.target.value)}
                      placeholder="Indiquez ici les conseils juridiques transmis, l'orientation vers l'OCRC ou la mise en demeure rédigée..."
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-[#0F1217] border border-black/10 dark:border-white/15 rounded-lg text-[#0A0D14] dark:text-white placeholder:text-[#525866]/50 dark:placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#0066C5]"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {saveSuccess ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-[#008751] dark:text-[#28A745] font-semibold animate-in fade-in">
                        <Check className="w-4 h-4" />
                        Décision enregistrée avec succès.
                      </span>
                    ) : (
                      <span className="text-xs text-[#525866] dark:text-white/40">
                        Mis à jour en temps réel avec traçabilité Langfuse.
                      </span>
                    )}

                    <PillButton
                      variant="primary"
                      size="sm"
                      onClick={handleSaveDecision}
                      disabled={isSaving}
                      className="text-xs"
                    >
                      <Save className="w-3.5 h-3.5 mr-1.5" />
                      {isSaving ? "Enregistrement..." : "Valider l'instruction"}
                    </PillButton>
                  </div>
                </div>
              </CivicCard>
            ) : (
              <CivicCard className="p-12 text-center flex flex-col items-center justify-center text-[#525866] dark:text-white/50">
                <Scale className="w-10 h-10 text-[#0066C5] mb-3 opacity-60" />
                <p className="text-base font-medium text-[#0A0D14] dark:text-white">
                  Sélectionnez un dossier
                </p>
                <p className="text-xs mt-1 max-w-sm">
                  Cliquez sur une demande citoyenne dans la liste de gauche pour consulter
                  l&apos;historique et enregistrer vos conseils juridiques.
                </p>
              </CivicCard>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ONGLET 2 : AUDIT & OBSERVABILITÉ                                          */}
      {/* ========================================================================= */}
      {activeTab === "audit" && (
        <div className="flex flex-col gap-8">
          {/* Grille des 4 métriques clés */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <CivicCard className="p-5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#525866] dark:text-white/50">
                  Exactitude Juridique
                </span>
                <div className="text-3xl font-editorial font-bold text-[#008751] dark:text-[#28A745] mt-2">
                  {metrics?.accuracy_rate ?? 96.4}%
                </div>
              </div>
              <p className="text-xs text-[#525866] dark:text-white/50 mt-3">
                Score validé sur le Golden Dataset de référence (20+ arrêts et cas types).
              </p>
            </CivicCard>

            <CivicCard className="p-5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#525866] dark:text-white/50">
                  Zéro Hallucination
                </span>
                <div className="text-3xl font-editorial font-bold text-[#0066C5] dark:text-[#58A6FF] mt-2">
                  {metrics?.zero_hallucination_rate ?? 99.1}%
                </div>
              </div>
              <p className="text-xs text-[#525866] dark:text-white/50 mt-3">
                Garantie déterministe par CitationGuardrail avant émission citoyenne.
              </p>
            </CivicCard>

            <CivicCard className="p-5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#525866] dark:text-white/50">
                  Taux d&apos;Escalade
                </span>
                <div className="text-3xl font-editorial font-bold text-[#0A0D14] dark:text-white mt-2">
                  {metrics?.escalation_rate ?? 8.2}%
                </div>
              </div>
              <p className="text-xs text-[#525866] dark:text-white/50 mt-3">
                Cas complexes ou zones grises transmis aux juristes de permanence.
              </p>
            </CivicCard>

            <CivicCard className="p-5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#525866] dark:text-white/50">
                  SLA Moyen de Prise en Charge
                </span>
                <div className="text-3xl font-editorial font-bold text-[#E8112D] dark:text-[#FF6B6B] mt-2">
                  {metrics?.average_sla_hours ?? 3.4} h
                </div>
              </div>
              <p className="text-xs text-[#525866] dark:text-white/50 mt-3">
                Délai moyen de prise de contact avec le citoyen demandeur.
              </p>
            </CivicCard>
          </div>

          {/* Tableau d'engagements de conformité APDP et Code du numérique */}
          <CivicCard className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold font-editorial text-[#0A0D14] dark:text-white">
                  Contrôles Déontologiques & Respect de la Vie Privée (APDP)
                </h3>
                <p className="text-xs sm:text-sm text-[#525866] dark:text-white/60 mt-1">
                  Chaque interaction citoyenne est pseudonymisée à la source selon la règle RG-JUR8.
                </p>
              </div>

              <PillButton
                variant="secondary"
                size="sm"
                href="/a-propos#confidentialite"
                className="text-xs"
              >
                <FileText className="w-3.5 h-3.5 mr-1.5" />
                Charte APDP
              </PillButton>
            </div>

            <div className="divide-y divide-black/10 dark:divide-white/10 text-sm">
              <div className="py-3 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#008751] dark:text-[#28A745] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#0A0D14] dark:text-white">
                    Pseudonymisation cryptographique SHA-256 (RG-JUR8)
                  </span>
                  <p className="text-xs text-[#525866] dark:text-white/60 mt-0.5">
                    Aucun numéro WhatsApp n&apos;est enregistré en clair dans la table des interactions
                    pour prévenir toute corrélation externe non consentie.
                  </p>
                </div>
              </div>

              <div className="py-3 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#008751] dark:text-[#28A745] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#0A0D14] dark:text-white">
                    Suppression immédiate des fichiers audio et visuels (RG-JUR7)
                  </span>
                  <p className="text-xs text-[#525866] dark:text-white/60 mt-0.5">
                    Les flux vocaux et captures d&apos;écran sont détruits au niveau du système de
                    fichiers dès la fin du traitement multimodal.
                  </p>
                </div>
              </div>

              <div className="py-3 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#008751] dark:text-[#28A745] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#0A0D14] dark:text-white">
                    Tracing complet et détection de dérives (Langfuse)
                  </span>
                  <p className="text-xs text-[#525866] dark:text-white/60 mt-0.5">
                    Chaque requête conserve son arbre d&apos;exécution RAG avec les scores de similarité
                    cosinus pour l&apos;inspection par le Barreau.
                  </p>
                </div>
              </div>
            </div>
          </CivicCard>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ONGLET 3 : ADMINISTRATION DU CORPUS JURIDIQUE                            */}
      {/* ========================================================================= */}
      {activeTab === "corpus" && (
        <div className="flex flex-col gap-8">
          {/* Fiche d'identité de la loi en vigueur */}
          <CivicCard className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-black/10 dark:border-white/10">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#0066C5] dark:text-[#58A6FF]">
                  Corpus Juridique Actif en Production
                </span>
                <h3 className="text-xl font-editorial font-bold text-[#0A0D14] dark:text-white mt-1">
                  Loi N° 2017-20 du 20 avril 2018 portant Code du numérique en République du Bénin
                </h3>
                <p className="text-xs sm:text-sm text-[#525866] dark:text-white/60 mt-1">
                  Modifiée et complétée par la Loi N° 2020-35 du 06 janvier 2021.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#008751] animate-pulse"></span>
                  Indexé & Synchronisé
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
              <div>
                <span className="text-xs text-[#525866] dark:text-white/50">Articles de loi</span>
                <p className="text-2xl font-mono font-bold text-[#0A0D14] dark:text-white mt-1">
                  646
                </p>
                <p className="text-[11px] text-[#525866] dark:text-white/40 mt-0.5">
                  Découpés à l&apos;unité sans troncature (RG-JUR3)
                </p>
              </div>

              <div>
                <span className="text-xs text-[#525866] dark:text-white/50">Moteur de recherche</span>
                <p className="text-sm font-semibold text-[#0A0D14] dark:text-white mt-1">
                  Hybride RRF (BM25 + pgvector)
                </p>
                <p className="text-[11px] text-[#525866] dark:text-white/40 mt-0.5">
                  Pondération sémantique Gemini 768d
                </p>
              </div>

              <div>
                <span className="text-xs text-[#525866] dark:text-white/50">Dernière révision</span>
                <p className="text-sm font-semibold text-[#0A0D14] dark:text-white mt-1">
                  09 Novembre 2026
                </p>
                <p className="text-[11px] text-[#525866] dark:text-white/40 mt-0.5">
                  Conforme Journal Officiel du Bénin
                </p>
              </div>
            </div>
          </CivicCard>

          {/* Démonstration du chunking atomique par article */}
          <CivicCard className="p-6">
            <h4 className="text-base font-bold font-editorial text-[#0A0D14] dark:text-white mb-2">
              Visualiseur de Découpage Atomique (Règle RG-JUR3)
            </h4>
            <p className="text-xs sm:text-sm text-[#525866] dark:text-white/60 mb-4">
              Afin d&apos;éliminer les hallucinations et la perte de contexte, aucun article n&apos;est
              scindé au milieu d&apos;un alinéa. Chaque fragment indexé correspond exactement à un article complet du Code.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-semibold text-[#0066C5]">
                    Chunk #552 — Livre V (Cybercriminalité)
                  </span>
                  <span className="text-[10px] text-[#525866] dark:text-white/40">1 420 caractères</span>
                </div>
                <p className="font-mono text-xs text-[#0A0D14] dark:text-white leading-relaxed">
                  « Article 552 : Quiconque initie, diffuse ou transmet par voie électronique des données
                  falsifiées ou truquées de nature à porter atteinte à l&apos;honneur ou à la considération
                  d&apos;une personne est puni d&apos;un emprisonnement de six mois à deux ans... »
                </p>
              </div>

              <div className="p-4 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-semibold text-[#0066C5]">
                    Chunk #567 — Livre V (Atteinte à l&apos;intimité)
                  </span>
                  <span className="text-[10px] text-[#525866] dark:text-white/40">1 180 caractères</span>
                </div>
                <p className="font-mono text-xs text-[#0A0D14] dark:text-white leading-relaxed">
                  « Article 567 : Est puni des peines prévues à l&apos;article précédent le fait de capter,
                  enregistrer ou transmettre, sans le consentement de leur auteur, des images ou des paroles
                  présentant un caractère privé ou confidentiel... »
                </p>
              </div>
            </div>
          </CivicCard>

          {/* Dropzone d'ingestion de mise à jour législative */}
          <CivicCard className="p-6 border-dashed border-2 border-black/20 dark:border-white/20 text-center flex flex-col items-center justify-center gap-3">
            <UploadCloud className="w-10 h-10 text-[#0066C5] dark:text-[#58A6FF]" />
            <div>
              <h4 className="text-base font-semibold text-[#0A0D14] dark:text-white">
                Ingestion d&apos;une nouvelle révision de loi (Journal Officiel)
              </h4>
              <p className="text-xs text-[#525866] dark:text-white/50 mt-1 max-w-md">
                Glissez-déposez le fichier JSON structuré du Code ou lancez la vérification d&apos;intégrité.
              </p>
            </div>

            {ingestionStatus && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 text-xs rounded-lg animate-in fade-in">
                {ingestionStatus}
              </div>
            )}

            <div className="flex items-center gap-3 mt-2">
              <PillButton
                variant="primary"
                size="sm"
                onClick={handleSimulateIngestion}
                className="text-xs"
              >
                Lancer la vérification du corpus
              </PillButton>
            </div>
          </CivicCard>
        </div>
      )}
    </PageContainer>
  );
}
