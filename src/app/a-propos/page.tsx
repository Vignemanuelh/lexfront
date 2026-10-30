import React from "react";
import {
  ShieldCheck,
  Scale,
  Lock,
  BookOpen,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Users,
} from "lucide-react";
import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import CivicCard from "@/components/ui/CivicCard";
import PillButton from "@/components/ui/PillButton";
import BeninFlag from "@/components/ui/BeninFlag";

export const metadata = {
  title: "À propos & Déontologie — LexBénin",
  description:
    "Mission citoyenne, cadre déontologique républicain et garanties anti-hallucination de LexBénin sur le Code du numérique du Bénin.",
};

export default function AProposPage() {
  return (
    <PageContainer maxWidth="max-w-4xl" className="pb-24 sm:pb-28">
      <PageHeader
        title="Comprendre la loi numérique avant d'agir, simplement et gratuitement."
        subtitle="Mission d'intérêt public civique pour éclairer chaque publication, story ou partage en amont, avec une information juridique rigoureuse, accessible et sans jargon."
        badge="Cadre républicain & Déontologie"
      />

      {/* 1. Métriques Clés d'Impact */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
        <CivicCard className="p-6 text-center flex flex-col items-center justify-center">
          <span className="font-editorial text-4xl sm:text-5xl text-[#0F2942] dark:text-[#0066C5] font-normal mb-1">
            0 F CFA
          </span>
          <span className="font-sans font-semibold text-sm text-[#0A0D14] dark:text-white mb-1">
            Gratuité intégrale
          </span>
          <p className="text-xs text-[#525866] dark:text-white/60 leading-relaxed">
            Accès universel garanti à tout citoyen béninois sans aucun frais.
          </p>
        </CivicCard>

        <CivicCard className="p-6 text-center flex flex-col items-center justify-center">
          <span className="font-editorial text-4xl sm:text-5xl text-[#008751] dark:text-emerald-400 font-normal mb-1">
            100%
          </span>
          <span className="font-sans font-semibold text-sm text-[#0A0D14] dark:text-white mb-1">
            Corpus légal vérifié
          </span>
          <p className="text-xs text-[#525866] dark:text-white/60 leading-relaxed">
            Réponses adossées au mot près sur la Loi N° 2017-20 modifiée par la Loi N° 2020-35.
          </p>
        </CivicCard>

        <CivicCard className="p-6 text-center flex flex-col items-center justify-center">
          <span className="font-editorial text-4xl sm:text-5xl text-[#E8112D] dark:text-amber-400 font-normal mb-1">
            0 Donnée
          </span>
          <span className="font-sans font-semibold text-sm text-[#0A0D14] dark:text-white mb-1">
            Stockage souverain
          </span>
          <p className="text-xs text-[#525866] dark:text-white/60 leading-relaxed">
            Conformité intégrale APDP Bénin, sans traçage ni revente des identités citoyennes.
          </p>
        </CivicCard>
      </div>

      {/* 2. Pourquoi LexBénin ? */}
      <CivicCard className="w-full p-8 sm:p-10 mb-16 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#0F2942]/10 dark:bg-white/10 flex items-center justify-center text-[#0F2942] dark:text-white">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-editorial text-2xl sm:text-3xl text-[#0A0D14] dark:text-white font-normal">
              L&apos;urgence de la vulgarisation
            </h2>
            <p className="text-xs font-mono text-[#525866] dark:text-white/60">
              Loi N° 2017-20 • Code du numérique du Bénin
            </p>
          </div>
        </div>

        <p className="text-sm sm:text-base text-[#525866] dark:text-white/80 leading-relaxed">
          Avec l&apos;expansion des réseaux sociaux, des milliers de citoyens, d&apos;étudiants, de créateurs
          de contenu et d&apos;entrepreneurs béninois s&apos;exposent quotidiennement à des infractions pénales
          involontaires — diffamation en ligne, diffusion non consentie de photos privées, propos injurieux ou
          escroqueries Mobile Money — par simple méconnaissance des textes officiels.
        </p>

        <p className="text-sm sm:text-base text-[#525866] dark:text-white/80 leading-relaxed">
          LexBénin a été pensé comme un bouclier civique préventif : traduire la rigueur du Journal Officiel
          en conseils clairs, précis et opérationnels avant qu&apos;une infraction ne soit commise.
        </p>
      </CivicCard>

      {/* 3. Les 3 Piliers Architecturaux (Garanties anti-hallucination) */}
      <div className="w-full mb-16">
        <div className="text-center mb-8">
          <span className="text-xs font-mono text-[#525866] dark:text-white/60 uppercase tracking-wider">
            Architecture de précision
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#0A0D14] dark:text-white font-normal mt-1">
            Un moteur RAG souverain conçu pour éliminer l&apos;hallucination juridique.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CivicCard elevated className="p-6 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-full bg-[#0F2942] text-white flex items-center justify-center mb-4 text-xs font-mono font-bold">
                01
              </div>
              <h3 className="font-sans font-semibold text-base text-[#0A0D14] dark:text-white mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#0F2942] dark:text-[#0066C5]" />
                Source unique de vérité
              </h3>
              <p className="text-xs sm:text-sm text-[#525866] dark:text-white/70 leading-relaxed">
                Le système n&apos;invente rien et n&apos;utilise pas de connaissances générales approximatives.
                Il est exclusivement indexé sur les 646 articles officiels du Code du numérique béninois.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-black/5 dark:border-white/10 text-[11px] font-mono text-[#525866] dark:text-white/50">
              Recueil officiel certifié
            </div>
          </CivicCard>

          <CivicCard elevated className="p-6 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-full bg-[#0F2942] text-white flex items-center justify-center mb-4 text-xs font-mono font-bold">
                02
              </div>
              <h3 className="font-sans font-semibold text-base text-[#0A0D14] dark:text-white mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#008751] dark:text-emerald-400" />
                Zéro invention d&apos;article
              </h3>
              <p className="text-xs sm:text-sm text-[#525866] dark:text-white/70 leading-relaxed">
                Chaque réponse subit une validation déterministe stricte : tout article cité doit
                obligatoirement figurer parmi les extraits officiels récupérés, sans quoi la réponse est rejetée.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-black/5 dark:border-white/10 text-[11px] font-mono text-[#525866] dark:text-white/50">
              CitationGuardrail actif
            </div>
          </CivicCard>

          <CivicCard elevated className="p-6 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-full bg-[#0F2942] text-white flex items-center justify-center mb-4 text-xs font-mono font-bold">
                03
              </div>
              <h3 className="font-sans font-semibold text-base text-[#0A0D14] dark:text-white mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#E8112D] dark:text-amber-400" />
                Orientation humaine garantie
              </h3>
              <p className="text-xs sm:text-sm text-[#525866] dark:text-white/70 leading-relaxed">
                Face à une situation ambiguë, un litige engagé ou une zone grise du droit, LexBénin refuse de spéculer
                et oriente le citoyen vers le Barreau du Bénin ou les cliniques juridiques universitaires.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-black/5 dark:border-white/10 text-[11px] font-mono text-[#525866] dark:text-white/50">
              Escalade vers avocat agréé
            </div>
          </CivicCard>
        </div>
      </div>

      {/* 4. Charte Déontologique : Ce que LexBénin fait vs Ce qu'il ne fait pas */}
      <div className="w-full mb-16">
        <div className="text-center mb-8">
          <span className="text-xs font-mono text-[#525866] dark:text-white/60 uppercase tracking-wider">
            Responsabilité & Limites
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#0A0D14] dark:text-white font-normal mt-1">
            Charte déontologique citoyenne
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ce que LexBénin garantit */}
          <CivicCard className="p-6 sm:p-8 border-l-4 border-l-emerald-600 dark:border-l-emerald-500">
            <div className="flex items-center gap-2 mb-4 text-emerald-800 dark:text-emerald-400 font-semibold text-base">
              <CheckCircle2 className="w-5 h-5" />
              <span>Ce que LexBénin garantit</span>
            </div>
            <ul className="flex flex-col gap-3 text-xs sm:text-sm text-[#525866] dark:text-white/80">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-1.5 shrink-0" />
                <span><strong>Vulgarisation en langage clair :</strong> explication intelligible des concepts juridiques ardus pour tout citoyen.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-1.5 shrink-0" />
                <span><strong>Analyse préventive :</strong> qualification du statut légal (autorisé, interdit, à risque, zone grise) avant publication.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-1.5 shrink-0" />
                <span><strong>Citation stricte :</strong> référence vérifiée de l&apos;article du Code du numérique applicable.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-1.5 shrink-0" />
                <span><strong>Éphémérité des données :</strong> suppression immédiate des notes vocales et captures après analyse.</span>
              </li>
            </ul>
          </CivicCard>

          {/* Ce que LexBénin ne fait pas */}
          <CivicCard className="p-6 sm:p-8 border-l-4 border-l-red-600 dark:border-l-red-500">
            <div className="flex items-center gap-2 mb-4 text-red-800 dark:text-red-400 font-semibold text-base">
              <XCircle className="w-5 h-5" />
              <span>Ce que LexBénin ne fait pas</span>
            </div>
            <ul className="flex flex-col gap-3 text-xs sm:text-sm text-[#525866] dark:text-white/80">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-400 mt-1.5 shrink-0" />
                <span><strong>Pas de conseil d&apos;avocat :</strong> l&apos;outil informe mais ne remplace pas une consultation formelle au Barreau.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-400 mt-1.5 shrink-0" />
                <span><strong>Aucune représentation judiciaire :</strong> l&apos;outil ne rédige pas de conclusions ni d&apos;actes de procédure.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-400 mt-1.5 shrink-0" />
                <span><strong>Zéro spéculation sur les litiges :</strong> en cas de doute, obligation d&apos;escalade vers un praticien du droit.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-400 mt-1.5 shrink-0" />
                <span><strong>Pas de traçage commercial :</strong> zéro revente d&apos;historique de requêtes à des tiers.</span>
              </li>
            </ul>
          </CivicCard>
        </div>
      </div>

      {/* 5. Section Confidentialité & APDP Bénin (id="confidentialite" pour ancre directe) */}
      <div id="confidentialite" className="w-full mb-16 scroll-mt-24">
        <CivicCard className="p-8 sm:p-10 flex flex-col md:flex-row items-center gap-8 bg-[#0A111E] dark:bg-[#0B0D12] text-white border-white/10">
          <div className="w-16 h-16 rounded-full bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
            <div className="flex items-center gap-2">
              <BeninFlag className="h-3.5 w-5" />
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wide">
                Conformité APDP Bénin
              </span>
            </div>
            <h3 className="font-editorial text-2xl sm:text-3xl font-normal">
              Protection absolue de votre vie privée numérique
            </h3>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-xl">
              Chaque identifiant d&apos;usager est haché cryptographiquement par SHA-256 (`user_hash`).
              Les médias audio et captures d&apos;écran envoyés pour analyse sont détruits immédiatement
              après extraction juridique, conformément aux exigences de l&apos;Autorité de Protection des Données Personnelles du Bénin.
            </p>
          </div>
        </CivicCard>
      </div>

      {/* 6. Appel à l'action civique */}
      <div className="w-full flex flex-col items-center text-center gap-6 py-6 border-t border-black/10 dark:border-white/10">
        <p className="font-editorial text-2xl sm:text-3xl text-[#0A0D14] dark:text-white max-w-lg">
          Une question sur une publication, un contrat ou un partage en ligne ?
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <PillButton href="/chat" variant="primary">
            <span>Consulter l&apos;assistant</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </PillButton>
          <PillButton href="/faq" variant="secondary">
            Consulter la FAQ
          </PillButton>
        </div>
      </div>
    </PageContainer>
  );
}
