"use client";
import React, { useState } from "react";
import { useFormats } from "@/hooks/useFormats";
import FormatForm from "@/components/Formats/FormatForm";
import { useFetchUser } from "@/hooks/useFetchUser";
import { useRouter } from "next/navigation";
import { Modal, Button } from "antd";

const initialHeaders = [];

const CreateFormatPage = () => {
  const [headers, setHeaders] = useState(initialHeaders);
  const [nombreFormato, setNombreFormato] = useState("");
  const [description, setDescription] = useState("");
  const { createFormat, loading } = useFormats();
  const { user, loading: userLoading } = useFetchUser();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const handleSubmit = async (values) => {
    if (!user) {
      // Puedes mostrar un mensaje de error aquí si lo deseas
      return;
    }
    // Map headers to correct format
    const mappedHeaders = (values.headers || []).map((h, idx) => ({
      header: h.name,
      type: h.type,
      order: idx,
    }));
    const result = await createFormat({
      ...values,
      name: nombreFormato,
      description,
      created_by: user.id,
      headers: mappedHeaders,
    });
    if (result && result.success) {
      setModalVisible(true);
    }
    setHeaders([]);
    setNombreFormato("");
    setDescription("");
  };

  const handleNew = () => {
    setModalVisible(false);
    setHeaders([]);
    setNombreFormato("");
    setDescription("");
  };

  const handleBack = () => {
    setModalVisible(false);
    router.push("/formats");
  };

  return (
    <>
      <Button onClick={() => router.back()} style={{ marginBottom: 16 }}>
        Volver
      </Button>
      <FormatForm
        title="Crear nuevo formato"
        headers={headers}
        setHeaders={setHeaders}
        nombreFormato={nombreFormato}
        setNombreFormato={setNombreFormato}
        description={description}
        setDescription={setDescription}
        onSubmit={handleSubmit}
        loading={loading || userLoading}
      />
      <Modal
        open={modalVisible}
        title="Formato creado exitosamente"
        onCancel={handleBack}
        footer={[
          <Button key="new" onClick={handleNew}>
            Crear otro formato
          </Button>,
          <Button key="back" type="primary" onClick={handleBack}>
            Volver a la lista
          </Button>,
        ]}
      >
        <p>¿Qué deseas hacer ahora?</p>
      </Modal>
    </>
  );
};

export default CreateFormatPage;
