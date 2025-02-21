"use client";
import Image from "next/image";
import { Layout, Button, Space, Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import Logo from "@/public/logo.png";
import { useRouter } from "next/navigation";
import "@ant-design/v5-patch-for-react-19";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export default function Home() {
  const router = useRouter();
  return (
    <Layout className="min-h-screen">
      {/* Hero Section */}
      <Content>
        <div
          id="hero"
          className="flex flex-col items-center justify-center text-center h-[80vh] bg-gradient-to-b from-blue-600 to-blue-400 text-white"
        >
          <div className="max-w-lg mx-auto space-y-6">
            <Title level={1} className="text-white m-0">
              Bienvenido a DICA
            </Title>
            <Text className="text-white opacity-85 text-lg">
              Tu socio confiable para soluciones innovadoras y auditoría.
            </Text>
          </div>
          <Button
            type="default"
            size="large"
            className="bg-white text-blue-400 hover:bg-blue-700 hover:text-white"
            onClick={() => (window.location.href = "/login")}
          >
            Acceder
          </Button>
        </div>

        {/* Call to Action Section */}
        <div
          id="cta"
          className="flex flex-col items-center justify-center text-center p-8 bg-gray-50 gap-5"
        >
          <div className="space-y-5">
            <Title level={2}>Listo para la transformación digital?</Title>
            <Text className="opacity-75 max-w-lg block">
              Únete a nosotros en un viaje hacia la innovación y la excelencia.
              Contáctanos hoy para empezar con DICA.
            </Text>
            <Button type="primary" icon={<ArrowRightOutlined />}>
              Contáctanos
            </Button>
          </div>
        </div>
      </Content>
    </Layout>
  );
}
