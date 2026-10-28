import React from "react";
import Link from "next/link";
import { ShieldAlert, FileText, Landmark } from "lucide-react";

export default function RoadmapSection() {
  return (
    <section id="roadmap" className="w-full max-w-5xl mx-auto px-6 pt-24 pb-20 text-center flex flex-col items-center">
      <h2 className="font-editorial text-5xl sm:text-6xl md:text-7xl font-normal text-[#0A0D14] tracking-tight mb-4">
        Bientôt disponible
      </h2>
      <p className="text-base sm:text-lg text-[#525866] max-w-2xl mx-auto mb-8 font-normal leading-relaxed text-balance">
        Au-delà des réponses, orientation automatique des dossiers vers les cliniques juridiques, saisine directe de l&apos;OCRC et génération d&apos;attestations certifiées.
      </p>

      <Link
        href="#roadmap"
        className="inline-flex items-center px-6 py-2.5 rounded-full bg-white border border-[#E5E7EB] hover:border-black/30 shadow-sm text-xs sm:text-sm font-medium text-[#0A0D14] transition-all mb-16"
      >
        Découvrir la feuille de route
      </Link>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl text-left">
        {/* Mock card 1: Signalement OCRC */}
        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono text-[#E8112D] font-medium uppercase">Cybercriminalité</span>
              <ShieldAlert className="w-4 h-4 text-[#525866]" />
            </div>
            <h3 className="font-editorial text-lg text-[#0A0D14] mb-1">Signalement d&apos;escroquerie en ligne</h3>
            <p className="text-xs text-[#525866] leading-relaxed">
              Préparation du dossier d&apos;infraction numérique avant transmission directe aux services d&apos;enquête.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
            <span className="text-[10px] text-[#525866]">Prévu T1 2026</span>
            <span className="text-xs font-semibold text-[#0F2942]">OCRC Connect</span>
          </div>
        </div>

        {/* Mock card 2: Plainte & Recours APDP */}
        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono text-[#008751] font-medium uppercase">Données personnelles</span>
              <FileText className="w-4 h-4 text-[#525866]" />
            </div>
            <h3 className="font-editorial text-lg text-[#0A0D14] mb-1">Modèle de plainte APDP</h3>
            <p className="text-xs text-[#525866] leading-relaxed">
              Génération d&apos;une lettre de mise en demeure conforme pour suppression immédiate de vos données.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
            <span className="text-[10px] text-[#525866]">Prévu T2 2026</span>
            <span className="text-xs font-semibold text-[#008751]">Formulaire guidé</span>
          </div>
        </div>

        {/* Mock card 3: Clinique du Droit & Barreau */}
        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-xs flex flex-col justify-between sm:col-span-2 lg:col-span-1">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono text-[#0F2942] font-medium uppercase">Orientation Barreau</span>
              <Landmark className="w-4 h-4 text-[#525866]" />
            </div>
            <h3 className="font-editorial text-lg text-[#0A0D14] mb-1">Permanence d&apos;avocats bénévoles</h3>
            <p className="text-xs text-[#525866] leading-relaxed">
              Mise en relation avec des cliniques juridiques pour les cas nécessitant une représentation au tribunal.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
            <span className="text-[10px] text-[#525866]">Prévu T3 2026</span>
            <span className="text-xs font-semibold text-[#0A0D14]">Pro Bono</span>
          </div>
        </div>
      </div>
    </section>
  );
}
