"use client";

import React, { useState } from "react";
import HeroSection from "@/components/home/HeroSection";
import InstantVerdictCard from "@/components/home/InstantVerdictCard";
import StatementSection from "@/components/home/StatementSection";
import FeaturePillars from "@/components/home/FeaturePillars";
import StickyBottomSearch from "@/components/home/StickyBottomSearch";
import { askLegalQuestion } from "@/lib/api";
import { LegalQuestionResponse } from "@/lib/types";

export default function HomePage() {
  const [response, setResponse] = useState<LegalQuestionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      const result = await askLegalQuestion({ question: query, channel: "WEB" });
      setResponse(result);
    } catch {
      // Fallback géré en amont dans askLegalQuestion
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <HeroSection onSearch={handleSearch} isLoading={isLoading} />

      <div id="resultat">
        <InstantVerdictCard
          response={response}
          isLoading={isLoading}
          onClose={() => setResponse(null)}
        />
      </div>

      <StatementSection />

      <FeaturePillars />

      <StickyBottomSearch onSearch={handleSearch} isLoading={isLoading} />
    </div>
  );
}
