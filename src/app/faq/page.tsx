"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Search, ChevronDown, ChevronUp, ArrowRight, HelpCircle } from "lucide-react";
import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import CivicCard from "@/components/ui/CivicCard";
import PillButton from "@/components/ui/PillButton";
import VerdictBadge from "@/components/ui/VerdictBadge";
import LawArticleBox from "@/components/ui/LawArticleBox";
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
      const matchesSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.resume.toLowerCase().includes(q) ||
        item.article.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [faqItems, searchQuery, selectedCategory]);

  const toggleAccordion = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <PageContainer maxWidth="max-w-4xl" className="pb-24 sm:pb-28">
      <PageHeader
        title="Foire aux questions officielles"
        subtitle="Réponses pré-validées par le juriste référent sur les cas et pratiques numériques les plus fréquents en République du Bénin."
        badge="Recueil citoyen & Jurisprudence"
      />

      {/* Barre de recherche instantanée */}
      <div className="w-full mb-8">
        <div className="relative w-full max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#525866] dark:text-white/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par situation (ex: photo, diffamation, écoute, appel, WhatsApp)..."
            className="w-full h-12 pl-11 pr-4 rounded-full bg-white dark:bg-[#0F1217] border border-[#E5E7EB] dark:border-white/10 text-sm text-[#0A0D14] dark:text-white placeholder-[#88909E] dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0F2942]/20 dark:focus:ring-white/20 transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Filtres par thématique */}
      {categories.length > 1 && (
        <div className="w-full flex flex-wrap items-center justify-center gap-2 mb-10 select-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const label = cat === "all" ? "Toutes les questions" : cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-medium transition-all cursor-pointer ${
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
              Aucune réponse pré-validée ne correspond à votre recherche.
            </h3>
            <p className="text-xs sm:text-sm text-[#525866] dark:text-white/60 mb-6 max-w-md">
              Notre moteur RAG analyse les 646 articles du Code du numérique béninois pour répondre à des situations inédites.
            </p>
            <PillButton
              href={`/chat?q=${encodeURIComponent(searchQuery)}`}
              variant="primary"
            >
              <span>Interroger l&apos;assistant en direct</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </PillButton>
          </CivicCard>
        ) : (
          filteredItems.map((item, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <CivicCard
                key={item.question}
                className="overflow-hidden transition-all duration-200"
              >
                {/* En-tête de la question cliquable */}
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-start sm:items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isExpanded}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-1">
                    <VerdictBadge status={item.statut_legal} />
                    <span className="font-sans font-medium text-base sm:text-lg text-[#0A0D14] dark:text-white leading-snug">
                      {item.question}
                    </span>
                  </div>
                  <div className="p-1 rounded-full text-[#525866] dark:text-white/60 shrink-0 mt-1 sm:mt-0">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {/* Corps de réponse dépliable */}
                {isExpanded && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-1 border-t border-black/5 dark:border-white/10 animate-in fade-in duration-200">
                    <p className="text-sm sm:text-base text-[#525866] dark:text-white/80 leading-relaxed mb-4">
                      {item.resume}
                    </p>

                    <div className="mb-4">
                      <LawArticleBox
                        articleNumber={item.article}
                        articleText={`Disposition officielle de la Loi N° 2017-20 modifiée encadrant cette situation en droit béninois.`}
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <span className="text-[11px] font-mono text-[#525866] dark:text-white/50">
                        {item.categorie ? `Catégorie : ${item.categorie}` : "Code du numérique"}
                      </span>
                      <Link
                        href={`/chat?q=${encodeURIComponent(item.question)}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F2942] dark:text-[#0066C5] hover:underline"
                      >
                        <span>Approfondir cette question avec l&apos;assistant</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
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
            Votre situation est ambiguë ou fait déjà l&apos;objet d&apos;un litige ?
          </h3>
          <p className="text-xs sm:text-sm text-[#525866] dark:text-white/70">
            Une mise en relation confidentielle et gratuite avec le Barreau du Bénin est possible.
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
