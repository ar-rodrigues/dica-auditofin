import React, { useState } from "react";
import { Modal, Tabs, Upload, Button, message, Input } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { useStringCase } from "@/hooks/useStringCase";

const { Dragger } = Upload;
const { TextArea } = Input;

const customModes = ["lower", "upper", "capitalize", "title"];

const ImportHeadersModal = ({ open, onOk, onCancel }) => {
  const [activeTab, setActiveTab] = useState("archivo");
  const [headers, setHeaders] = useState([]);
  const [copiedText, setCopiedText] = useState("");
  const [loading, setLoading] = useState(false);

  const [caseMode, , cycleCaseMode] = useStringCase(
    headers,
    undefined,
    customModes
  );

  const handleFile = (file) => {
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const headerRow = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })[0];
      //console.log("RAW HEADER ROW:", headerRow);
      if (headerRow && headerRow.length > 0) {
        const filteredHeaders = headerRow
          .filter((h) => h && typeof h === "string" && h.trim() !== "")
          .map((h) => ({ name: h, type: "string" }));
        //console.log("FILTERED HEADERS:", filteredHeaders);
        setHeaders(filteredHeaders);
        if (filteredHeaders.length > 0) {
          message.success("Encabezados importados correctamente");
        } else {
          message.error("No se encontraron encabezados válidos en el archivo");
        }
      } else {
        message.error("No se encontraron encabezados en el archivo");
      }
      setLoading(false);
    };
    reader.onerror = () => {
      message.error("Error al leer el archivo");
      setLoading(false);
    };
    reader.readAsArrayBuffer(file);
    return false;
  };

  const handlePaste = () => {
    const lines = copiedText.split(/\r?\n/).filter(Boolean);
    if (lines.length > 0) {
      const headerLine = lines[0].split(/,|\t|;/).map((h) => h.trim());
      console.log("RAW HEADER LINE (PASTE):", headerLine);
      const filteredHeaders = headerLine
        .filter((h) => h && typeof h === "string" && h.trim() !== "")
        .map((h) => ({ name: h, type: "string" }));
      console.log("FILTERED HEADERS (PASTE):", filteredHeaders);
      setHeaders(filteredHeaders);
      if (filteredHeaders.length > 0) {
        message.success("Encabezados importados correctamente");
      } else {
        message.error(
          "No se encontraron encabezados válidos en el texto pegado"
        );
      }
    } else {
      message.error("No se encontraron encabezados en el texto pegado");
    }
  };

  const handleOk = () => {
    if (headers.length === 0) {
      message.error("No hay encabezados para importar");
      return;
    }
    onOk(headers);
    setHeaders([]);
    setCopiedText("");
  };

  const handleCancel = () => {
    setHeaders([]);
    setCopiedText("");
    onCancel();
  };

  const handleDeleteHeader = (index) => {
    setHeaders((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearHeaders = () => {
    setHeaders([]);
    setCopiedText("");
  };

  const caseModeLabel = {
    lower: "minúsculas",
    upper: "MAYÚSCULAS",
    capitalize: "Primera letra mayúscula",
    title: "Cada Palabra Mayúscula",
  };

  const handleCycleCase = () => {
    const newHeaders = cycleCaseMode();
    setHeaders(newHeaders);
  };

  const tabItems = [
    {
      key: "archivo",
      label: "Subir archivo",
      children: (
        <>
          {loading ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <span>Cargando archivo...</span>
            </div>
          ) : headers.length === 0 ? (
            <Dragger
              accept=".csv,.xls,.xlsx"
              beforeUpload={handleFile}
              showUploadList={false}
              multiple={false}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p>
                Arrastra y suelta un archivo CSV, XLS o XLSX aquí, o haz clic
                para seleccionar
              </p>
            </Dragger>
          ) : null}
        </>
      ),
    },
    {
      key: "copiar",
      label: "Copiar y pegar",
      children: (
        <>
          <TextArea
            rows={4}
            value={copiedText}
            onChange={(e) => setCopiedText(e.target.value)}
            placeholder="Pega aquí la fila de encabezados desde Excel o CSV"
          />
          <Button style={{ marginTop: 8 }} onClick={handlePaste}>
            Procesar encabezados
          </Button>
        </>
      ),
    },
  ];

  return (
    <Modal
      open={open}
      title="Importar encabezados"
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Importar"
      cancelText="Cancelar"
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
      {headers.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <Button
            style={{ marginBottom: 12, marginRight: 8 }}
            onClick={handleCycleCase}
            type="default"
          >
            Formato del texto: {caseModeLabel[caseMode]}
          </Button>
          <Button
            style={{ marginBottom: 12 }}
            onClick={handleClearHeaders}
            type="default"
            danger
          >
            Limpiar encabezados
          </Button>
          <br />
          <strong>Encabezados importados:</strong>
          <ul style={{ marginTop: 8, paddingLeft: 20 }}>
            {headers.map((header, idx) => (
              <li
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <span style={{ flex: 1 }}>{header.name}</span>
                <Button
                  danger
                  size="small"
                  onClick={() => handleDeleteHeader(idx)}
                >
                  Eliminar
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Modal>
  );
};

export default ImportHeadersModal;
