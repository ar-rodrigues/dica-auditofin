export default function manifest() {
  return {
    name: "Dica México",
    short_name: "Dica México",
    description: "Aplicación de auditoría de Dica México",
    start_url: "/(auth)/login",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#020381",
    orientation: "portrait",
    icons: [
      {
        src: "/images/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
