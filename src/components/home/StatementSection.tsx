import React from "react";
import { ArrowRight, ShieldCheck, Scale } from "lucide-react";

export default function StatementSection() {
  return (
    <section className="w-full max-w-4xl mx-auto px-6 py-20 text-center">
      <p className="font-editorial text-3xl sm:text-5xl md:text-[54px] leading-[1.22] tracking-[-0.025em] text-[#0A0D14] text-balance">
        LexBénin{" "}
        <span className="inline-flex items-center justify-center w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-[#0F2942] text-white text-base sm:text-xl align-middle mx-1 -mt-1 shadow-sm">
          <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6" />
        </span>{" "}
        utilise l&apos;IA pour apporter des réponses simples issues uniquement des{" "}
        <span className="inline-flex items-center gap-1.5 align-middle mx-1 px-2.5 py-0.5 rounded-full bg-white border border-[#E5E7EB] text-sm sm:text-base font-sans font-medium text-[#0A0D14] shadow-xs">
          <span className="inline-block h-3 w-4 overflow-hidden rounded-[1px] border border-black/10">
            <span className="inline-block w-1/3 h-full bg-[#008751]" />
            <span className="inline-block w-1/3 h-full bg-[#FCD116]" />
            <span className="inline-block w-1/3 h-full bg-[#E8112D]" />
          </span>
          <Scale className="w-4 h-4 text-[#0F2942]" />
          <span>Textes officiels</span>
        </span>{" "}
        de la République du Bénin. C&apos;est gratuit, sans publicité, et{" "}
        <span className="inline-flex items-center gap-1.5 align-middle mx-1 px-2.5 py-0.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-sm sm:text-base font-sans font-medium text-[#065F46]">
          <ShieldCheck className="w-4 h-4 text-[#10B981]" />
          <span>Vie privée protégée</span>
        </span>.
      </p>
    </section>
  );
}
