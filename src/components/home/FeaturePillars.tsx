import React from "react";
import Link from "next/link";
import { Lock, Scale, Globe, MessageSquare, ArrowRight, Shield } from "lucide-react";

export default function FeaturePillars() {
  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-12 flex flex-col gap-24 sm:gap-32">
      {/* Bloc 1: 814 articles condensés en un seul endroit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="relative w-full aspect-square max-w-[380px] mx-auto rounded-3xl overflow-hidden bg-white dark:bg-[#11151F] border border-[#E5E7EB] dark:border-white/10 p-6 shadow-sm flex flex-col justify-between group">
          <div className="grid grid-cols-2 gap-3 h-full">
            <div className="rounded-2xl bg-[#F7F7F5] dark:bg-[#1A202C] p-3 border border-[#E5E7EB] dark:border-white/10 flex flex-col justify-between transform transition-transform group-hover:-translate-y-1">
              <span className="text-[10px] font-mono text-[#525866] dark:text-white/60 uppercase">Livre V • Art. 560</span>
              <p className="text-xs font-serif leading-snug line-clamp-3 dark:text-white/90">Cybersécurité & Infractions numériques au Bénin...</p>
              <span className="text-[10px] text-[#008751] font-semibold">En vigueur</span>
            </div>
            <div className="rounded-2xl bg-[#0F2942] text-white p-3 flex flex-col justify-between transform transition-transform group-hover:translate-y-1">
              <span className="text-[10px] font-mono text-white/70 uppercase">Livre VI • Art. 384</span>
              <p className="text-xs font-serif leading-snug line-clamp-3 text-white/90">Protection des données personnelles (APDP)...</p>
              <span className="text-[10px] text-white/60 font-mono">Modifié 2020</span>
            </div>
            <div className="rounded-2xl bg-[#F7F7F5] dark:bg-[#1A202C] p-3 border border-[#E5E7EB] dark:border-white/10 flex flex-col justify-between transform transition-transform group-hover:translate-y-1">
              <span className="text-[10px] font-mono text-[#525866] dark:text-white/60 uppercase">Livre III • Art. 122</span>
              <p className="text-xs font-serif leading-snug line-clamp-3 dark:text-white/90">Commerce électronique & contrats dématérialisés...</p>
              <span className="text-[10px] text-[#0F2942] dark:text-amber-400 font-semibold">Validité légale</span>
            </div>
            <div className="rounded-2xl bg-white dark:bg-[#11151F] border border-dashed border-black/20 dark:border-white/20 p-3 flex flex-col items-center justify-center text-center">
              <span className="font-editorial text-3xl font-medium text-[#0F2942] dark:text-white">814</span>
              <span className="text-[11px] text-[#525866] dark:text-white/60 leading-tight mt-1">Articles complets indexés</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start text-left max-w-md">
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#0A0D14] dark:text-white tracking-tight font-normal mb-3">
            814 articles condensés en un seul endroit.
          </h2>
          <p className="text-[#525866] dark:text-white/70 text-sm sm:text-base leading-relaxed mb-6 font-normal">
            Plus besoin de chercher dans des centaines de pages du Journal Officiel. LexBénin centralise et indexe tout le droit du numérique pour chaque citoyen.
          </p>
          <Link
            href="/a-propos"
            className="text-xs sm:text-sm font-semibold text-[#0A0D14] dark:text-white hover:text-[#0F2942] underline underline-offset-4 flex items-center gap-1 transition-colors"
          >
            <span>Comment ça marche</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Bloc 2: Confidentialité totale (cadenas minimaliste fond nuit) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="relative w-full aspect-square max-w-[380px] mx-auto rounded-3xl overflow-hidden bg-[#0A111E] dark:bg-[#0B0D12] border border-white/10 p-8 shadow-md flex items-center justify-center order-first md:order-last">
          <div className="w-24 h-24 rounded-full bg-white/5 border border-white/15 backdrop-blur-md flex items-center justify-center shadow-inner relative z-10">
            <Lock className="w-10 h-10 text-white" />
          </div>
        </div>

        <div className="flex flex-col items-start text-left max-w-md">
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#0A0D14] dark:text-white tracking-tight font-normal mb-3">
            LexBénin protège votre vie privée.
          </h2>
          <p className="text-[#525866] dark:text-white/70 text-sm sm:text-base leading-relaxed mb-6 font-normal">
            Vos questions et fichiers ne sont ni enregistrés ni revendus. Vos échanges s&apos;effacent dès votre départ, en stricte conformité avec les directives de l&apos;APDP.
          </p>
          <Link
            href="/a-propos#confidentialite"
            className="text-xs sm:text-sm font-semibold text-[#0A0D14] dark:text-white hover:text-[#0F2942] dark:hover:text-[#0066C5] underline underline-offset-4 flex items-center gap-1 transition-colors"
          >
            <span>En savoir plus sur la confidentialité</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Bloc 3: Sceau officiel & sources officielles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="relative w-full aspect-square max-w-[380px] mx-auto rounded-3xl overflow-hidden bg-white dark:bg-[#0F1217] border border-[#E5E7EB] dark:border-white/10 p-6 shadow-sm flex items-center justify-center">
          <div className="relative w-64 h-64 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-2 border-dashed border-[#0F2942]/30 dark:border-white/20 flex flex-col items-center justify-center p-3 text-center bg-[#F7F7F5] dark:bg-[#14171D] shadow-sm z-10">
              <Scale className="w-6 h-6 text-[#0F2942] dark:text-amber-400 mb-1" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#0A0D14] dark:text-white">RÉPUBLIQUE DU BÉNIN</span>
              <span className="text-[8px] text-[#525866] dark:text-white/60">Journal Officiel</span>
            </div>

            <div className="absolute -top-1 w-20 h-20 rounded-full border border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#14171D] shadow-xs flex flex-col items-center justify-center p-1 text-center">
              <span className="text-[9px] font-bold text-[#0F2942] dark:text-white">APDP</span>
              <span className="text-[7px] text-[#525866] dark:text-white/60">Données</span>
            </div>
            <div className="absolute -left-2 w-20 h-20 rounded-full border border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#14171D] shadow-xs flex flex-col items-center justify-center p-1 text-center">
              <span className="text-[9px] font-bold text-[#008751] dark:text-emerald-400">BARREAU</span>
              <span className="text-[7px] text-[#525866] dark:text-white/60">Avocats</span>
            </div>
            <div className="absolute -right-2 w-20 h-20 rounded-full border border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#14171D] shadow-xs flex flex-col items-center justify-center p-1 text-center">
              <span className="text-[9px] font-bold text-[#E8112D] dark:text-red-400">OCRC</span>
              <span className="text-[7px] text-[#525866] dark:text-white/60">Cyberpolice</span>
            </div>
            <div className="absolute -bottom-1 w-20 h-20 rounded-full border border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#14171D] shadow-xs flex flex-col items-center justify-center p-1 text-center">
              <span className="text-[9px] font-bold text-[#0A0D14] dark:text-white">MNTD</span>
              <span className="text-[7px] text-[#525866] dark:text-white/60">Ministère</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start text-left max-w-md">
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#0A0D14] dark:text-white tracking-tight font-normal mb-3">
            Réponses claires. Sources officielles.
          </h2>
          <p className="text-[#525866] dark:text-white/70 text-sm sm:text-base leading-relaxed mb-6 font-normal">
            Chaque explication est sourcée exclusivement sur les articles en vigueur de la Loi n° 2017-20 modifiée du Code du numérique béninois.
          </p>
          <Link
            href="/faq"
            className="text-xs sm:text-sm font-semibold text-[#0A0D14] dark:text-white hover:text-[#0F2942] dark:hover:text-[#0066C5] underline underline-offset-4 flex items-center gap-1 transition-colors"
          >
            <span>Consulter les textes officiels &amp; FAQ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Bloc 4: Aucune application à installer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="relative w-full aspect-square max-w-[380px] mx-auto rounded-3xl overflow-hidden bg-white dark:bg-[#0F1217] border border-[#E5E7EB] dark:border-white/10 p-8 shadow-sm flex items-center justify-center order-first md:order-last">
          <div className="flex items-center gap-4 bg-[#F7F7F5] dark:bg-[#14171D] p-5 rounded-2xl border border-[#E5E7EB] dark:border-white/10">
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#0F1217] border border-[#E5E7EB] dark:border-white/10 flex items-center justify-center shadow-xs">
              <Globe className="w-7 h-7 text-[#0F2942] dark:text-[#0066C5]" />
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#0F1217] border border-[#E5E7EB] dark:border-white/10 flex items-center justify-center shadow-xs">
              <Shield className="w-7 h-7 text-[#008751] dark:text-emerald-400" />
            </div>
            <div className="w-14 h-14 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-xs">
              <MessageSquare className="w-7 h-7" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start text-left max-w-md">
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#0A0D14] dark:text-white tracking-tight font-normal mb-3">
            Aucune application à installer.
          </h2>
          <p className="text-[#525866] dark:text-white/70 text-sm sm:text-base leading-relaxed mb-6 font-normal">
            Ouvrez simplement LexBénin dans votre navigateur web sur smartphone, tablette ou ordinateur, ou échangez directement sur WhatsApp au quotidien.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/chat"
              className="text-xs sm:text-sm font-semibold text-[#0A0D14] dark:text-white hover:text-[#0F2942] dark:hover:text-[#0066C5] underline underline-offset-4 flex items-center gap-1 transition-colors"
            >
              <span>Poser une question en ligne</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "22900000000"}?text=Bonjour%20LexB%C3%A9nin`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm font-semibold text-[#008751] dark:text-[#25D366] hover:underline flex items-center gap-1 transition-colors"
            >
              <span>Ouvrir sur WhatsApp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
