"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFormats } from "@/hooks/useFormats";
import FormatForm from "@/components/Formats/FormatForm";
import { Spin, Button } from "antd";

const EditFormatPage = () => {
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  const { formats, updateFormat, loading, fetchFormat } = useFormats();
  const [headers, setHeaders] = useState([]);
  const [initialValues, setInitialValues] = useState({});
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadFormat() {
      let format = formats.find((f) => f.id === id);
      if (!format) {
        setIsLoading(true);
        const result = await fetchFormat(id);
        format = result?.data;
      }
      if (format && isMounted) {
        setInitialValues({ name: format.name });
        setHeaders(
          (format.headers || []).map((h) => ({ ...h, name: h.header }))
        );
        setDescription(format.description || "");
        setIsLoading(false);
      }
    }
    loadFormat();
    return () => {
      isMounted = false;
    };
  }, [formats, id]);

  const handleSubmit = async (values) => {
    const mappedHeaders = (values.headers || []).map((h, idx) => ({
      id: h.id,
      header: h.name,
      type: h.type,
      order: h.order ?? idx,
    }));
    await updateFormat(id, { ...values, description, headers: mappedHeaders });
    router.push("/formats");
  };

  return (
    <>
      <Button onClick={() => router.back()} style={{ marginBottom: 16 }}>
        Volver
      </Button>
      {isLoading ? (
        <Spin size="large" style={{ display: "block", margin: "40px auto" }} />
      ) : (
        <FormatForm
          title="Editar formato"
          initialValues={initialValues}
          headers={headers}
          setHeaders={setHeaders}
          nombreFormato={initialValues.name}
          setNombreFormato={(name) =>
            setInitialValues((prev) => ({ ...prev, name }))
          }
          description={description}
          setDescription={setDescription}
          onSubmit={handleSubmit}
          loading={loading}
        />
      )}
    </>
  );
};

export default EditFormatPage;
