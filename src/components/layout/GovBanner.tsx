"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Lock, Landmark } from "lucide-react";

export default function GovBanner() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section
      aria-label="Portail officiel de la République du Bénin"
      className="w-full bg-[#F0EFEA] border-b border-[#E5E7EB] text-[#525866] text-xs transition-colors"
    >
      <div className="max-w-6xl mx-auto px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Drapeau béninois */}
          <span
            className="inline-flex items-center h-3 w-4.5 overflow-hidden rounded-[2px] border border-black/15 shadow-2xs"
            aria-hidden="true"
          >
            <span className="w-1/3 h-full bg-[#008751]" />
            <span className="w-1/3 h-full bg-[#FCD116]" />
            <span className="w-1/3 h-full bg-[#E8112D]" />
          </span>
          <span className="font-medium text-[#0A0D14]">
            Un site officiel de la République du Bénin
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 font-medium text-[#0F2942] hover:text-[#001428] hover:underline focus:outline-none"
          aria-expanded={isOpen}
          aria-controls="gov-banner-details"
        >
          <span>Comment le reconnaître</span>
          {isOpen ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {isOpen && (
        <div
          id="gov-banner-details"
          className="bg-white border-t border-[#E5E7EB] px-6 py-4 transition-all duration-200"
        >
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#525866]">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#F7F7F5] rounded-lg text-[#0F2942] shrink-0 mt-0.5">
                <Landmark className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-[#0A0D14] mb-1">
                  Les sites officiels utilisent le domaine .bj
                </p>
                <p className="leading-relaxed">
                  Une adresse web se terminant par <strong className="text-[#0A0D14]">.bj</strong> appartient officiellement à un ministère, une agence d&apos;État ou un service public de la République du Bénin.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#F7F7F5] rounded-lg text-[#0F2942] shrink-0 mt-0.5">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-[#0A0D14] mb-1">
                  Les sites officiels sont sécurisés par HTTPS
                </p>
                <p className="leading-relaxed">
                  Le cadenas ou la mention <strong className="text-[#0A0D14]">https://</strong> garantit que vos échanges sont chiffrés et confidentiels, conformément aux normes de l&apos;ANSSI Bénin et du Code du numérique.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
