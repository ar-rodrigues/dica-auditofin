"use client";

import FormatsPageContainer from "@/components/Formats/FormatsPageContainer";

export default function AuditorFormatsPage() {
  return (
    <FormatsPageContainer
      userType="auditor"
      title="Formatos para Auditar"
      subtitle="Estos son los formatos asignados para tu revisión."
    />
  );
}
