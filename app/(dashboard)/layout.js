import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@ant-design/v5-patch-for-react-19";

import { Layout, Space } from "antd";

import { Header, Content, Footer } from "antd/es/layout/layout";
import Sidebar from "@/components/Sidebar";
import LogoutButton from "@/components/Logout";
import LoadingOverlay from "@/components/LoadingOverlay";

// export const metadata = {
//   title: "Dica Auditofin",
//   description: "Web Plataform for public audits",
//   icons: {
//     icon: "/icon.png", // /public/icon.png
//     shortcut: "/shortcut-icon.png",
//     apple: "/apple-icon.png",
//     // you can specify multiple sizes
//     other: {
//       rel: "apple-touch-icon-precomposed",
//       url: "/apple-touch-icon-precomposed.png",
//     },
//   },
// };

export default function DashboardLayout({ children }) {
  return (
    <>
      <LoadingOverlay />
      <Layout
        hasSider={true}
        style={{
          height: "100%",
        }}
      >
        <Sidebar />
        <Layout>
          <Header
            style={{
              backgroundColor: "white",
              display: "flex",
              justifyContent: "end",
            }}
          >
            <LogoutButton />
          </Header>
          <Content>{children}</Content>

          <Footer
            style={{
              textAlign: "center",
            }}
          >
            Dica ©{new Date().getFullYear()}
          </Footer>
        </Layout>
      </Layout>
    </>
  );
}
