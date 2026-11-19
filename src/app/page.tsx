"use client";

import React from "react";
import { useRouter } from "next/navigation";
import HeroSection from "@/components/home/HeroSection";
import StatementSection from "@/components/home/StatementSection";
import FeaturePillars from "@/components/home/FeaturePillars";
import StickyBottomSearch from "@/components/home/StickyBottomSearch";

export default function HomePage() {
  const router = useRouter();

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    router.push(`/chat?q=${encodeURIComponent(query.trim())}`);
  };

  const handleMediaSearch = (file: File, prompt: string) => {
    if (file.size <= 3.5 * 1024 * 1024 && typeof FileReader !== "undefined") {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          sessionStorage.setItem(
            "lexbenin_pending_media",
            JSON.stringify({
              name: file.name,
              type: file.type || "image/png",
              dataUrl: reader.result,
              prompt,
            })
          );
          router.push("/chat?media=pending");
          return;
        } catch {
          // Fallback texte si sessionStorage plein
        }
        handleSearch(
          prompt || `Capture d'écran soumise (${file.name}). Quelles règles s'appliquent ?`
        );
      };
      reader.readAsDataURL(file);
      return;
    }

    handleSearch(
      prompt || `Capture d'écran soumise (${file.name}). Quelles règles s'appliquent ?`
    );
  };

  return (
    <div className="w-full flex flex-col items-center">
      <HeroSection onSearch={handleSearch} onMediaSearch={handleMediaSearch} />

      <StatementSection />

      <FeaturePillars />

      <StickyBottomSearch onSearch={handleSearch} onMediaSearch={handleMediaSearch} />
    </div>
  );
}
