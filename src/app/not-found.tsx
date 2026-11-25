import React from "react";
import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import PillButton from "@/components/ui/PillButton";

export default function NotFound() {
  return (
    <PageContainer>
      <PageHeader
        title="Page non trouvée"
        subtitle="La page ou la ressource juridique que vous recherchez n&apos;existe pas ou a été déplacée."
        badge="Erreur 404"
      />
      <div className="flex justify-center mt-8">
        <PillButton href="/" variant="primary">
          Retour à l&apos;accueil
        </PillButton>
      </div>
    </PageContainer>
  );
}
