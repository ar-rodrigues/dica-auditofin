import React, { useState } from "react";
import { Space } from "antd";
import RequirementHeader from "./requirement/RequirementHeader";
import RequirementHistory from "./requirement/RequirementHistory";
import RequirementActions from "./requirement/RequirementActions";

const RequirementDetails = ({
  requirement,
  isAuditor = false,
  onApprove,
  onReject,
  onUpload,
  buttonText = "Enviar",
  acceptedFileTypes = "",
  maxFileSize = 10, // in MB
}) => {
  const [comment, setComment] = useState("");

  // Format date string to avoid hydration issues
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return dateString;
    }
  };

  if (!requirement) return <div>Requerimiento no encontrado</div>;

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      {/* Header Section */}
      <RequirementHeader requirement={requirement} formatDate={formatDate} />

      {/* History Section */}
      <RequirementHistory requirement={requirement} formatDate={formatDate} />

      {/* Action Section */}
      <RequirementActions
        requirement={requirement}
        isAuditor={isAuditor}
        comment={comment}
        setComment={setComment}
        onApprove={onApprove}
        onReject={onReject}
        onUpload={onUpload}
        buttonText={buttonText}
        acceptedFileTypes={acceptedFileTypes}
        maxFileSize={maxFileSize}
      />
    </Space>
  );
};

export default RequirementDetails;
