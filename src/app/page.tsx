"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import HeroSection from "@/components/home/HeroSection";
import StatementSection from "@/components/home/StatementSection";
import FeaturePillars from "@/components/home/FeaturePillars";
import StickyBottomSearch from "@/components/home/StickyBottomSearch";
import { preparePendingMediaPayload } from "@/lib/mediaUtils";

export default function HomePage() {
  const router = useRouter();
  const [mediaError, setMediaError] = useState<string | null>(null);

  const handleSearch = useCallback(
    (query: string) => {
      if (!query.trim()) return;
      setMediaError(null);
      router.push(`/chat?q=${encodeURIComponent(query.trim())}`);
    },
    [router]
  );

  const handleMediaSearch = useCallback(
    async (file: File | Blob, prompt: string) => {
      setMediaError(null);
      const prepared = await preparePendingMediaPayload(file, prompt);
      if (!prepared.ok) {
        setMediaError(prepared.error);
        return;
      }

      try {
        sessionStorage.setItem(
          "lexbenin_pending_media",
          JSON.stringify(prepared.payload)
        );
        router.push("/chat?media=pending");
      } catch {
        setMediaError(
          "Espace de stockage temporaire insuffisant pour ce média. Essayez avec un fichier plus léger ou posez votre question par écrit."
        );
      }
    },
    [router]
  );

  const handleClearMediaError = useCallback(() => {
    setMediaError(null);
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      <HeroSection
        onSearch={handleSearch}
        onMediaSearch={handleMediaSearch}
        mediaError={mediaError}
        onClearMediaError={handleClearMediaError}
      />

      <StatementSection />

      <FeaturePillars />

      <StickyBottomSearch
        onSearch={handleSearch}
        onMediaSearch={handleMediaSearch}
        mediaError={mediaError}
        onClearMediaError={handleClearMediaError}
      />
    </div>
  );
}
