import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Provider } from "jotai";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_NAME = "Dica México";
const APP_DEFAULT_TITLE = "Dica México";
const APP_TITLE_TEMPLATE = "%s - Dica México";
const APP_DESCRIPTION = "Aplicación de auditoría de Dica México";

export const metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/public/manifest.json",
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: "black-translucent",
  },
  themeColor: "#020381",
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: APP_DEFAULT_TITLE,
    description: APP_DESCRIPTION,
    url: "https://dica-auditofin.vercel.app",
    siteName: APP_NAME,
    images: "/public/images/android-chrome-512x512.png",
  },
  icons: {
    icon: "/public/images/android-chrome-512x512.png",
  },
};
export const viewport = {
  themeColor: "#020381",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es-MX">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/public/favicon/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/public/favicon/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/public/favicon/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
        </header>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
