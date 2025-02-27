"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Layout, Button, Typography, Carousel } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import "@ant-design/v5-patch-for-react-19";
import { officeImage, teamImage, teamImage2, teamImage3 } from "@/utils/atoms";
const { Content } = Layout;
const { Title, Text } = Typography;

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const carouselItems = [
    {
      title: "Innovación Digital",
      description:
        "Transformamos tu negocio con soluciones tecnológicas avanzadas",
      bgColor: "from-primary to-blue-600",
      image: officeImage,
    },
    {
      title: "Auditoría Profesional",
      description: "Servicios de auditoría con los más altos estándares",
      bgColor: "from-primary to-blue-800",
      image: teamImage,
    },
    {
      title: "Consultoría Especializada",
      description: "Años de experiencia en el mercado nos respaldan",
      bgColor: "from-primary to-blue-900",
      image: teamImage2,
    },
    {
      title: "Soporte Técnico",
      description: "Soporte técnico especializado para tu empresa",
      bgColor: "from-primary to-blue-700",
      image: teamImage3,
    },
  ];

  return (
    <Layout className="min-h-screen bg-terciary">
      <Content>
        <Carousel autoplay effect="fade" className="w-full">
          {carouselItems.map((item, index) => (
            <div key={index}>
              <div className="relative min-h-[80vh]">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    style={{ objectFit: "cover" }}
                    priority={index === 0}
                  />
                  {/* Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${item.bgColor} opacity-75`}
                  />
                </div>

                {/* Content */}
                <div className="relative flex flex-col items-center justify-center min-h-[80vh]">
                  <div
                    className={`max-w-4xl mx-auto space-y-8 p-8 text-center ${
                      mounted ? "animate-fadeIn" : "opacity-0"
                    }`}
                  >
                    <Title
                      level={1}
                      className="text-white text-5xl mb-0 font-bold"
                    >
                      {item.title}
                    </Title>
                    <Text className="text-white text-xl opacity-90 block">
                      {item.description}
                    </Text>
                    <Button
                      type="default"
                      size="large"
                      className="mt-8 bg-secondary text-white border-none hover:bg-opacity-90 hover:scale-105 transition-all duration-300"
                      onClick={() => (window.location.href = "/login")}
                    >
                      Comenzar ahora
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>

        {/* Features Section */}
        <div className="py-20 px-8 bg-terciary">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Innovación",
                desc: "Soluciones tecnológicas de vanguardia",
              },
              {
                title: "Calidad",
                desc: "Servicios con los más altos estándares",
              },
              {
                title: "Experiencia",
                desc: "Años de experiencia en el mercado",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 hover:transform hover:scale-105 transition-all duration-300 cursor-pointer bg-white rounded-lg shadow-md"
              >
                <Title level={3} className="text-primary mb-4">
                  {feature.title}
                </Title>
                <Text className="text-quaternary">{feature.desc}</Text>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary text-white py-20 px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Title level={2} className="text-white">
              ¿Listo para la transformación digital?
            </Title>
            <Text className="text-lg opacity-90 block">
              Únete a nosotros en un viaje hacia la innovación y la excelencia.
              Descubre cómo DICA puede impulsar tu negocio al siguiente nivel.
            </Text>
            <Button
              type="primary"
              size="large"
              icon={<ArrowRightOutlined />}
              className="bg-secondary border-none hover:bg-opacity-90 hover:scale-105 transition-all duration-300"
            >
              Contáctanos
            </Button>
          </div>
        </div>
      </Content>
    </Layout>
  );
}
