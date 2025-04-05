"use client";

import { useEffect, useState, useRef } from "react";
import * as powerbi from "powerbi-client";

export default function PowerBIReport() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const reportContainerRef = useRef(null);
  const powerbiServiceRef = useRef(null);
  const reportRef = useRef(null);

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

  useEffect(() => {
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

        const response = await fetch("/api/getEmbedInfo");
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
          id: process.env.NEXT_PUBLIC_REPORT_ID,
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
          },
        };

        const report = powerbiServiceRef.current.embed(
          reportContainerRef.current,
          config
        );
        reportRef.current = report;

        report.on("loaded", () => {
          setLoading(false);
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

  return (
    <>
      {loading && (
        <div className="text-center py-4">
          <div className="text-gray-600">Cargando reporte...</div>
        </div>
      )}
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div
        ref={reportContainerRef}
        className="w-full h-full"
        style={{ minHeight: "100%" }}
      />
    </>
  );
}
