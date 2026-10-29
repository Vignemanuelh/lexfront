import React from "react";
import Link from "next/link";
import BeninFlag from "@/components/ui/BeninFlag";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#E5E7EB]/60 dark:border-white/10 pt-20 pb-36 sm:pb-44 px-6 flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Navigation éditoriale monumentale */}
        <nav className="flex flex-col items-center gap-3 sm:gap-4 mb-20" aria-label="Navigation secondaire">
          <Link
            href="#comment-ca-marche"
            className="font-editorial text-3xl sm:text-4xl md:text-5xl text-[#0A0D14] dark:text-white hover:text-[#525866] dark:hover:text-white/70 transition-colors"
          >
            Comment ça fonctionne
          </Link>
          <Link
            href="#confidentialite"
            className="font-editorial text-3xl sm:text-4xl md:text-5xl text-[#0A0D14] dark:text-white hover:text-[#525866] dark:hover:text-white/70 transition-colors"
          >
            Confidentialité
          </Link>
          <Link
            href="#a-propos"
            className="font-editorial text-3xl sm:text-4xl md:text-5xl text-[#0A0D14] dark:text-white hover:text-[#525866] dark:hover:text-white/70 transition-colors"
          >
            À propos & Déontologie
          </Link>
          <Link
            href="#roadmap"
            className="font-editorial text-3xl sm:text-4xl md:text-5xl text-[#0A0D14] dark:text-white hover:text-[#525866] dark:hover:text-white/70 transition-colors"
          >
            Feuille de route
          </Link>
          <Link
            href="#faq"
            className="font-editorial text-3xl sm:text-4xl md:text-5xl text-[#0A0D14] dark:text-white hover:text-[#525866] dark:hover:text-white/70 transition-colors"
          >
            Foire aux questions (FAQ)
          </Link>
          <Link
            href="#contact"
            className="font-editorial text-3xl sm:text-4xl md:text-5xl text-[#0A0D14] dark:text-white hover:text-[#525866] dark:hover:text-white/70 transition-colors"
          >
            Signaler une erreur
          </Link>
        </nav>

        {/* Immense lettrage mot-symbole "LexBénin" façon America.gov */}
        <div className="w-full text-center my-6 select-none">
          <h2 className="font-editorial text-7xl sm:text-9xl md:text-[140px] lg:text-[170px] leading-none text-[#0A0D14] dark:text-white tracking-[-0.04em] font-normal">
            LexBénin
          </h2>
        </div>

        {/* Mentions républicaines tripartites encadrées */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 items-center pt-8 pb-10 border-t border-b border-[#E5E7EB]/70 dark:border-white/10 text-xs text-[#525866] dark:text-white/60">
          <div className="flex items-center justify-center md:justify-start gap-2.5">
            <BeninFlag className="h-4 w-6" />
            <span className="text-left font-normal">Service d&apos;intérêt général pour les citoyens béninois</span>
          </div>
          <div className="text-center font-normal">
            En partenariat avec le Barreau du Bénin & l&apos;Université d&apos;Abomey-Calavi
          </div>
          <div className="text-center md:text-right font-mono text-[11px] text-[#525866] dark:text-white/60">
            Conforme Loi N° 2017-20 modifiée
          </div>
        </div>

        {/* Liens légaux */}
        <div className="pt-6 pb-4 flex flex-wrap items-center justify-center gap-6 text-xs text-[#525866] dark:text-white/60">
          <Link href="#mentions" className="hover:underline">Mentions légales</Link>
          <Link href="#donnees" className="hover:underline">Protection des données</Link>
          <Link href="#cgu" className="hover:underline">Conditions d&apos;utilisation</Link>
          <span>Français (Bénin)</span>
        </div>
      </div>
    </footer>
  );
}
