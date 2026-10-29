"use client";

import React, { useEffect } from "react";
import PillButton from "@/components/ui/PillButton";

/**
 * ErrorBoundary racine — Empêche toute page blanche en cas d'erreur runtime React 19 / Fast Refresh.
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erreur d'application Next.js capturée:", error);
  }, [error]);

  return (
    <div
      data-testid="error-boundary"
      className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 my-auto"
    >
      <h2 className="font-editorial text-3xl font-medium text-[#0A0D14] dark:text-white mb-2">
        Une difficulté temporaire est survenue
      </h2>
      <p className="font-sans text-sm text-[#525866] dark:text-white/70 max-w-md mb-6">
        {error.message || "L'affichage n'a pas pu être rechargé correctement par React."}
      </p>
      <PillButton variant="primary" onClick={() => reset()}>
        Réessayer le chargement
      </PillButton>
    </div>
  );
}
