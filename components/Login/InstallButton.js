import { Button, Modal } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show the install button only for Android
      if (navigator.userAgent.includes("Android")) {
        setShowButton(true);
      }
    };

    const handleAppInstalled = () => {
      setShowButton(false);
    };

    const checkInstallation = () => {
      if (
        navigator.userAgent.includes("iPhone") ||
        navigator.userAgent.includes("iPad")
      ) {
        return window.navigator.standalone;
      }

      if (
        navigator.userAgent.includes("Android") &&
        "serviceWorker" in navigator
      ) {
        return navigator.serviceWorker.controller !== null;
      }

      return false;
    };

    // Initialize button visibility
    setShowButton(!checkInstallation());

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = () => {
    if (navigator.userAgent.includes("Android")) {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === "accepted") {
            console.log("User accepted the A2HS prompt");
          } else {
            console.log("User dismissed the A2HS prompt");
          }
          setDeferredPrompt(null);
        });
      }
    } else if (
      navigator.userAgent.includes("iPhone") ||
      navigator.userAgent.includes("iPad")
    ) {
      Modal.info({
        title: "Instalar aplicación",
        content: (
          <div>
            <p>Para instalar esta aplicación en tu iPhone/iPad:</p>
            <ol style={{ fontSize: "16px", lineHeight: "1.8" }}>
              <li>
                <strong>1.</strong> Abre esta página en Safari{" "}
                <span role="img" aria-label="safari">
                  🧭
                </span>
              </li>
              <li>
                <strong>2.</strong> Toca el botón de Compartir{" "}
                <span role="img" aria-label="share">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    style={{ verticalAlign: "middle" }}
                  >
                    <path
                      fill="currentColor"
                      d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.11 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2z"
                    />
                  </svg>
                </span>
              </li>
              <li>
                <strong>3.</strong> Selecciona &quot;Agregar a Pantalla de
                inicio&quot;{" "}
                <span role="img" aria-label="home">
                  🏠
                </span>
              </li>
            </ol>
            <p style={{ marginTop: "12px", fontSize: "14px", color: "#666" }}>
              Una vez instalada, podrás acceder a la aplicación directamente
              desde tu pantalla de inicio.
            </p>
          </div>
        ),
        okText: "Entendido",
        centered: true,
        width: 400,
      });
    }
  };

  if (!showButton) return null;

  return (
    <Button
      type="text"
      icon={<DownloadOutlined />}
      onClick={handleInstallClick}
      style={{
        position: "fixed",
        bottom: "80px",
        right: "20px",
        borderRadius: "50%",
        width: "48px",
        height: "48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        border: "none",
      }}
    />
  );
}
