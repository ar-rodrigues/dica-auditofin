import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Show the install button only for Android
      if (navigator.userAgent.includes("Android")) {
        setIsInstallable(true);
      }
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Check if already installed
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

    // Only show if not installed
    if (!checkInstallation() && navigator.userAgent.includes("Android")) {
      setIsInstallable(true);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (navigator.userAgent.includes("Android")) {
      if (deferredPrompt) {
        try {
          // Show the prompt
          await deferredPrompt.prompt();
          // Wait for the user to respond to the prompt
          const choiceResult = await deferredPrompt.userChoice;
          if (choiceResult.outcome === "accepted") {
            console.log("User accepted the install prompt");
          } else {
            console.log("User dismissed the install prompt");
          }
          // Clear the saved prompt since it can't be used again
          setDeferredPrompt(null);
        } catch (err) {
          console.error("Error during installation:", err);
        }
      }
    } else if (
      navigator.userAgent.includes("iPhone") ||
      navigator.userAgent.includes("iPad")
    ) {
      alert(
        "Para instalar esta aplicación, ábrela en Safari, toca el botón Compartir y selecciona «Agregar a inicio»."
      );
    }
  };

  if (!isInstallable) return null;

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
        zIndex: 1000,
      }}
    />
  );
}
