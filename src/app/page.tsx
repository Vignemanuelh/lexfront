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

  return (
    <div className="w-full flex flex-col items-center">
      <HeroSection onSearch={handleSearch} />

      <StatementSection />

      <FeaturePillars />

      <StickyBottomSearch onSearch={handleSearch} />
    </div>
  );
}
