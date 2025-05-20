"use client";
import React, { useEffect, useState } from "react";

export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    updateOnlineStatus();
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div
      style={{
        width: "100%",
        background: "#ff4d4f",
        color: "white",
        textAlign: "center",
        padding: "8px 0",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
      }}
    >
      Sin conexión a internet. Algunas funciones pueden no estar disponibles.
    </div>
  );
}
