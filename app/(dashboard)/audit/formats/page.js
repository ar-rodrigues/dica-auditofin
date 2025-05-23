"use client";

import FormatsPageContainer from "@/components/Formats/FormatsPageContainer";

export default function AuditFormatsPage() {
  return (
    <FormatsPageContainer
      userType="entity"
      onlyPredecessor={true}
      title="Formatos Asignados"
      subtitle="Estos son los formatos asignados a tu entidad."
    />
  );
}
