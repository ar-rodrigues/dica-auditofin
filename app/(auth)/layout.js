import { Provider } from "jotai";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@ant-design/v5-patch-for-react-19";

import { Layout } from "antd";

import { Content, Footer } from "antd/es/layout/layout";
import Navbar from "@/components/Navbar";

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
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/favicon-32x32.png",
  },
};

export const viewport = {
  themeColor: "#020381",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es-MX">
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="Dica Mx" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <Provider>
          <AntdRegistry>
            <Layout style={{ maxWidth: "100%", margin: 0 }}>
              <Navbar />
              <Content>{children}</Content>
              <Footer className="bg-primary! text-white! text-center">
                Dica ©2025 Created by Dica
              </Footer>
            </Layout>
          </AntdRegistry>
        </Provider>
      </body>
    </html>
  );
}
