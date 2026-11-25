"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Phone,
  MessageSquare,
  Mail,
  Loader2,
  Lock,
} from "lucide-react";
import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import CivicCard from "@/components/ui/CivicCard";
import PillButton from "@/components/ui/PillButton";
import BeninFlag from "@/components/ui/BeninFlag";
import { createEscalation } from "@/lib/api";
import { EscalationResponse } from "@/lib/types";

function EscaladeFormContent() {
  const searchParams = useSearchParams();

  const [interactionId, setInteractionId] = useState<string>("");
  const [reason, setReason] = useState<string>("ZONE_GRISE");
  const [questionSummary, setQuestionSummary] = useState<string>("");
  const [citizenContact, setCitizenContact] = useState<string>("");
  const [channelPreference, setChannelPreference] = useState<"WHATSAPP" | "CALL" | "EMAIL">("WHATSAPP");
  const [consentApdp, setConsentApdp] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<EscalationResponse | null>(null);

  useEffect(() => {
    const pInteractionId = searchParams.get("interaction_id");
    const pQ = searchParams.get("q");

    if (pInteractionId) setInteractionId(pInteractionId);
    if (pQ) setQuestionSummary(pQ);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!citizenContact.trim()) {
      setErrorMessage("Veuillez renseigner un moyen de contact (numéro WhatsApp, téléphone ou email).");
      return;
    }

    if (!questionSummary.trim()) {
      setErrorMessage("Veuillez résumer brièvement la situation juridique rencontrée.");
      return;
    }

    if (!consentApdp) {
      setErrorMessage("Votre accord préalable sur la politique de confidentialité APDP est obligatoire.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createEscalation({
        interaction_id: interactionId || undefined,
        citizen_contact: citizenContact.trim(),
        question_summary: `[Canal préféré : ${channelPreference}] ${questionSummary.trim()}`,
        reason,
      });
      setSuccessResult(result);
    } catch {
      setErrorMessage("Une erreur est survenue lors de l'enregistrement de votre demande. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successResult) {
    return (
      <CivicCard className="w-full max-w-2xl p-8 sm:p-10 text-center flex flex-col items-center gap-6 animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 mb-2">
            Dossier N° {successResult.reference_number || "#BEN-2026-SAISINE"}
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#0A0D14] dark:text-white font-normal mt-2">
            Votre demande d&apos;assistance a bien été transmise.
          </h2>
          <p className="text-sm sm:text-base text-[#525866] dark:text-white/70 max-w-md mx-auto mt-3 leading-relaxed">
            Un juriste référent conventionné du Barreau du Bénin ou de la Clinique Juridique UAC examinera votre dossier en toute confidentialité.
          </p>
        </div>

        {/* Détails de suivi républicain */}
        <div className="w-full bg-[#F7F7F5] dark:bg-[#14171D] rounded-2xl p-4 text-xs font-mono text-[#525866] dark:text-white/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-2">
            <BeninFlag className="h-3.5 w-5" />
            <span>Permanence civique UAC & Barreau</span>
          </div>
          <span>Délai estimé : &lt; 24h ouvrées</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
          <PillButton href="/" variant="primary">
            Retour à l&apos;accueil
          </PillButton>
          <PillButton href="/chat" variant="secondary">
            Poser une autre question
          </PillButton>
        </div>
      </CivicCard>
    );
  }

  return (
    <CivicCard className="w-full max-w-2xl p-6 sm:p-10">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Rappel d'interaction liée si issue du chat */}
        {interactionId && (
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F7F7F5] dark:bg-[#14171D] border border-black/5 dark:border-white/10 text-xs font-mono text-[#525866] dark:text-white/60">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#0F2942] dark:text-amber-400" />
              <span>Session de consultation #{interactionId.slice(0, 8)}</span>
            </div>
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Pré-qualifié</span>
          </div>
        )}

        {/* Motif de la situation */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="escalation-reason"
            className="text-xs font-sans font-semibold text-[#0A0D14] dark:text-white uppercase tracking-wider"
          >
            Nature de la situation ou litige
          </label>
          <select
            id="escalation-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl bg-white dark:bg-[#0F1217] border border-[#E5E7EB] dark:border-white/15 text-sm text-[#0A0D14] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F2942]/20 dark:focus:ring-white/20"
          >
            <option value="ZONE_GRISE">Cas complexe / Zone grise non tranchée</option>
            <option value="HARCELEMENT">Atteinte à l&apos;image &amp; Chantage numérique (Deepfake)</option>
            <option value="DIFFAMATION">Diffamation &amp; Rumeur préjudiciable en ligne</option>
            <option value="USURPATION">Usurpation d&apos;identité &amp; Faux profil sur réseaux</option>
            <option value="ARNAQUE_FINANCIERE">Arnaque Mobile Money / Faux transfert bancaire</option>
            <option value="AUTRE">Autre différend ou convocation reçue</option>
          </select>
        </div>

        {/* Description de la situation */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="escalation-summary"
            className="text-xs font-sans font-semibold text-[#0A0D14] dark:text-white uppercase tracking-wider"
          >
            Précisions sur les faits
          </label>
          <textarea
            id="escalation-summary"
            rows={4}
            value={questionSummary}
            onChange={(e) => setQuestionSummary(e.target.value)}
            placeholder="Précisez les faits : contexte des messages ou publications, diffusion de photos sans accord, menaces formulées..."
            className="w-full p-3.5 rounded-xl bg-white dark:bg-[#0F1217] border border-[#E5E7EB] dark:border-white/15 text-sm text-[#0A0D14] dark:text-white placeholder-[#88909E] dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0F2942]/20 dark:focus:ring-white/20 resize-none"
          />
        </div>

        {/* Coordonnées de contact */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="escalation-contact"
            className="text-xs font-sans font-semibold text-[#0A0D14] dark:text-white uppercase tracking-wider"
          >
            Vos coordonnées pour la réponse
          </label>
          <input
            id="escalation-contact"
            type="text"
            value={citizenContact}
            onChange={(e) => setCitizenContact(e.target.value)}
            placeholder="Numéro WhatsApp (ex: +229 97 00 00 00) ou adresse e-mail"
            className="w-full h-11 px-3.5 rounded-xl bg-white dark:bg-[#0F1217] border border-[#E5E7EB] dark:border-white/15 text-sm text-[#0A0D14] dark:text-white placeholder-[#88909E] dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0F2942]/20 dark:focus:ring-white/20"
          />
        </div>

        {/* Canal de rappel souhaité */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-sans font-semibold text-[#0A0D14] dark:text-white uppercase tracking-wider">
            Canal de contact privilégié
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setChannelPreference("WHATSAPP")}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs font-medium transition-all ${
                channelPreference === "WHATSAPP"
                  ? "bg-[#0F2942] text-white border-transparent dark:bg-[#0066C5]"
                  : "bg-white dark:bg-[#0F1217] border-[#E5E7EB] dark:border-white/10 text-[#525866] dark:text-white/70"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => setChannelPreference("CALL")}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs font-medium transition-all ${
                channelPreference === "CALL"
                  ? "bg-[#0F2942] text-white border-transparent dark:bg-[#0066C5]"
                  : "bg-white dark:bg-[#0F1217] border-[#E5E7EB] dark:border-white/10 text-[#525866] dark:text-white/70"
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>Appel</span>
            </button>

            <button
              type="button"
              onClick={() => setChannelPreference("EMAIL")}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs font-medium transition-all ${
                channelPreference === "EMAIL"
                  ? "bg-[#0F2942] text-white border-transparent dark:bg-[#0066C5]"
                  : "bg-white dark:bg-[#0F1217] border-[#E5E7EB] dark:border-white/10 text-[#525866] dark:text-white/70"
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>E-mail</span>
            </button>
          </div>
        </div>

        {/* Consentement APDP obligatoire */}
        <label className="flex items-start gap-3 p-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/10 cursor-pointer">
          <input
            type="checkbox"
            checked={consentApdp}
            onChange={(e) => setConsentApdp(e.target.checked)}
            className="mt-1 w-4 h-4 rounded text-[#0F2942] focus:ring-[#0F2942] dark:focus:ring-[#0066C5]"
          />
          <span className="text-xs text-[#525866] dark:text-white/70 leading-relaxed">
            J&apos;autorise la transmission confidentielle de ces éléments à la permanence juridique
            (Clinique Juridique UAC &amp; Barreau du Bénin) dans le cadre strict de l&apos;assistance citoyenne.
            Zéro revente ni exploitation commerciale (Loi N° 2017-20).
          </span>
        </label>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 text-red-800 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Bouton de soumission */}
        <PillButton
          variant="primary"
          type="submit"
          disabled={isSubmitting}
          className="w-full justify-center h-12 text-sm mt-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              <span>Transmission de votre saisine...</span>
            </>
          ) : (
            <>
              <span>Transmettre ma demande d&apos;assistance</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </PillButton>

        <p className="text-[11px] text-center text-[#525866] dark:text-white/50 flex items-center justify-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Transmission chiffrée de bout en bout • Convention N° 2024-08/MJL</span>
        </p>
      </form>
    </CivicCard>
  );
}

export default function EscaladePage() {
  return (
    <PageContainer maxWidth="max-w-4xl" className="pb-24 sm:pb-28">
      <PageHeader
        title="Orientation vers un juriste référent"
        subtitle="Lorsque votre situation relève d'une zone grise, d'une urgence pénale ou d'un litige en cours, nous vous orientons gratuitement vers le Barreau du Bénin et nos cliniques du droit partenaires."
        badge="Accès au droit & Assistance"
      />

      <Suspense
        fallback={
          <div className="w-full flex items-center justify-center min-h-[300px]">
            <Loader2 className="w-8 h-8 animate-spin text-[#0F2942] dark:text-[#0066C5]" />
          </div>
        }
      >
        <EscaladeFormContent />
      </Suspense>
    </PageContainer>
  );
}
