"use client";

import { useEffect, useState, useRef } from "react";
import * as powerbi from "powerbi-client";
import { Result, Button, Card, Empty } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

export default function PowerBIReport({ id, reportId, iframeUrl }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const reportContainerRef = useRef(null);
  const powerbiServiceRef = useRef(null);
  const reportRef = useRef(null);

  console.log("iframeUrl", iframeUrl);

  useEffect(() => {
    // If iframeUrl is present, do not render PowerBIReport logic
    if (iframeUrl) {
      setError(null);
      setLoading(false);
      return;
    }
    if (!id || !reportId) {
      setError("No se ha especificado un reporte válido");
      setLoading(false);
      return;
    }

    const embedReport = async () => {
      try {
        // Initialize Power BI service if not already initialized
        if (!powerbiServiceRef.current) {
          powerbiServiceRef.current = new powerbi.service.Service(
            powerbi.factories.hpmFactory,
            powerbi.factories.wpmpFactory,
            powerbi.factories.routerFactory
          );
        }

        const response = await fetch(`/api/getEmbedInfo?id=${id}`);
        const embedInfo = await response.json();

        if (embedInfo.status !== 200) {
          setError(embedInfo.error || "Error al cargar el reporte");
          setLoading(false);
          return;
        }

        if (!reportContainerRef.current) {
          setError("No se encontró el contenedor del reporte");
          setLoading(false);
          return;
        }

        // Reset any existing Power BI components
        powerbiServiceRef.current.reset(reportContainerRef.current);

        const config = {
          type: "report",
          tokenType: powerbi.models.TokenType.Embed,
          accessToken: embedInfo.accessToken,
          embedUrl: embedInfo.embedUrl,
          id: reportId,
          permissions: powerbi.models.Permissions.All,
          settings: {
            layoutType: isMobile
              ? powerbi.models.LayoutType.MobilePortrait
              : powerbi.models.LayoutType.Custom,
            panes: {
              filters: {
                expanded: false,
                visible: false,
              },
              pageNavigation: {
                visible: true,
              },
            },
            defaultPage: "Dashboard",
            zoomLevel: isMobile ? 0.7 : 0.85,
            background: powerbi.models.BackgroundType.Transparent,
          },
        };

        const report = powerbiServiceRef.current.embed(
          reportContainerRef.current,
          config
        );
        reportRef.current = report;

        report.on("loaded", () => {
          setLoading(false);
          // Open on the first page
          report.getPages().then((pages) => {
            if (pages && pages.length > 0) {
              pages[0].setActive();
            }
          });
        });

        report.on("error", (event) => {
          setError("Error al cargar el reporte: " + event.detail);
          setLoading(false);
        });
      } catch (error) {
        setError("Error al cargar el reporte: " + error.message);
        setLoading(false);
      }
    };

    embedReport();
  }, [isMobile]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth <= 768;
      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile);
        if (reportRef.current) {
          const layoutType = newIsMobile
            ? powerbi.models.LayoutType.MobilePortrait
            : powerbi.models.LayoutType.Custom;
          reportRef.current
            .updateSettings({
              layoutType: layoutType,
            })
            .catch((error) => {
              console.error("Error al actualizar el layout:", error);
            });
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  return (
    <>
      {loading && (
        <div className="text-center py-4">
          <div className="text-gray-600">Cargando reporte...</div>
        </div>
      )}
      {error && (
        <div className="w-full h-full flex items-center justify-center p-4">
          <Card className="max-w-md w-full shadow-sm border-0">
            <Result
              status="error"
              title="Error al cargar el reporte"
              subTitle={
                error.includes("No se encontró el contenedor")
                  ? "El contenedor del reporte no está disponible. Por favor, recargue la página."
                  : error.includes("Missing report ID")
                  ? "No se ha especificado un ID de reporte válido."
                  : error.includes("Report not found")
                  ? "El reporte solicitado no existe o no está disponible."
                  : error.includes("Missing required Power BI credentials")
                  ? "Las credenciales de Power BI no están configuradas correctamente."
                  : error.includes("Failed to authenticate")
                  ? "Error de autenticación con Azure AD. Por favor, contacte al administrador."
                  : error.includes("Failed to generate Power BI embed token")
                  ? "No se pudo generar el token de Power BI. Por favor, intente nuevamente más tarde."
                  : error
              }
              extra={[
                <Button
                  key="reload"
                  type="primary"
                  icon={<ReloadOutlined />}
                  onClick={() => window.location.reload()}
                >
                  Recargar
                </Button>,
              ]}
            />
          </Card>
        </div>
      )}
      <div
        ref={reportContainerRef}
        className="w-full h-full"
        style={{
          minHeight: "100%",
          minWidth: "100%",
          padding: isMobile ? "0 0.25rem" : "0",
          overflowX: "hidden",
        }}
      />
    </>
  );
}
