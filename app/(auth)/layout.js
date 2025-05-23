import { Provider } from "jotai";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@ant-design/v5-patch-for-react-19";

import { Layout } from "antd";

import { Content, Footer } from "antd/es/layout/layout";
import Navbar from "@/components/Navbar";
import OfflineBanner from "@/components/common/OfflineBanner";

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
  manifest: "/manifest.json",
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
      <body>
        <OfflineBanner />
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
