"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, ChevronDown, ArrowRight, HelpCircle, MessageSquare } from "lucide-react";
import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import CivicCard from "@/components/ui/CivicCard";
import PillButton from "@/components/ui/PillButton";
import { fetchFAQ } from "@/lib/api";
import { FAQItem } from "@/lib/types";

export default function FAQPage() {
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFAQ() {
      setIsLoading(true);
      try {
        const items = await fetchFAQ();
        setFaqItems(items);
      } catch {
        // Fallback pris en compte dans fetchFAQ
      } finally {
        setIsLoading(false);
      }
    }
    loadFAQ();
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    faqItems.forEach((item) => {
      if (item.categorie) set.add(item.categorie);
    });
    return ["all", ...Array.from(set)];
  }, [faqItems]);

  const filteredItems = useMemo(() => {
    return faqItems.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.categorie === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const contentToSearch = `${item.question} ${item.reponse || item.resume || ""} ${item.categorie || ""}`.toLowerCase();
      const matchesSearch = !q || contentToSearch.includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [faqItems, searchQuery, selectedCategory]);

  const toggleAccordion = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <PageContainer maxWidth="max-w-4xl" className="pb-24 sm:pb-28">
      <PageHeader
        title="Foire aux questions sur LexBénin"
        subtitle="Tout ce que vous devez savoir sur le fonctionnement, la confidentialité et l'utilisation de la plateforme citoyenne."
        badge="Centre d'aide & Transparence"
      />

      {/* Barre de recherche instantanée */}
      <div className="w-full mb-8">
        <div className="relative w-full max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#525866] dark:text-white/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une question d'utilisation (ex: gratuit, WhatsApp, confidentialité, vocal, avocat)..."
            className="w-full h-12 pl-11 pr-4 rounded-full bg-white dark:bg-[#0F1217] border border-[#E5E7EB] dark:border-white/10 text-sm text-[#0A0D14] dark:text-white placeholder-[#88909E] dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0F2942]/20 dark:focus:ring-white/20 transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Filtres par thématique */}
      {categories.length > 1 && (
        <div className="w-full flex items-center gap-2 mb-10 select-none overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap justify-start sm:justify-center scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const label = cat === "all" ? "Toutes les questions" : cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-medium whitespace-nowrap transition-all cursor-pointer active:scale-95 ${
                  isSelected
                    ? "bg-[#0F2942] dark:bg-[#0066C5] text-white shadow-xs"
                    : "bg-white dark:bg-[#0F1217] border border-[#E5E7EB] dark:border-white/10 text-[#525866] dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {/* Liste des cartes d'accordéon FAQ */}
      <div className="w-full flex flex-col gap-4 mb-16">
        {filteredItems.length === 0 && !isLoading ? (
          <CivicCard className="p-8 text-center flex flex-col items-center justify-center">
            <HelpCircle className="w-8 h-8 text-[#525866] dark:text-white/50 mb-3" />
            <h3 className="font-editorial text-xl text-[#0A0D14] dark:text-white mb-2">
              Aucune question ne correspond à votre recherche.
            </h3>
            <p className="text-xs sm:text-sm text-[#525866] dark:text-white/60 mb-6 max-w-md">
              Vous avez une question juridique spécifique sur le Code du numérique ou vous souhaitez tester l&apos;assistant en direct ?
            </p>
            <PillButton
              href={`/chat?q=${encodeURIComponent(searchQuery)}`}
              variant="primary"
            >
              <MessageSquare className="w-4 h-4 mr-1.5" />
              <span>Interroger l&apos;assistant en direct</span>
            </PillButton>
          </CivicCard>
        ) : (
          filteredItems.map((item, idx) => {
            const isExpanded = expandedIndex === idx;
            const answerText = item.reponse || item.resume || "";
            return (
              <CivicCard
                key={item.question}
                className="overflow-hidden transition-all duration-200"
              >
                {/* En-tête de la question cliquable */}
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-start sm:items-center justify-between gap-4 cursor-pointer focus:outline-none active:bg-black/[0.02] dark:active:bg-white/[0.02] transition-colors"
                  aria-expanded={isExpanded}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-sans font-medium bg-[#0F2942]/5 dark:bg-white/10 text-[#0F2942] dark:text-white/80 shrink-0 self-start sm:self-auto">
                      {item.categorie}
                    </span>
                    <span className="font-sans font-medium text-base sm:text-lg text-[#0A0D14] dark:text-white leading-snug">
                      {item.question}
                    </span>
                  </div>
                  <div className="p-1 rounded-full text-[#525866] dark:text-white/60 shrink-0 mt-1 sm:mt-0">
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isExpanded ? "rotate-180 text-[#0F2942] dark:text-[#0066C5]" : "rotate-0"
                      }`}
                    />
                  </div>
                </button>

                {/* Corps de réponse dépliable */}
                {isExpanded && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-1 border-t border-black/5 dark:border-white/10 animate-in fade-in duration-200">
                    <p className="text-sm sm:text-base text-[#525866] dark:text-white/80 leading-relaxed mb-4">
                      {answerText}
                    </p>

                    {item.actionLabel && item.actionHref && (
                      <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
                        {item.actionHref.startsWith("http") ? (
                          <a
                            href={item.actionHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#0F2942] dark:bg-[#0066C5] text-white hover:bg-[#0F2942]/90 dark:hover:bg-[#1A75D0] transition-colors"
                          >
                            <span>{item.actionLabel}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <PillButton
                            href={item.actionHref}
                            variant="secondary"
                            className="text-xs"
                          >
                            <span>{item.actionLabel}</span>
                            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                          </PillButton>
                        )}

                        <span className="text-[11px] font-mono text-[#525866] dark:text-white/50">
                          {item.article || "LexBénin Citoyen"}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </CivicCard>
            );
          })
        )}
      </div>

      {/* Appel bas : orientation vers juriste en cas de litige */}
      <CivicCard elevated className="w-full p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-editorial text-2xl text-[#0A0D14] dark:text-white font-normal mb-1">
            Une question juridique complexe ou un litige en cours ?
          </h3>
          <p className="text-xs sm:text-sm text-[#525866] dark:text-white/70">
            Une orientation gratuite et confidentielle vers la Clinique Juridique UAC et le Barreau du Bénin est disponible.
          </p>
        </div>
        <PillButton href="/escalade" variant="secondary" className="shrink-0">
          <span>Parler à un juriste</span>
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </PillButton>
      </CivicCard>
    </PageContainer>
  );
}
